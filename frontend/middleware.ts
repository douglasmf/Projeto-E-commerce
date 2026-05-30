import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rotas públicas
  const publicRoutes = ['/auth'];

  // Se a rota é pública, deixa passar
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // Se está logado e tenta acessar /auth, redireciona para home
    const token = request.cookies.get('token')?.value;
    if (token && pathname === '/auth') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Para rotas protegidas, verifica se tem token
  const token = request.cookies.get('token')?.value;
  
  // Se não tem cookie de token, redireciona para auth
  if (!token && pathname !== '/auth') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
