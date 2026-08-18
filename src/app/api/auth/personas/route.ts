import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEMO_MODE_ENABLED } from '@/lib/auth';

export async function GET() {
  if (!DEMO_MODE_ENABLED) {
    return NextResponse.json({ error: 'Demo mode is disabled in production.' }, { status: 403 });
  }

  const seededEmails = [
    'aarav@neuralflow.ai',
    'sneha@thub.org',
    'vikram.rao@iiit.ac.in',
    'pooja@hydai.network',
    'admin@ecosystem.hyd',
  ];

  const personas = await prisma.user.findMany({
    where: { email: { in: seededEmails } },
    include: { profile: true },
  });

  return NextResponse.json({ personas, isDemoMode: true });
}
