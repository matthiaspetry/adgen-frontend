// Or if using src directory: /Users/matthiaspetry/adgen/adgen-frontend/src/middleware.js
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Middleware: Missing Supabase URL or Anon Key');
    // Allow request to proceed, but log the error
    return res;
  }

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // If the cookie is set, update the request cookies as well.
          // This is necessary for Server Components accessing the session.
          req.cookies.set({ name, value, ...options });
          // Update the response cookies
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          // If the cookie is removed, update the request cookies as well.
          req.cookies.set({ name, value: '', ...options });
          // Update the response cookies
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Refresh session if expired - important for Server Components
  // and keeping the session active
  const { data: { session } } = await supabase.auth.getSession();

  // --- Optional: Route Protection ---
  // Uncomment and adapt this section if you want to protect routes

  // const { data: { user } } = await supabase.auth.getUser();
  // const protectedRoutes = ['/dummy', '/dashboard']; // Add routes you want to protect
  // const authRoutes = ['/login', '/register']; // Routes for unauthenticated users

  // const isProtectedRoute = protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path));
  // const isAuthRoute = authRoutes.some(path => req.nextUrl.pathname.startsWith(path));

  // // If user is not logged in and trying to access a protected route
  // if (!user && isProtectedRoute) {
  //   return NextResponse.redirect(new URL('/login', req.url));
  // }

  // // If user is logged in and trying to access login/register page
  // if (user && isAuthRoute) {
  //   return NextResponse.redirect(new URL('/dummy', req.url)); // Redirect to a default logged-in page
  // }
  // --- End Optional: Route Protection ---


  return res;
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more exceptions.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};