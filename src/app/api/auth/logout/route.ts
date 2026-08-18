import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.delete('sen_session_user_id');
  response.cookies.delete('sen_demo_user_id');
  return response;
}
