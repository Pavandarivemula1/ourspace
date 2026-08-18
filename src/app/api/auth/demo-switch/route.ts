import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEMO_MODE_ENABLED } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!DEMO_MODE_ENABLED) {
    return NextResponse.json({ error: 'Demo mode is disabled in production.' }, { status: 403 });
  }

  try {
    const { userId, email } = await req.json();

    const user = await prisma.user.findFirst({
      where: userId ? { id: userId } : { email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Persona not found' }, { status: 404 });
    }

    const response = NextResponse.json({
      success: true,
      message: `Switched demo persona to ${user.name} (${user.role})`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        profile: user.profile,
      },
    });

    // Set demo cookie
    response.cookies.set('sen_demo_user_id', user.id, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
