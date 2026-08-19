import type { UIMessage } from 'ai';
import { Loader2, Package } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ShipmentCard, type ShipmentCardData } from './ShipmentCard';
import { ProductSpecCard, type ProductSpecCardData } from './ProductSpecCard';

interface MessageBubbleProps {
  message: UIMessage;
  /** True when the previous message came from the same author — suppresses the
   *  repeated name label so a run of replies reads as one voice. */
  grouped?: boolean;
  /** Show the trailing caret while this message is still being written. */
  streaming?: boolean;
}

type MessageMeta = { authorType?: string; authorName?: string | null };

/** First letters of the first two words: "Omar Haddad" -> "OH", not "OM". */
function initialsOf(name: string | null): string {
  const words = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 'KL';
  return words.slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

/** Who is speaking. Falls back to role for messages with no metadata. */
function authorOf(message: UIMessage): { type: string; name: string | null } {
  const meta = (message.metadata ?? {}) as MessageMeta;
  if (meta.authorType) return { type: meta.authorType, name: meta.authorName ?? null };
  return { type: message.role === 'user' ? 'customer' : 'kaiExpert', name: null };
}

/** Human-readable labels for the work the agent does mid-turn. */
const TOOL_LABELS: Record<string, string> = {
  'tool-saveLeadDetails': 'Noting your details',
  'tool-trackShipment': 'Looking up your shipment',
  'tool-handoffToExpert': 'Opening your sourcing request',
  'tool-answerOpenItem': 'Updating your request',
  'tool-analyzeProductPhoto': 'Reading your photo',
};

/**
 * A tool the agent is running.
 *
 * Shown only while in flight. Once it resolves the result is already reflected
 * in what the agent says, so leaving a spent status pill behind is noise.
 */
function ToolActivity({ type, state }: { type: string; state?: string }) {
  if (state === 'output-available' || state === 'output-error') return null;
  const label = TOOL_LABELS[type] ?? 'Working on it';
  return (
    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-porcelain px-3 py-1 text-xs font-medium text-ink-soft">
      <Loader2 className="h-3 w-3 animate-spin text-crimson" />
      {label}…
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

export function MessageBubble({ message, grouped, streaming }: MessageBubbleProps) {
  const author = authorOf(message);
  const isUser = author.type === 'customer';
  const isExecutive = author.type === 'executive';

  const text = message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('\n');

  const files = message.parts.filter(
    (p): p is { type: 'file'; url: string; mediaType: string; filename?: string } =>
      p.type === 'file'
  );

  const tools = message.parts.filter((p) => p.type.startsWith('tool-'));
  const shipments = message.parts.filter(
    (p): p is { type: 'data-shipment'; data: ShipmentCardData } => p.type === 'data-shipment'
  );
  const specs = message.parts.filter(
    (p): p is { type: 'data-productSpec'; data: ProductSpecCardData } =>
      p.type === 'data-productSpec'
  );

  // A turn can be tool calls only, with nothing said yet — render the activity
  // rather than an empty bubble.
  if (!text && !files.length && !tools.length && !shipments.length && !specs.length) return null;

  // A system note is a fact about the request, not something anyone said.
  if (author.type === 'system') {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-porcelain-deep px-4 py-1.5 text-xs font-medium text-ink-soft">
          {text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser &&
        // Keep the column width in a grouped run so bubbles stay aligned.
        (grouped ? (
          <div className="w-10 flex-shrink-0" aria-hidden />
        ) : isExecutive ? (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-ink text-sm font-bold leading-none text-white shadow-sm">
            {initialsOf(author.name)}
          </div>
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border-2 border-crimson bg-white font-display text-lg leading-none text-crimson shadow-sm">
            喜
          </div>
        ))}
      <div className="flex max-w-xl flex-col gap-3">
        <div
          className={`relative px-5 py-4 ${
            isUser
              ? 'rounded-2xl rounded-br-sm bg-crimson text-white shadow-lift-sm'
              : isExecutive
                ? 'rounded-2xl rounded-tl-sm border border-ink/15 bg-white shadow-ink'
                : 'card-lux rounded-2xl rounded-tl-sm'
          } ${grouped ? 'rounded-tl-2xl' : ''}`}
        >
          {!isUser && !grouped && (
            <div
              className={`mb-1.5 text-xs font-semibold tracking-wide ${
                isExecutive ? 'text-ink' : 'text-crimson'
              }`}
            >
              {isExecutive ? `${author.name ?? 'Kaiz La'} · Sourcing specialist` : 'KaiExpert · Kaiz La'}
            </div>
          )}

          {files.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {files.map((file, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${file.url}-${i}`}
                  src={file.url}
                  alt={file.filename || 'Shared photo'}
                  className="max-h-48 rounded-xl border border-white/20 object-cover"
                />
              ))}
            </div>
          )}

          {!isUser &&
            tools.map((part, i) => (
              <ToolActivity
                key={`${part.type}-${i}`}
                type={part.type}
                state={(part as { state?: string }).state}
              />
            ))}

          {text &&
            (isUser ? (
              <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">{text}</p>
            ) : (
              <div className="text-ink">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={getMarkdownComponents()}>
                  {text}
                </ReactMarkdown>
                {streaming && (
                  <span
                    className="animate-cursor ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-crimson"
                    aria-hidden
                  />
                )}
              </div>
            ))}
        </div>

        {specs.map((part, i) => (
          <ProductSpecCard key={`spec-${i}`} data={part.data} />
        ))}

        {shipments.map((part, i) => (
          <ShipmentCard key={`shipment-${i}`} data={part.data} />
        ))}
      </div>
    </div>
  );
}
