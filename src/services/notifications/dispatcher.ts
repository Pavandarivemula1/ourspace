import { prisma } from '@/lib/prisma';

export interface NotificationInput {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}

export async function dispatchNotification(input: NotificationInput) {
  try {
    return await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        link: input.link || null,
        isRead: false,
      },
    });
  } catch (error) {
    console.error('Failed to dispatch notification:', error);
    return null;
  }
}
