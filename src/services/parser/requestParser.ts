export interface ParsedRequestResult {
  title: string;
  requestType: string;
  locationCity: string;
  capacityNeeded?: number;
  targetDate?: string;
  targetTimeSlot?: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  budgetType?: 'FREE' | 'BARTER' | 'PAID';
  category: string;
  requirements: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  clarificationMessage?: string;
}

export function parseNaturalLanguageRequest(text: string): ParsedRequestResult {
  const normalized = text.toLowerCase();

  // 1. Extract Location
  let locationCity = 'Hyderabad';
  if (normalized.includes('bengaluru') || normalized.includes('bangalore')) locationCity = 'Bengaluru';
  else if (normalized.includes('mumbai')) locationCity = 'Mumbai';
  else if (normalized.includes('delhi') || normalized.includes('gurgaon') || normalized.includes('noida')) locationCity = 'Delhi NCR';
  else if (normalized.includes('pune')) locationCity = 'Pune';
  else if (normalized.includes('chennai')) locationCity = 'Chennai';

  // 2. Extract Request Type
  let requestType = 'RESOURCE';
  if (normalized.includes('venue') || normalized.includes('space') || normalized.includes('hall') || normalized.includes('office')) {
    requestType = 'VENUE';
  } else if (normalized.includes('speaker') || normalized.includes('keynote') || normalized.includes('talk')) {
    requestType = 'SPEAKER';
  } else if (normalized.includes('sponsor') || normalized.includes('sponsorship') || normalized.includes('grant')) {
    requestType = 'SPONSOR';
  } else if (normalized.includes('mentor') || normalized.includes('advisor')) {
    requestType = 'MENTOR';
  } else if (normalized.includes('partner') || normalized.includes('co-founder') || normalized.includes('cofounder')) {
    requestType = 'PARTNER';
  } else if (normalized.includes('developer') || normalized.includes('engineer') || normalized.includes('coder')) {
    requestType = 'DEVELOPER';
  } else if (normalized.includes('designer') || normalized.includes('ui/ux') || normalized.includes('figma')) {
    requestType = 'DESIGNER';
  }

  // 3. Extract Capacity
  let capacityNeeded: number | undefined = undefined;
  const capacityMatch = normalized.match(/(\d+)\s*(?:person|people|seat|seats|attendee|attendees|devs|developers|builders|members)/);
  if (capacityMatch && capacityMatch[1]) {
    capacityNeeded = parseInt(capacityMatch[1], 10);
  } else {
    // Check standalone 2-digit numbers
    const numMatch = normalized.match(/\b(20|30|40|50|60|75|100|150|200)\b/);
    if (numMatch && numMatch[1]) {
      capacityNeeded = parseInt(numMatch[1], 10);
    }
  }

  // 4. Extract Time Slot (Defined Windows)
  let targetTimeSlot: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT' | undefined = undefined;
  if (normalized.includes('morning')) {
    targetTimeSlot = 'MORNING'; // 06:00 - 12:00
  } else if (normalized.includes('afternoon')) {
    targetTimeSlot = 'AFTERNOON'; // 12:00 - 17:00
  } else if (normalized.includes('evening')) {
    targetTimeSlot = 'EVENING'; // 17:00 - 22:00
  } else if (normalized.includes('night')) {
    targetTimeSlot = 'NIGHT'; // 18:00 - 23:00
  }

  // 5. Extract Category
  let category = 'General';
  if (normalized.includes('ai') || normalized.includes('llm') || normalized.includes('machine learning') || normalized.includes('gpt')) {
    category = 'AI';
  } else if (normalized.includes('web3') || normalized.includes('crypto') || normalized.includes('blockchain')) {
    category = 'Web3';
  } else if (normalized.includes('saas') || normalized.includes('b2b')) {
    category = 'SaaS';
  } else if (normalized.includes('fintech')) {
    category = 'Fintech';
  } else if (normalized.includes('health') || normalized.includes('biotech')) {
    category = 'HealthTech';
  }

  // 6. Extract Budget
  let budgetType: 'FREE' | 'BARTER' | 'PAID' = 'FREE';
  if (normalized.includes('paid') || normalized.includes('budget') || normalized.includes('₹') || normalized.includes('$')) {
    budgetType = 'PAID';
  } else if (normalized.includes('barter') || normalized.includes('exchange')) {
    budgetType = 'BARTER';
  }

  // 7. Calculate Target Date
  let targetDate: string | undefined = undefined;
  let clarificationMessage: string | undefined = undefined;

  const now = new Date();
  if (normalized.includes('saturday') || normalized.includes('next saturday')) {
    const dayOfWeek = now.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
    const target = new Date(now.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
    targetDate = target.toISOString().split('T')[0];
    clarificationMessage = `Parsed target date as upcoming Saturday (${targetDate}).`;
  } else if (normalized.includes('sunday')) {
    const dayOfWeek = now.getDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
    const target = new Date(now.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000);
    targetDate = target.toISOString().split('T')[0];
    clarificationMessage = `Parsed target date as upcoming Sunday (${targetDate}).`;
  } else if (normalized.includes('tomorrow')) {
    const target = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    targetDate = target.toISOString().split('T')[0];
  }

  // 8. Extract Requirement Tags
  const requirements: string[] = [];
  if (normalized.includes('projector')) requirements.push('Projector');
  if (normalized.includes('mic') || normalized.includes('audio')) requirements.push('Wireless Mics');
  if (normalized.includes('wifi') || normalized.includes('wi-fi')) requirements.push('High-speed Wi-Fi');
  if (normalized.includes('speaker') || normalized.includes('ai speaker')) requirements.push('AI Speaker');
  if (normalized.includes('free')) requirements.push('Free Venue');
  if (normalized.includes('hitec city')) requirements.push('Hitec City');
  if (normalized.includes('gachibowli')) requirements.push('Gachibowli');
  if (normalized.includes('jubilee hills')) requirements.push('Jubilee Hills');

  // Title generation
  let title = text.slice(0, 80);
  if (capacityNeeded && requestType === 'VENUE') {
    title = `Need ${capacityNeeded}-person ${category} Meetup Venue in ${locationCity}`;
  } else if (requestType === 'SPEAKER') {
    title = `Seeking ${category} Keynote Speaker in ${locationCity}`;
  }

  return {
    title,
    requestType,
    locationCity,
    capacityNeeded,
    targetDate,
    targetTimeSlot: targetTimeSlot || 'EVENING',
    budgetType,
    category,
    requirements: requirements.length > 0 ? requirements : [category, requestType],
    confidence: capacityNeeded && targetDate ? 'HIGH' : 'MEDIUM',
    clarificationMessage,
  };
}
