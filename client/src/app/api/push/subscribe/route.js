import { NextResponse } from 'next/server';

// In-memory store for dev; replace with DB in production
const subscriptions = globalThis.__ISF_PUSH_SUBS__ || [];
globalThis.__ISF_PUSH_SUBS__ = subscriptions;

export async function POST(request) {
  try {
    const sub = await request.json();
    // Basic validation
    if (!sub || !sub.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }
    // Avoid duplicates
    const exists = subscriptions.some((s) => s.endpoint === sub.endpoint);
    if (!exists) subscriptions.push(sub);
    return NextResponse.json({ ok: true, count: subscriptions.length });
  } catch (err) {
    console.error('Subscribe error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}