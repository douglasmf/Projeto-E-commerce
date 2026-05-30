import { NextResponse } from 'next/server';

export function POST() {
  const response = NextResponse.json({ success: true });

  // Remove o cookie
  response.cookies.delete('token');

  return response;
}
