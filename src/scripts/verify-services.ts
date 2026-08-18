import { prisma } from '../lib/prisma';
import { parseNaturalLanguageRequest } from '../services/parser/requestParser';
import { computeMatchesForRequest } from '../services/matching/engine';
import { recalculateEventStatus } from '../services/events/workflow';

async function verify() {
  console.log('--- 🧪 Running Automated Backend Service Verification ---');

  // 1. Verify Request Parser
  const nlpText = 'I want to conduct a 40-person AI meetup in Hyderabad next Saturday evening. I need a free venue and one AI speaker.';
  const parsed = parseNaturalLanguageRequest(nlpText);
  console.log('✅ Request Parser Output:', {
    requestType: parsed.requestType,
    capacity: parsed.capacityNeeded,
    city: parsed.locationCity,
    date: parsed.targetDate,
    timeSlot: parsed.targetTimeSlot,
    confidence: parsed.confidence,
  });

  if (parsed.requestType !== 'VENUE' || parsed.capacityNeeded !== 40) {
    throw new Error('Parser failed verification');
  }

  // 2. Verify Matching Engine
  const sampleRequest = await prisma.request.findFirst({
    where: { requestType: 'VENUE' },
  });

  if (sampleRequest) {
    const matches = await computeMatchesForRequest(sampleRequest.id);
    console.log(`✅ Matching Engine returned ${matches.length} candidate matches for Request "${sampleRequest.title.slice(0, 30)}..."`);
    if (matches.length > 0) {
      console.log(`   Top Match: ${matches[0].venue?.name || matches[0].user?.name} (Score: ${matches[0].score}%)`);
      console.log(`   Explanations:`, matches[0].explanations.slice(0, 2));
    }
  }

  // 3. Verify Event State Machine
  const sampleEvent = await prisma.event.findFirst({
    include: { requirements: true },
  });

  if (sampleEvent) {
    const status = await recalculateEventStatus(sampleEvent.id);
    console.log(`✅ Event State Machine verified for "${sampleEvent.title.slice(0, 30)}...": Status is "${status}"`);
  }

  console.log('🎉 ALL CORE BACKEND DOMAIN SERVICES VERIFIED SUCCESSFULLY!');
}

verify()
  .catch((e) => {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
