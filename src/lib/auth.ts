import { cookies, headers } from 'next/headers';
import crypto from 'crypto';
import { prisma } from './prisma';

export const DEMO_MODE_ENABLED = process.env.DEMO_MODE === 'true' || process.env.NODE_ENV !== 'production';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'sen_salt_2026').digest('hex');
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const headersList = await headers();

  let userId = cookieStore.get('sen_session_user_id')?.value;

  // In demo mode only, allow reading from header or demo cookie
  if (DEMO_MODE_ENABLED) {
    const demoHeaderUserId = headersList.get('x-demo-user-id');
    const demoCookieUserId = cookieStore.get('sen_demo_user_id')?.value;
    if (demoHeaderUserId) {
      userId = demoHeaderUserId;
    } else if (demoCookieUserId) {
      userId = demoCookieUserId;
    }
  }

  // Fallback to default demo user (Aarav) if in demo mode and no user is set
  if (!userId && DEMO_MODE_ENABLED) {
    const defaultUser = await prisma.user.findFirst({
      where: { email: 'aarav@neuralflow.ai' },
      include: {
        profile: true,
        orgMemberships: {
          include: { org: true },
        },
        commMemberships: {
          include: { community: true },
        },
      },
    });
    if (defaultUser) return defaultUser;
  }

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      orgMemberships: {
        include: { org: true },
      },
      commMemberships: {
        include: { community: true },
      },
    },
  });

  if (!user || user.status === 'BANNED') return null;

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED: Please sign in to perform this action.');
  }
  if (user.status === 'SUSPENDED') {
    throw new Error('ACCOUNT_SUSPENDED: Your account is currently suspended.');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') {
    throw new Error('FORBIDDEN: Admin permissions required.');
  }
  return user;
}

export async function requireOwnership(ownerId: string, customMessage?: string) {
  const user = await requireAuth();
  if (user.role === 'ADMIN') return user; // Admins can manage
  if (user.id !== ownerId) {
    throw new Error(customMessage || 'FORBIDDEN: You do not have permission to modify this resource.');
  }
  return user;
}
