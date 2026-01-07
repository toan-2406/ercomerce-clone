import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from '@/constants';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Paths that require authentication
    const isProtectedPath = ['/account', '/admin', '/checkout'].some(path => pathname.startsWith(path));

    // Check for auth token in cookies
    const token = request.cookies.get('auth_token')?.value;

    if (isProtectedPath && !token) {
        return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }

    return NextResponse.next();
}

// Config to specify which paths the middleware should run on
export const config = {
    matcher: [
        '/account/:path*',
        '/admin/:path*',
        '/checkout/:path*',
    ],
};
