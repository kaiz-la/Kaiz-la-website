import { NextRequest, NextResponse } from 'next/server';
import type { UIMessage } from 'ai';
import { processChatRequest } from '@/components/chatLogic';
import { checkRateLimit, clientIp, tooManyRequests } from '@/lib/ratelimit';

// Public and unauthenticated, and every call spends LLM tokens — vision most of
// all. Two windows: a burst a real person will never reach, and an hourly
// ceiling that caps what one source can cost us in a sitting.
const BURST = { tokens: 20, window: '1 m' } as const;
const SUSTAINED = { tokens: 200, window: '1 h' } as const;

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);

    const burst = await checkRateLimit('chat-burst', ip, BURST.tokens, BURST.window);
    if (!burst.ok) {
      return tooManyRequests(burst, "You're sending messages a little too quickly — give it a moment.");
    }

    const sustained = await checkRateLimit('chat-hourly', ip, SUSTAINED.tokens, SUSTAINED.window);
    if (!sustained.ok) {
      return tooManyRequests(sustained, "You've hit the hourly message limit. Please try again later.");
    }

    // useChat's DefaultChatTransport posts { id, messages, ... }.
    const body = (await req.json()) as {
      id?: string;
      messages?: UIMessage[];
      requestRef?: string | null;
    };

    if (!body.id || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: 'Missing id or messages' }, { status: 400 });
    }

    return await processChatRequest(body.messages, body.id, body.requestRef ?? null);
  } catch (error) {
    console.error('[api/chat]', error);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
