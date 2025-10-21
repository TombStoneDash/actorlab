import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = new Set([
  'https://tombstonedash.com',
  'https://actorlab.tombstonedash.com',
  'https://castalert.netlify.app',
  'https://api.castalert.app',
  'http://localhost:3000',
  'http://localhost:3001',
]);

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') ?? '';
  const res = NextResponse.next();

  // CORS handling
  if (ALLOWED_ORIGINS.has(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  // Simple in-memory rate limiter: 60 requests per 15 minutes per IP
  // @ts-ignore - globalThis typing
  globalThis.__rate = globalThis.__rate || new Map();
  const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const window = 15 * 60 * 1000; // 15 minutes
  const key = `ip:${ip}`;

  const record = globalThis.__rate.get(key) || { count: 0, timestamp: now };

  // Reset if outside window
  if (now - record.timestamp > window) {
    record.count = 0;
    record.timestamp = now;
  }

  record.count++;
  globalThis.__rate.set(key, record);

  // Rate limit: 60 requests per 15 minutes
  if (record.count > 60) {
    return new NextResponse('Too many requests', {
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutes in seconds
      }
    });
  }

  return res;
}

export const config = {
  matcher: ['/api/:path*'],
};
