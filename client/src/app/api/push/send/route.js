import { NextResponse } from 'next/server';
import webpush from 'web-push';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:support@isf-blood.org';

// Configure web-push
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

// Use same in-memory store
const subscriptions = globalThis.__ISF_PUSH_SUBS__ || [];
globalThis.__ISF_PUSH_SUBS__ = subscriptions;

export async function POST(request) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'Missing VAPID keys' }, { status: 500 });
  }
  try {
    const payload = await request.json();
    const body = JSON.stringify(payload || {});

    const results = await Promise.allSettled(
      subscriptions.map((sub) => webpush.sendNotification(sub, body))
    );

    const summary = results.reduce(
      (acc, r) => {
        if (r.status === 'fulfilled') acc.sent += 1;
        else acc.failed.push(r.reason?.message || 'Unknown error');
        return acc;
      },
      { sent: 0, failed: [] }
    );

    return NextResponse.json(summary);
  } catch (err) {
    console.error('Push send error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}