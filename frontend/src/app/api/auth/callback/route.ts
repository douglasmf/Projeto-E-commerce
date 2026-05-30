import { NextRequest, NextResponse } from 'next/server';

export function POST(request: NextRequest) {
  const { token } = JSON.parse(request.body.toString());

  const response = NextResponse.json({ success: true });

  // Seta o cookie com HttpOnly (mais seguro)
  response.cookies.set('token', token, {
    path: '/',
    maxAge: 86400, // 24 horas
    httpOnly: false, // false para permitir acesso do cliente também
  });

  return response;
}
