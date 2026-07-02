import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// In-memory rate limiting cache for Edge/Middleware
const rateLimitCache = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string): boolean {
  const limit = 200 // 200 requests per minute
  const windowMs = 60 * 1000 // 1 minute window
  const now = Date.now()

  const record = rateLimitCache.get(ip)
  if (!record || now > record.resetTime) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  record.count++
  if (record.count > limit) {
    return true
  }
  return false
}

export async function middleware(request: NextRequest) {
  // 0. Bypass middleware completely for SEO files (to prevent Supabase timeouts for Googlebot)
  const pathname = request.nextUrl.pathname
  if (pathname.endsWith('.xml') || pathname.endsWith('.txt')) {
    return NextResponse.next()
  }

  // 1. Rate Limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }
  }

  // 2. Session Update (Supabase)
  const response = await updateSession(request)

  // 3. Enforce Strict Security Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )

  // HSTS (Strict-Transport-Security) - Enforced in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  // Content Security Policy (CSP)
  const isProd = process.env.NODE_ENV === 'production'
  const cspHeader = isProd
    ? `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https:;
        font-src 'self' data: https:;
        connect-src 'self' https: wss:;
        frame-src 'self' https://challenges.cloudflare.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        block-all-mixed-content;
        upgrade-insecure-requests;
      `.replace(/\s{2,}/g, ' ').trim()
    : `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https: http:;
        font-src 'self' data: https:;
        connect-src 'self' https: wss: ws: http:;
        frame-src 'self' https://challenges.cloudflare.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
      `.replace(/\s{2,}/g, ' ').trim()

  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml, sitemap_index.xml (SEO sitemap)
     * - robots.txt (SEO robots file)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|sitemap_index.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
