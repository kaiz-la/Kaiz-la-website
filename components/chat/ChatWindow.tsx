'use client';

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore, type Message as MessageType } from '@/store/chatStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "./MessageBubble";
import { Send, Search, Compass, FileText } from "lucide-react";
import { TypingIndicator } from './TypingIndicator';
import { StartingChatLoader } from './StartingChatLoader';
import { WelcomeCelebration } from './WelcomeCelebration';
import { Seal } from "@/components/ui/Seal";

const MEMBER_COOKIE = 'kaizla_member';

function hasMemberCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some((c) => c.startsWith(`${MEMBER_COOKIE}=1`));
}

function setMemberCookie(): void {
  if (typeof document === 'undefined') return;
  // Remember the converted user for a year.
  document.cookie = `${MEMBER_COOKIE}=1; max-age=31536000; path=/; samesite=lax`;
}

interface ChatWindowProps {
  conversationId?: string;
}

export function ChatWindow({ conversationId: currentConversationId }: ChatWindowProps) {
  const router = useRouter();
  const { messages, setMessages, fetchMessages } = useChatStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isStartingNewChat, setIsStartingNewChat] = useState(false);
  // null = no takeover, 'new' = just converted, 'returning' = welcome a known member back
  const [celebration, setCelebration] = useState<null | 'new' | 'returning'>(null);
  const [isMember, setIsMember] = useState(false);

  // Greet returning members with the crimson welcome screen on a fresh chat.
  useEffect(() => {
    const member = hasMemberCookie();
    setIsMember(member);
    if (member && !currentConversationId) setCelebration('returning');
  }, [currentConversationId]);

  // Show the "Welcome to Kaiz La" takeover when a lead is handed off. This is
  // driven by an event (not local state) so it survives the router.push to
  // /chat/[id] that a first-message hand-off triggers — that navigation
  // remounts this component, which would otherwise drop the celebration.
  useEffect(() => {
    const onComplete = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id && id === currentConversationId) {
        setMemberCookie();
        setIsMember(true);
        setCelebration('new');
      }
    };
    document.addEventListener('kaizla-lead-complete', onComplete as EventListener);
    return () => document.removeEventListener('kaizla-lead-complete', onComplete as EventListener);
  }, [currentConversationId]);

  useEffect(() => {
    const handleSetInput = (event: CustomEvent<string>) => {
      setInput(event.detail);
    };
    document.addEventListener('set-chat-input', handleSetInput as EventListener);
    return () => {
      document.removeEventListener('set-chat-input', handleSetInput as EventListener);
    };
  }, []);

  // Carry over a prompt passed from the homepage search bar (/chat?q=...)
  useEffect(() => {
    if (typeof window === 'undefined' || currentConversationId) return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      setInput(q);
      // Clean the URL so a refresh doesn't re-populate the box
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [currentConversationId]);

  useEffect(() => {
    if (!currentConversationId) {
      setMessages([]);
    }
  }, [currentConversationId, setMessages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);
    const isNewChat = !currentConversationId;
    const conversationId = currentConversationId || crypto.randomUUID();
    const userMessage: MessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      conversationId,
      createdAt: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInput("");
    if (isNewChat) {
      setIsStartingNewChat(true);
      router.push(`/chat/${conversationId}`);
    }
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [...messages, userMessage],
          conversationId,
        }),
      });
      if (!response.body) throw new Error("Response body is empty.");
      const leadHandedOff = response.headers.get('X-Lead-Complete') === '1';
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';
      const assistantMessageId = crypto.randomUUID();
      const assistantCreatedAt = new Date();
      let firstChunkReceived = false;
      while (true) {
        const { done, value } = await reader.read();
        if (!firstChunkReceived && value) {
          setIsStartingNewChat(false);
          firstChunkReceived = true;
          setMessages([
            ...messages,
            userMessage,
            { id: assistantMessageId, role: 'assistant', content: '', conversationId, createdAt: assistantCreatedAt }
          ]);
        }
        if (done) break;
        assistantResponse += decoder.decode(value, { stream: true });
        setMessages([
          ...messages,
          userMessage,
          { id: assistantMessageId, role: 'assistant', content: assistantResponse, conversationId, createdAt: assistantCreatedAt }
        ]);
      }
      setIsLoading(false);
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: assistantMessageId,
          content: assistantResponse,
          role: 'assistant',
          conversationId: conversationId,
          createdAt: assistantCreatedAt,
        }),
      });

      // The team was just notified. Announce the hand-off via an event so the
      // takeover survives the new-chat navigation (see the listener above).
      if (leadHandedOff) {
        document.dispatchEvent(
          new CustomEvent('kaizla-lead-complete', { detail: conversationId })
        );
      }
    } catch (error) {
      console.error("Failed to fetch chat response:", error);
      setIsLoading(false);
      setIsStartingNewChat(false);
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

  if (isStartingNewChat) {
    return <StartingChatLoader />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
          {messages.length === 0 && !isLoading && !currentConversationId ? (
            <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-28rem)] sm:min-h-[calc(100vh-24rem)] md:min-h-[calc(100vh-22rem)]">
              <Seal size={76} label="KaiExpert" />
              <div className="eyebrow mt-6 text-crimson">Kaiz La · Sourcing Desk</div>
              <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl md:text-5xl">
                How can we help you <span className="text-gradient-sun italic">source?</span>
              </h1>
              <p className="mt-4 max-w-md px-4 text-base leading-relaxed text-ink-soft sm:text-lg">
                Tell me what you’re looking to source from China and I’ll guide you on suppliers,
                quality, pricing and delivery, then connect you with our sourcing team.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message: any) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && <TypingIndicator />}
            </div>
          )}
        </div>
      </div>

      {messages.length === 0 && !isLoading && !currentConversationId && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
            {[
              { icon: Search, label: "What can you source?", prompt: "What kinds of products can you source for me?" },
              { icon: Compass, label: "How does it work?", prompt: "How does sourcing with Kaiz La work?" },
              { icon: FileText, label: "I need a quote", prompt: "I'd like a quote for a product I want to source." },
            ].map(({ icon: Icon, label, prompt }) => (
              <button
                key={label}
                onClick={() => setInput(prompt)}
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-crimson/40 hover:text-crimson hover:shadow-md"
              >
                <Icon className="size-4 text-crimson" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-border bg-porcelain/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-2 rounded-full border border-border bg-white p-1.5 pl-5 shadow-[0_8px_30px_-12px_rgba(26,20,19,0.2)] transition-shadow duration-150 focus-within:border-crimson/40 focus-within:shadow-[0_8px_30px_-10px_rgba(204,52,51,0.3)]">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell us what you'd like to source…"
                disabled={isLoading}
                className="flex-1 h-11 border-none bg-transparent px-0 text-base text-ink shadow-none focus:ring-0 focus-visible:ring-0 placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`h-11 w-11 rounded-full transition-all duration-150 ${input.trim() && !isLoading
                    ? 'bg-crimson text-white hover:bg-[var(--color-crimson-deep)] hover:shadow-md'
                    : 'bg-crimson/40 text-white/70'
                  }`}
                size="icon"
              >
                <Send className="w-5 h-5" />
              </Button>
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