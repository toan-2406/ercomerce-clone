import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

// We can't use localStorage in middleware, we typically use cookies for auth tokens
// If tokens are stored in cookies, we can protect routes at the server level
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Example: Protect /account and /admin routes
    // But since this project currently uses localStorage for simplicity, 
    // full middleware protection requires switching auth to cookie-based.

    // For now, let's just show how we would do it
    const isProtectedPath = ['/account', '/admin', '/checkout'].some(path => pathname.startsWith(path));
    // const token = request.cookies.get('auth_token')?.value;

    // if (isProtectedPath && !token) {
    //     return NextResponse.redirect(new URL('/login', request.url));
    // }

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
