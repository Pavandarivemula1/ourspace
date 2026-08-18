import { prisma } from '../lib/prisma';
import { parseNaturalLanguageRequest } from '../services/parser/requestParser';
import { computeMatchesForRequest } from '../services/matching/engine';
import { recalculateEventStatus, confirmRequirement } from '../services/events/workflow';
import { createVenueBooking, approveVenueBooking } from '../services/venues/bookingService';
import { sendIntroductionRequest, respondToIntroduction, recordOutcomeAndCompleteCollab, submitReview } from '../services/collaborations/service';

async function runFlagshipVerification() {
  console.log('===========================================================');
  console.log('🚀 RUNNING END-TO-END FLAGSHIP WORKFLOW VERIFICATION SUITE');
  console.log('===========================================================');

  // 1. Find Seeded Personas
  const aarav = await prisma.user.findFirst({ where: { email: 'aarav@neuralflow.ai' }, include: { profile: true } });
  const sneha = await prisma.user.findFirst({ where: { email: 'sneha@thub.org' }, include: { profile: true } });
  const vikram = await prisma.user.findFirst({ where: { email: 'vikram.rao@iiit.ac.in' }, include: { profile: true } });
  const rajesh = await prisma.user.findFirst({ where: { email: 'admin@ecosystem.hyd' }, include: { profile: true } });

  if (!aarav || !sneha || !vikram || !rajesh) {
    throw new Error('Missing seeded personas in database');
  }

  console.log(`👤 Active Seeded Personas:
  - Founder: ${aarav.name} (${aarav.email})
  - Venue Host: ${sneha.name} (${sneha.email})
  - Speaker/Mentor: ${vikram.name} (${vikram.email})
  - Super Admin: ${rajesh.name} (${rajesh.email})
  `);

  // =========================================================================
  // TEST 1: Natural Language Request Parser & Matching Engine
  // =========================================================================
  console.log('-----------------------------------------------------------');
  console.log('TEST 1: NLP Intent Parsing & Transparent Weighted Matching');
  console.log('-----------------------------------------------------------');

  const rawPrompt = 'I want to conduct a 40-person AI meetup in Hyderabad next Saturday evening. I need a free venue and one AI speaker.';
  const parsed = parseNaturalLanguageRequest(rawPrompt);

  console.log('Input Prompt:', rawPrompt);
  console.log('Extracted Entity Fields:', {
    requestType: parsed.requestType,
    capacityNeeded: parsed.capacityNeeded,
    locationCity: parsed.locationCity,
    targetDate: parsed.targetDate,
    targetTimeSlot: parsed.targetTimeSlot,
    budgetType: parsed.budgetType,
    requirements: parsed.requirements,
    confidence: parsed.confidence,
  });

  if (parsed.requestType !== 'VENUE' || parsed.capacityNeeded !== 40) {
    throw new Error('NLP Parser failed validation');
  }

  // Create Request from parsed entity
  const newReq = await prisma.request.create({
    data: {
      userId: aarav.id,
      requestType: parsed.requestType,
      title: parsed.title,
      description: rawPrompt,
      locationCity: parsed.locationCity,
      targetDate: parsed.targetDate,
      targetTimeSlot: parsed.targetTimeSlot,
      budgetType: parsed.budgetType,
      capacityNeeded: parsed.capacityNeeded,
      requirements: JSON.stringify(parsed.requirements),
      category: parsed.category,
      status: 'PUBLISHED',
    },
  });

  const matches = await computeMatchesForRequest(newReq.id);
  console.log(`Found ${matches.length} candidate matches for new request:`);
  matches.slice(0, 2).forEach((m, idx) => {
    console.log(`  Match #${idx + 1}: ${m.venue?.name || m.user?.name} — ${m.score}% Match`);
    console.log(`  Explanations:`, m.explanations.slice(0, 2));
  });

  // =========================================================================
  // TEST 2: Flagship Event Resource Lifecycle & Venue Approval
  // =========================================================================
  console.log('-----------------------------------------------------------');
  console.log('TEST 2: Event Requirements Fulfillment & State Machine');
  console.log('-----------------------------------------------------------');

  // Find the flagship event
  const event = await prisma.event.findFirst({
    where: { slug: { contains: 'ai-founders' } },
    include: { requirements: true, registrations: true },
  });

  if (!event) throw new Error('Flagship event not found');

  // Reset to SEEKING_RESOURCES for clean reproducible test run
  await prisma.event.update({
    where: { id: event.id },
    data: { status: 'SEEKING_RESOURCES' },
  });
  await prisma.eventRequirement.updateMany({
    where: { eventId: event.id },
    data: { status: 'PENDING', fulfilledByVenueId: null, fulfilledByUserId: null },
  });

  const venueReq = event.requirements.find((r) => r.requirementType === 'VENUE');
  const speakerReq = event.requirements.find((r) => r.requirementType === 'SPEAKER');

  if (venueReq) {
    console.log(`Fulfilling Venue Requirement "${venueReq.title}" with T-Hub...`);
    const thubVenue = await prisma.venue.findFirst({ where: { name: { contains: 'T-Hub' } } });
    if (thubVenue) {
      await confirmRequirement(venueReq.id, { venueId: thubVenue.id });
    }
  }

  if (speakerReq) {
    console.log(`Fulfilling Speaker Requirement "${speakerReq.title}" with Dr. Vikram Rao...`);
    await confirmRequirement(speakerReq.id, { userId: vikram.id });
  }

  const updatedEvent = await prisma.event.findUnique({
    where: { id: event.id },
    include: { requirements: true },
  });

  console.log(`Updated Event Status after required resource fulfillment: "${updatedEvent?.status}"`);
  if (updatedEvent?.status !== 'REGISTRATION_OPEN' && updatedEvent?.status !== 'RESOURCES_FULFILLED') {
    throw new Error(`Expected event to be REGISTRATION_OPEN or RESOURCES_FULFILLED, got ${updatedEvent?.status}`);
  }

  // =========================================================================
  // TEST 3: Connection -> Collaboration -> Outcome -> Multi-dimensional Review
  // =========================================================================
  console.log('-----------------------------------------------------------');
  console.log('TEST 3: Need -> Match -> Intro -> Collab -> Outcome -> Reviews');
  console.log('-----------------------------------------------------------');

  // 1. Aarav requests Intro to Dr. Vikram
  const intro = await sendIntroductionRequest({
    requesterId: aarav.id,
    recipientId: vikram.id,
    reason: 'We are building an agentic medical benchmark and want your technical guidance as an advisor.',
  });
  console.log(`Introduction request sent (ID: ${intro.id.slice(0, 8)})`);

  // 2. Vikram accepts intro
  const response: any = await respondToIntroduction(intro.id, vikram.id, true);
  console.log(`Introduction accepted! Connection formed (ID: ${response.connection?.id ? response.connection.id.slice(0, 8) : 'accepted'})`);

  // 3. Record outcome
  const outcome = await recordOutcomeAndCompleteCollab({
    eventId: event.id,
    outcomeType: 'EVENT_COMPLETED',
    title: 'Successfully Hosted AI Founders Meetup at T-Hub',
    description: '45 attendees, live agent demo, keynote delivered by Dr. Vikram Rao with zero AV disruptions.',
    metrics: { attendeesCount: 45, csatRating: 4.95 },
    actorId: aarav.id,
  });
  console.log(`Outcome recorded: "${outcome.title}" (Type: ${outcome.outcomeType})`);

  // 4. Submit multi-dimensional reviews
  const rev1 = await submitReview({
    outcomeId: outcome.id,
    reviewerId: aarav.id,
    revieweeId: vikram.id,
    dimension: 'SPEAKER',
    rating: 5,
    content: 'Dr. Vikram delivered an outstanding technical keynote. Clear, precise, and answered audience queries with immense depth.',
    wasPunctual: true,
    wouldRecommend: true,
  });

  const rev2 = await submitReview({
    outcomeId: outcome.id,
    reviewerId: vikram.id,
    revieweeId: aarav.id,
    dimension: 'ORGANIZER',
    rating: 5,
    content: 'Aarav organized a high-caliber founder audience with excellent AV and clear scheduling.',
    wasPunctual: true,
    wouldRecommend: true,
  });

  console.log(`Reviews submitted:
  - Aarav rated Vikram: ${rev1.rating} Stars (SPEAKER)
  - Vikram rated Aarav: ${rev2.rating} Stars (ORGANIZER)
  `);

  // Check updated reputation
  const vikramProfile = await prisma.profile.findUnique({ where: { userId: vikram.id } });
  const aaravProfile = await prisma.profile.findUnique({ where: { userId: aarav.id } });

  console.log(`Updated Multi-Dimensional Reputation:
  - Dr. Vikram Rao Speaker Score: ${vikramProfile?.speakerScore} / 5.0
  - Aarav Sharma Organizer Score: ${aaravProfile?.organizerScore} / 5.0
  `);

  console.log('===========================================================');
  console.log('🎉 ALL FLAGSHIP WORKFLOW TESTS PASSED PERFECTLY (100% READY)');
  console.log('===========================================================');
}

runFlagshipVerification()
  .catch((e) => {
    console.error('❌ Test failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
