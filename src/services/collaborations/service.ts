import { prisma } from '@/lib/prisma';
import { dispatchNotification } from '../notifications/dispatcher';
import { recalculateUserReputation, recalculateVenueReputation } from '../reputation/calculator';
import { logAuditAction } from '../audit/logger';

export async function sendIntroductionRequest(data: {
  requesterId: string;
  recipientId: string;
  requestId?: string;
  reason: string;
  context?: string;
}) {
  const requester = await prisma.user.findUnique({
    where: { id: data.requesterId },
    include: { profile: true },
  });

  const intro = await prisma.introductionRequest.create({
    data: {
      requesterId: data.requesterId,
      recipientId: data.recipientId,
      requestId: data.requestId || null,
      reason: data.reason,
      context: data.context || null,
      status: 'PENDING',
    },
  });

  await dispatchNotification({
    userId: data.recipientId,
    type: 'INTRO_REQUEST',
    title: `🤝 New Introduction Request from ${requester?.name || 'a founder'}`,
    message: data.reason,
    link: '/connections',
  });

  return intro;
}

export async function respondToIntroduction(
  introId: string,
  recipientId: string,
  accept: boolean,
  declineReason?: string
) {
  const intro = await prisma.introductionRequest.findUnique({
    where: { id: introId },
    include: { requester: true, recipient: true },
  });

  if (!intro) throw new Error('Introduction request not found');
  if (intro.recipientId !== recipientId) throw new Error('Unauthorized');

  if (!accept) {
    return await prisma.introductionRequest.update({
      where: { id: introId },
      data: {
        status: 'DECLINED',
        declineReason: declineReason || 'Not available for new connections at this time.',
        respondedAt: new Date(),
      },
    });
  }

  // Update to ACCEPTED
  const updatedIntro = await prisma.introductionRequest.update({
    where: { id: introId },
    data: {
      status: 'ACCEPTED',
      respondedAt: new Date(),
    },
  });

  // Ensure Connection exists
  let connection = await prisma.connection.findFirst({
    where: {
      OR: [
        { userAId: intro.requesterId, userBId: intro.recipientId },
        { userAId: intro.recipientId, userBId: intro.requesterId },
      ],
    },
  });

  if (!connection) {
    connection = await prisma.connection.create({
      data: {
        userAId: intro.requesterId,
        userBId: intro.recipientId,
        source: 'INTRO_ACCEPTED',
        relationshipType: 'COLLABORATOR',
        status: 'ACTIVE',
      },
    });
  }

  // Ensure Conversation exists
  const existingConvo = await prisma.conversation.findFirst({
    where: {
      type: 'DIRECT',
      AND: [
        { participants: { some: { userId: intro.requesterId } } },
        { participants: { some: { userId: intro.recipientId } } },
      ],
    },
  });

  if (!existingConvo) {
    await prisma.conversation.create({
      data: {
        type: 'DIRECT',
        title: `${intro.requester.name} & ${intro.recipient.name}`,
        participants: {
          create: [
            { userId: intro.requesterId },
            { userId: intro.recipientId },
          ],
        },
        messages: {
          create: {
            senderId: intro.recipientId,
            content: `Introduction accepted! Reason: "${intro.reason}". Looking forward to collaborating.`,
            isRead: false,
          },
        },
      },
    });
  }

  await dispatchNotification({
    userId: intro.requesterId,
    type: 'INTRO_ACCEPTED',
    title: `🎉 ${intro.recipient.name} accepted your introduction!`,
    message: 'You are now connected. You can start messaging and collaborating.',
    link: '/messages',
  });

  return { intro: updatedIntro, connection };
}

export async function createCollaboration(data: {
  connectionId?: string;
  userAId: string;
  userBId: string;
  title: string;
  description: string;
  category?: string;
}) {
  return await prisma.collaboration.create({
    data: {
      connectionId: data.connectionId || null,
      userAId: data.userAId,
      userBId: data.userBId,
      title: data.title,
      description: data.description,
      category: data.category || 'General',
      status: 'ACTIVE',
    },
  });
}

export async function recordOutcomeAndCompleteCollab(data: {
  collaborationId?: string;
  eventId?: string;
  outcomeType: string;
  title: string;
  description: string;
  metrics?: Record<string, any>;
  actorId: string;
}) {
  if (data.collaborationId) {
    await prisma.collaboration.update({
      where: { id: data.collaborationId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }

  if (data.eventId) {
    await prisma.event.update({
      where: { id: data.eventId },
      data: { status: 'OUTCOME_RECORDED' },
    });
  }

  const outcome = await prisma.outcome.create({
    data: {
      collaborationId: data.collaborationId || null,
      eventId: data.eventId || null,
      outcomeType: data.outcomeType,
      title: data.title,
      description: data.description,
      metrics: data.metrics ? JSON.stringify(data.metrics) : null,
      createdById: data.actorId,
    },
  });

  await logAuditAction({
    actorId: data.actorId,
    action: 'COLLABORATION_COMPLETED',
    entityType: 'Outcome',
    entityId: outcome.id,
    details: { outcomeType: data.outcomeType, title: data.title },
  });

  return outcome;
}

export async function submitReview(data: {
  outcomeId?: string;
  reviewerId: string;
  revieweeId?: string;
  dimension: string;
  rating: number;
  content: string;
  wasPunctual?: boolean;
  wouldRecommend?: boolean;
}) {
  const review = await prisma.review.create({
    data: {
      outcomeId: data.outcomeId || null,
      reviewerId: data.reviewerId,
      revieweeId: data.revieweeId || null,
      dimension: data.dimension,
      rating: Math.min(5, Math.max(1, data.rating)),
      content: data.content,
      wasPunctual: data.wasPunctual ?? true,
      wouldRecommend: data.wouldRecommend ?? true,
    },
  });

  if (data.revieweeId) {
    await recalculateUserReputation(data.revieweeId);

    await dispatchNotification({
      userId: data.revieweeId,
      type: 'REVIEW_REQUEST',
      title: `⭐ New ${data.dimension.toLowerCase()} review received`,
      message: `You received a ${data.rating}-star rating with feedback.`,
      link: `/profiles/${data.revieweeId}`,
    });
  }

  return review;
}
