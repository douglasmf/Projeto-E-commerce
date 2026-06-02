import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set('token', token, {
    path: '/',
    maxAge: 86400, // 24 horas
    httpOnly: false,
  });

  return response;
}

