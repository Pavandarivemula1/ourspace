import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, headline, locationCity, lookingFor, canOffer, building } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Name, email, password, and role are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        role: role.toUpperCase(),
        status: 'ACTIVE',
        isEmailVerified: true,
        profile: {
          create: {
            headline: headline || `${role.toUpperCase()} in ${locationCity || 'Hyderabad'}`,
            locationCity: locationCity || 'Hyderabad',
            locationCountry: 'India',
            building: building || null,
            lookingFor: JSON.stringify(lookingFor || []),
            canOffer: JSON.stringify(canOffer || []),
            verificationLevel: 'EMAIL_VERIFIED',
          },
        },
      },
      include: { profile: true },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile,
      },
    });

    response.cookies.set('sen_session_user_id', user.id, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
