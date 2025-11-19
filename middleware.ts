import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login'];
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token
  const payload = await verifyToken(token);

  if (!payload) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }

  // Role-based route protection
  const role = payload.role;

  // Admin-only routes
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Manager-only routes
  if (pathname.startsWith('/manager') && !['ADMIN', 'MANAGER'].includes(role)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // User-only routes (accessible by all authenticated users)
  if (pathname.startsWith('/user') && !['ADMIN', 'MANAGER', 'USER'].includes(role)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
