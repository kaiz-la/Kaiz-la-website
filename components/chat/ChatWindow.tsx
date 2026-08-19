'use client';

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageBubble } from './MessageBubble';
import { Send, Search, Compass, FileText, Paperclip, X, Loader2, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { messageIn } from '@/lib/motion';
import { TypingIndicator } from './TypingIndicator';
import { StartingChatLoader } from './StartingChatLoader';
import { WelcomeCelebration } from './WelcomeCelebration';
import { Seal } from '@/components/ui/Seal';
import { useImageUpload } from './useImageUpload';

const MEMBER_COOKIE = 'kaizla_member';

function hasMemberCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some((c) => c.startsWith(`${MEMBER_COOKIE}=1`));
}

function setMemberCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${MEMBER_COOKIE}=1; max-age=31536000; path=/; samesite=lax`;
}

interface ChatWindowProps {
  conversationId?: string;
  initialMessages?: UIMessage[];
  /** Set when the chat was opened from a Request Room, so the agent has context. */
  requestRef?: string | null;
}

export function ChatWindow({
  conversationId: currentConversationId,
  initialMessages,
  requestRef,
}: ChatWindowProps) {
  const router = useRouter();
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isStartingNewChat, setIsStartingNewChat] = useState(false);
  // null = no takeover, 'new' = just converted, 'returning' = welcome a member back
  const [celebration, setCelebration] = useState<null | 'new' | 'returning'>(null);
  // The id is fixed for the lifetime of this window; a new chat gets one up front
  // so the very first message already belongs to a conversation.
  const [chatId] = useState(() => currentConversationId ?? crypto.randomUUID());
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { pending, error: uploadError, addFile, clear: clearUpload } = useImageUpload(chatId);

  const { messages, sendMessage, status, stop } = useChat({
    id: chatId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: { id, messages, requestRef: requestRef ?? null },
      }),
    }),
    // The handoff used to arrive as an X-Lead-Complete response header. Once the
    // decision moved into a tool the model calls mid-stream, a header became
    // structurally impossible — headers are sent before the body. It now arrives
    // as a transient data part instead; everything downstream is unchanged.
    onData: (part) => {
      if (part.type === 'data-leadHandoff') {
        document.dispatchEvent(
          new CustomEvent('kaizla-lead-complete', {
            detail: (part.data as { conversationId: string }).conversationId,
          })
        );
      }
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Greet returning members with the crimson welcome screen on a fresh chat.
  useEffect(() => {
    if (hasMemberCookie() && !currentConversationId) setCelebration('returning');
  }, [currentConversationId]);

  // Driven by an event rather than local state so the takeover survives the
  // router.push to /chat/[id] that a first-message handoff triggers.
  useEffect(() => {
    const onComplete = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id && id === chatId) {
        setMemberCookie();
        setCelebration('new');
      }
    };
    document.addEventListener('kaizla-lead-complete', onComplete as EventListener);
    return () => document.removeEventListener('kaizla-lead-complete', onComplete as EventListener);
  }, [chatId]);

  useEffect(() => {
    const handleSetInput = (event: CustomEvent<string>) => setInput(event.detail);
    document.addEventListener('set-chat-input', handleSetInput as EventListener);
    return () => document.removeEventListener('set-chat-input', handleSetInput as EventListener);
  }, []);

  // Carry over a prompt passed from the homepage search bar (/chat?q=...)
  useEffect(() => {
    if (typeof window === 'undefined' || currentConversationId) return;
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) {
      setInput(q);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [currentConversationId]);

  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    // Leave them alone if they've scrolled up to re-read something; yanking the
    // viewport mid-read is worse than a missed autoscroll.
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
    if (!nearBottom) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  // Once the first reply lands, swap the URL to the conversation so a refresh
  // (or the handoff celebration) doesn't lose the thread.
  useEffect(() => {
    if (!currentConversationId && messages.length > 0 && status === 'ready') {
      setIsStartingNewChat(false);
      router.replace(`/chat/${chatId}`);
    }
  }, [currentConversationId, messages.length, status, chatId, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    const attached = pending?.url;
    // A photo on its own is a perfectly good message — don't require words.
    if ((!text && !attached) || isLoading || pending?.uploading) return;
    if (!currentConversationId && messages.length === 0) setIsStartingNewChat(true);
    setInput('');
    clearUpload();
    sendMessage({
      text: text || 'Here is the product I want to source.',
      ...(attached
        ? {
            files: [
              {
                type: 'file' as const,
                mediaType: 'image/jpeg',
                url: attached,
                filename: pending!.filename,
              },
            ],
          }
        : {}),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends; Shift+Enter is a newline. Skip while an IME candidate window
    // is open, or Enter would commit the composition AND send.
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
    }
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) void addFile(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const file = Array.from(e.clipboardData.files).find((f) => f.type.startsWith('image/'));
    if (file) {
      e.preventDefault();
      void addFile(file);
    }
  };

  if (celebration) {
    return (
      <WelcomeCelebration
        returning={celebration === 'returning'}
        onContinue={() => setCelebration(null)}
      />
    );
  }

  if (isStartingNewChat && messages.length === 0) {
    return <StartingChatLoader />;
  }

  const isEmpty = messages.length === 0 && !isLoading && !currentConversationId;

  return (
    <div
      className="relative flex flex-col h-full"
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('Files')) {
          e.preventDefault();
          setIsDragging(true);
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      {isDragging && (
        <div className="pointer-events-none absolute inset-3 z-30 flex items-center justify-center rounded-2xl border-2 border-dashed border-crimson bg-white/80 backdrop-blur-sm">
          <p className="font-display text-lg font-medium text-crimson">
            Drop your product photo
          </p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-28rem)] sm:min-h-[calc(100vh-24rem)] md:min-h-[calc(100vh-22rem)]">
              <Seal size={76} label="KaiExpert" />
              <div className="eyebrow mt-6 text-crimson">Kaiz La · Sourcing Desk</div>
              <h1 className="mt-3 font-display text-3xl font-medium tracking-display-3xl sm:tracking-display-4xl md:tracking-display-5xl text-ink sm:text-4xl md:text-5xl">
                How can we help you <span className="text-gradient-sun italic">source?</span>
              </h1>
              <p className="mt-4 max-w-md px-4 text-base leading-relaxed text-ink-soft sm:text-lg">
                Tell me what you’re looking to source from China and I’ll guide you on suppliers,
                quality, pricing and delivery, then connect you with our sourcing team.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, i) => {
                const prev = messages[i - 1];
                const sameAuthor =
                  prev?.role === message.role &&
                  (prev?.metadata as { authorType?: string } | undefined)?.authorType ===
                    (message.metadata as { authorType?: string } | undefined)?.authorType;
                const isLast = i === messages.length - 1;
                return (
                  <motion.div key={message.id} variants={messageIn} initial="hidden" animate="visible">
                    <MessageBubble
                      message={message}
                      grouped={sameAuthor}
                      streaming={isLast && status === 'streaming' && message.role === 'assistant'}
                    />
                  </motion.div>
                );
              })}
              <AnimatePresence>
                {isLoading && messages[messages.length - 1]?.role === 'user' && <TypingIndicator />}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {isEmpty && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
            {[
              { icon: Search, label: 'What can you source?', prompt: 'What kinds of products can you source for me?' },
              { icon: Compass, label: 'How does it work?', prompt: 'How does sourcing with Kaiz La work?' },
              { icon: FileText, label: 'I need a quote', prompt: "I'd like a quote for a product I want to source." },
            ].map(({ icon: Icon, label, prompt }) => (
              <button
                key={label}
                onClick={() => setInput(prompt)}
                className="focus-ring group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-ink shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-crimson/40 hover:text-crimson hover:shadow-md"
              >
                <Icon className="size-4 text-crimson" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="material-chrome relative">
        {/* A scroll edge, not a rule — content should feel like it passes under
            the composer rather than stopping at a line. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-full h-5 bg-gradient-to-t from-ink/[0.06] to-transparent"
          aria-hidden
        />
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="relative">
            {pending && (
              <div className="mb-2 inline-flex items-center gap-3 rounded-xl border border-border bg-white p-2 pr-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pending.previewUrl}
                  alt={pending.filename}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <span className="max-w-[12rem] truncate text-sm text-ink-soft">
                  {pending.uploading ? 'Uploading…' : pending.filename}
                </span>
                {pending.uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-crimson" />
                ) : (
                  <button
                    type="button"
                    onClick={clearUpload}
                    aria-label="Remove photo"
                    className="focus-ring rounded-full p-1 text-muted-foreground transition-colors hover:text-crimson"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            {uploadError && (
              <p className="mb-2 text-sm font-medium text-crimson">{uploadError}</p>
            )}
            <div className="flex items-end gap-2 rounded-3xl border border-border bg-white p-1.5 pl-2 shadow-ink transition-shadow duration-150 focus-within:border-crimson/40 focus-within:shadow-ink-focus">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                aria-label="Attach a product photo"
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-porcelain hover:text-crimson disabled:opacity-40"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Tell us what you'd like to source…"
                disabled={isLoading}
                // field-sizing-content grows the box with the text natively —
                // no scroll-height measuring, no layout thrash.
                className="max-h-40 min-h-11 flex-1 resize-none self-center border-none bg-transparent px-0 py-2.5 text-base text-ink shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
              />
              {isLoading ? (
                <Button
                  type="button"
                  onClick={() => stop()}
                  aria-label="Stop generating"
                  size="icon"
                  className="focus-ring h-11 w-11 shrink-0 rounded-full bg-ink text-white transition duration-200 hover:bg-black"
                >
                  <Square className="h-4 w-4 fill-current" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  aria-label="Send message"
                  disabled={pending?.uploading || (!input.trim() && !pending?.url)}
                  className={`focus-ring h-11 w-11 shrink-0 rounded-full transition duration-200 ${
                    (input.trim() || pending?.url) && !pending?.uploading
                      ? 'bg-crimson text-white hover:bg-[var(--color-crimson-deep)] hover:shadow-lift-xs'
                      : 'bg-crimson/40 text-white/70'
                  }`}
                  size="icon"
                >
                  <Send className="w-5 h-5" />
                </Button>
              )}
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              A Kaiz La sourcing specialist reviews every conversation.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
