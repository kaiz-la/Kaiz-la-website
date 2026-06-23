import { type Message } from '@/store/chatStore';
import { Calendar, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  message: Message;
}

function CalendlyButton({ payload }: { payload: any }) {
  const handleSuggestedReply = (text: string) => {
    document.dispatchEvent(new CustomEvent('set-chat-input', { detail: text }));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-ink">{payload.text}</p>
      <a
        href={payload.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2.5 rounded-full bg-crimson px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[var(--color-crimson-deep)] hover:shadow-md"
      >
        <Calendar className="h-4 w-4" />
        Schedule Your Call
      </a>
      <div className="flex items-center gap-2 border-t border-border/60 pt-3">
        <span className="text-xs text-muted-foreground">Finished scheduling?</span>
        <button
          onClick={() => handleSuggestedReply('Scheduled')}
          className="cursor-pointer text-xs font-semibold text-crimson hover:underline"
        >
          Let us know
        </button>
      </div>
    </div>
  );
}

function WhatsAppButton({ payload }: { payload: any }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-ink">{payload.text}</p>
      <a
        href={payload.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#1ebe5b] hover:shadow-md"
      >
        <MessageCircle className="h-4 w-4" />
        Continue on WhatsApp
      </a>
    </div>
  );
}

function getMarkdownComponents() {
  return {
    h1: ({ children }: any) => (
      <h1 className="font-display text-lg font-semibold text-ink mt-4 mb-2 first:mt-0">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-display text-base font-semibold text-ink mt-4 mb-2 first:mt-0">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-sm font-semibold text-ink mt-3 mb-1.5 first:mt-0">{children}</h3>
    ),
    ul: ({ children }: any) => (
      <ul className="space-y-1.5 my-3 pl-0 list-none">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="space-y-1.5 my-3 pl-5 list-decimal marker:text-crimson marker:font-semibold">{children}</ol>
    ),
    li: ({ children, ordered }: any) =>
      ordered ? (
        <li className="text-sm leading-relaxed pl-1">{children}</li>
      ) : (
        <li className="flex items-start gap-2 text-sm">
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-crimson" />
          <div className="flex-1 leading-relaxed">{children}</div>
        </li>
      ),
    p: ({ children }: any) => (
      <p className="text-sm leading-relaxed text-ink mb-3 last:mb-0">{children}</p>
    ),
    a: ({ children, href }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-crimson underline underline-offset-2 hover:text-[var(--color-crimson-deep)]"
      >
        {children}
      </a>
    ),
    hr: () => <hr className="my-3 border-dashed border-border/60" />,
    strong: ({ children }: any) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
    code: ({ children }: any) => (
      <code className="rounded bg-porcelain-deep px-1.5 py-0.5 text-xs font-mono text-ink">{children}</code>
    ),
    pre: ({ children }: any) => (
      <pre className="my-3 overflow-x-auto rounded-lg bg-porcelain-deep p-3 text-xs">{children}</pre>
    ),
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  let content;

  if (message.role === 'assistant') {
    let parsed: any = null;
    try {
      parsed = JSON.parse(message.content);
    } catch {
      parsed = null;
    }

    if (parsed?.type === 'calendly-link') {
      content = <CalendlyButton payload={parsed} />;
    } else if (parsed?.type === 'whatsapp-link') {
      content = <WhatsAppButton payload={parsed} />;
    } else {
      content = (
        <div className="text-ink">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={getMarkdownComponents()}>
            {message.content}
          </ReactMarkdown>
        </div>
      );
    }
  } else {
    content = <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">{message.content}</p>;
  }

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border-2 border-crimson bg-white font-display text-lg leading-none text-crimson shadow-sm">
          喜
        </div>
      )}
      <div
        className={`relative max-w-xl px-5 py-4 ${
          isUser
            ? 'rounded-2xl rounded-br-sm bg-crimson text-white shadow-[0_10px_30px_-12px_rgba(204,52,51,0.5)]'
            : 'card-lux rounded-2xl rounded-tl-sm'
        }`}
      >
        {!isUser && (
          <div className="mb-1.5 text-xs font-semibold tracking-wide text-crimson">
            KaiExpert · Kaiz La
          </div>
        )}
        {content}
        <div className={`mt-2 text-[11px] ${isUser ? 'text-right text-white/60' : 'text-left text-muted-foreground'}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
