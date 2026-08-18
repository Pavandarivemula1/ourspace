import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'sen_salt_2026').digest('hex');
}

async function main() {
  console.log('🌱 Clearing existing database records...');
  // Delete in order to respect foreign key constraints
  await prisma.review.deleteMany();
  await prisma.outcome.deleteMany();
  await prisma.collaboration.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.introductionRequest.deleteMany();
  await prisma.venueBookingRequest.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.eventRequirement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.match.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.request.deleteMany();
  await prisma.venueAvailability.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.communityMember.deleteMany();
  await prisma.community.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log('👥 Creating primary seeded users...');

  // 1. Aarav Sharma (Founder)
  const aarav = await prisma.user.create({
    data: {
      email: 'aarav@neuralflow.ai',
      passwordHash: hashPassword('password123'),
      name: 'Aarav Sharma',
      role: 'FOUNDER',
      status: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      profile: {
        create: {
          headline: 'Founder & CEO @ NeuralFlow AI | Building Multi-Agent Healthcare Workflows',
          bio: 'Ex-Google Brain engineer building agentic infrastructure for clinical trials. Passionate about local Hyderabad tech meetups, LLM architecture, and mentoring early founders.',
          locationCity: 'Hyderabad',
          locationCountry: 'India',
          building: 'NeuralFlow AI — Autonomous agent framework for clinical trials and medical documentation.',
          lookingFor: JSON.stringify(['Event Venue', 'AI Speaker', 'Sponsors', 'Design Partners', 'Mentorship']),
          canOffer: JSON.stringify(['AI Engineering', 'Agent Architecture Mentorship', 'Workshop Hosting']),
          skills: JSON.stringify(['LLMs', 'Python', 'PyTorch', 'Next.js', 'Distributed Systems']),
          experienceYears: 7,
          websiteUrl: 'https://neuralflow.ai',
          linkedinUrl: 'https://linkedin.com/in/aarav-sharma-demo',
          githubUrl: 'https://github.com/aaravsharma-demo',
          organizerScore: 4.9,
          venueScore: 5.0,
          speakerScore: 4.8,
          collaboratorScore: 4.95,
          communityScore: 4.8,
          reviewCount: 8,
          collaborationsCount: 6,
          responseRate: 98,
          verificationLevel: 'ECOSYSTEM_VERIFIED',
        },
      },
    },
  });

  // 2. Sneha Reddy (Venue Director @ T-Hub)
  const sneha = await prisma.user.create({
    data: {
      email: 'sneha@thub.org',
      passwordHash: hashPassword('password123'),
      name: 'Sneha Reddy',
      role: 'VENUE',
      status: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      profile: {
        create: {
          headline: 'Venue Director & Community Partnerships Lead @ T-Hub Hyderabad',
          bio: 'Managing 150k sq ft of premier startup ecosystem infrastructure at T-Hub. Dedicated to enabling non-profit tech communities, hackathons, and high-impact founder workshops.',
          locationCity: 'Hyderabad',
          locationCountry: 'India',
          building: 'T-Hub Community Infrastructure & Innovation Stages.',
          lookingFor: JSON.stringify(['Startup Events', 'Hackathons', 'Community Meetups', 'Demo Days']),
          canOffer: JSON.stringify(['Event Venue', 'Office Space', 'Community Access', 'Event Equipment']),
          skills: JSON.stringify(['Venue Operations', 'Ecosystem Growth', 'Event Management']),
          experienceYears: 9,
          websiteUrl: 'https://t-hub.co',
          linkedinUrl: 'https://linkedin.com/in/sneha-reddy-thub-demo',
          organizerScore: 5.0,
          venueScore: 4.96,
          speakerScore: 4.7,
          collaboratorScore: 4.9,
          communityScore: 5.0,
          reviewCount: 24,
          collaborationsCount: 19,
          responseRate: 100,
          verificationLevel: 'ECOSYSTEM_VERIFIED',
        },
      },
    },
  });

  // 3. Dr. Vikram Rao (AI Researcher & Speaker)
  const vikram = await prisma.user.create({
    data: {
      email: 'vikram.rao@iiit.ac.in',
      passwordHash: hashPassword('password123'),
      name: 'Dr. Vikram Rao',
      role: 'PROFESSIONAL',
      status: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      profile: {
        create: {
          headline: 'AI Research Director @ IIIT Hyderabad | Ex-Chief Scientist | Keynote Speaker',
          bio: '20+ years in Machine Learning, transformer architectures, and neuro-symbolic AI. Frequently delivering keynotes for developer ecosystems and mentoring deep tech founders.',
          locationCity: 'Hyderabad',
          locationCountry: 'India',
          building: 'Next-gen compact reasoning models and agent reliability benchmarks.',
          lookingFor: JSON.stringify(['Founders', 'Research Collaborations', 'Keynote Speaking Opportunities']),
          canOffer: JSON.stringify(['Speaking', 'Mentorship', 'AI Architecture Reviews', 'Research Collaboration']),
          skills: JSON.stringify(['AI/ML', 'LLM Fine-Tuning', 'Mathematical Modeling', 'Research']),
          experienceYears: 18,
          websiteUrl: 'https://iiit.ac.in/faculty/vikramrao-demo',
          linkedinUrl: 'https://linkedin.com/in/dr-vikram-rao-demo',
          organizerScore: 4.8,
          venueScore: 5.0,
          speakerScore: 4.95,
          collaboratorScore: 4.9,
          communityScore: 4.9,
          reviewCount: 14,
          collaborationsCount: 11,
          responseRate: 94,
          verificationLevel: 'ECOSYSTEM_VERIFIED',
        },
      },
    },
  });

  // 4. Pooja Verma (Community Lead @ Hyderabad AI Collective)
  const pooja = await prisma.user.create({
    data: {
      email: 'pooja@hydai.network',
      passwordHash: hashPassword('password123'),
      name: 'Pooja Verma',
      role: 'COMMUNITY',
      status: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
      profile: {
        create: {
          headline: 'Lead Community Builder @ Hyderabad AI & DeepTech Network (1,500+ builders)',
          bio: 'Empowering grassroots engineers and founders across Telangana through weekly hands-on sprints, demo days, and open-source hackathons.',
          locationCity: 'Hyderabad',
          locationCountry: 'India',
          building: 'Grassroots engineering cohorts and open tech salons.',
          lookingFor: JSON.stringify(['Venues', 'Sponsors', 'Keynote Speakers', 'Community Partners']),
          canOffer: JSON.stringify(['Community Access', 'Event Promotion', 'Event Hosting', 'Talent Pipeline']),
          skills: JSON.stringify(['Community Building', 'Event Production', 'Partnerships']),
          experienceYears: 5,
          websiteUrl: 'https://hydai.network',
          organizerScore: 4.9,
          venueScore: 5.0,
          speakerScore: 4.6,
          collaboratorScore: 4.85,
          communityScore: 4.98,
          reviewCount: 18,
          collaborationsCount: 15,
          responseRate: 97,
          verificationLevel: 'ECOSYSTEM_VERIFIED',
        },
      },
    },
  });

  // 5. Rajesh Kumar (Platform Super Admin)
  const rajesh = await prisma.user.create({
    data: {
      email: 'admin@ecosystem.hyd',
      passwordHash: hashPassword('password123'),
      name: 'Rajesh Kumar',
      role: 'ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      profile: {
        create: {
          headline: 'Platform Super Administrator & Ecosystem Trust Officer',
          bio: 'Ensuring trust, verification standards, and authentic collaboration across the Startup Ecosystem Network.',
          locationCity: 'Hyderabad',
          locationCountry: 'India',
          lookingFor: JSON.stringify(['Ecosystem Safety', 'Verified Venues', 'High Impact Collaborations']),
          canOffer: JSON.stringify(['Platform Governance', 'Verification', 'Dispute Resolution']),
          organizerScore: 5.0,
          venueScore: 5.0,
          speakerScore: 5.0,
          collaboratorScore: 5.0,
          communityScore: 5.0,
          reviewCount: 30,
          collaborationsCount: 25,
          responseRate: 100,
          verificationLevel: 'ECOSYSTEM_VERIFIED',
        },
      },
    },
  });

  // Additional secondary personas
  const kavya = await prisma.user.create({
    data: {
      email: 'kavya@pixelcraft.design',
      passwordHash: hashPassword('password123'),
      name: 'Kavya Nair',
      role: 'PROFESSIONAL',
      status: 'ACTIVE',
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
      profile: {
        create: {
          headline: 'Staff Product Designer & Design System Architect @ PixelCraft',
          bio: 'Specializing in design systems, zero-to-one B2B SaaS UX, and rapid interactive prototyping for early startups.',
          locationCity: 'Hyderabad',
          lookingFor: JSON.stringify(['Early-stage AI Startups', 'Design Partner Collaborations']),
          canOffer: JSON.stringify(['Design', 'UI/UX Audits', 'Design Systems']),
          skills: JSON.stringify(['Figma', 'Design Systems', 'UX Research', 'Tailwind CSS']),
          experienceYears: 6,
          organizerScore: 5.0,
          collaboratorScore: 4.9,
          reviewCount: 6,
          verificationLevel: 'EMAIL_VERIFIED',
        },
      },
    },
  });

  console.log('🏢 Creating Organizations & Communities...');

  // Organization: NeuralFlow AI
  const orgNeuralFlow = await prisma.organization.create({
    data: {
      name: 'NeuralFlow AI',
      slug: 'neuralflow-ai',
      description: 'Autonomous multi-agent orchestration for clinical research and healthcare informatics.',
      industry: 'Artificial Intelligence & HealthTech',
      locationCity: 'Hyderabad',
      stage: 'SEED',
      teamSize: '6-10',
      building: 'Agentic medical summarization pipeline.',
      lookingFor: JSON.stringify(['Hospital Design Partners', 'AI Infrastructure Sponsors', 'Event Space']),
      canOffer: JSON.stringify(['AI Engineering Mentorship', 'Deep Tech Tech-Talks']),
      isVerified: true,
      members: {
        create: {
          userId: aarav.id,
          role: 'OWNER',
        },
      },
    },
  });

  // Community: Hyderabad AI & DeepTech Collective
  const commHydAI = await prisma.community.create({
    data: {
      name: 'Hyderabad AI & DeepTech Collective',
      slug: 'hyderabad-ai-collective',
      description: 'The premier community of 1,500+ AI researchers, ML engineers, deep tech founders, and hobbyists in Hyderabad.',
      locationCity: 'Hyderabad',
      categories: JSON.stringify(['AI', 'DeepTech', 'LLMs', 'Open Source']),
      isVerified: true,
      memberCount: 1540,
      members: {
        create: [
          { userId: pooja.id, role: 'ORGANIZER' },
          { userId: aarav.id, role: 'MEMBER' },
          { userId: vikram.id, role: 'MEMBER' },
        ],
      },
    },
  });

  console.log('📍 Creating Structured Venues...');

  // Venue 1: T-Hub Catalyst Stage & Innovation Arena
  const venueTHub = await prisma.venue.create({
    data: {
      ownerId: sneha.id,
      name: 'T-Hub Catalyst Stage & Innovation Arena',
      description: 'Tier-1 amphitheater style event space equipped with state-of-the-art dual 4K laser projectors, wireless mic systems, and high-speed enterprise Wi-Fi. Perfect for AI meetups, pitch nights, and hackathons.',
      locationCity: 'Hyderabad',
      neighborhood: 'Knowledge City, Hitec City',
      addressSecret: 'T-Hub Phase 2, 4th Floor, Plot No 1/C, Sy No 83/1, Raidurgam, Hyderabad 500081',
      capacity: 120,
      pricingType: 'COMMUNITY_SPONSORED',
      priceDetails: 'Free for non-commercial community tech events and open-source meetups. Booking approval required.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
      ]),
      facilities: JSON.stringify(['High-speed Wi-Fi', '4K Laser Projectors', 'Wireless Mics & Sound System', 'Auditorium Seating', 'AC', 'Dedicated Parking', 'Live Streaming Setup']),
      eventTypes: JSON.stringify(['Meetups', 'Hackathons', 'Pitch Nights', 'Workshops', 'Conferences']),
      operatingHours: '09:00 - 22:00',
      rules: JSON.stringify({
        cleanup: 'Organizers must ensure all trash is collected after the session.',
        security: 'All attendees must pre-register with government photo ID at the reception gate.',
        equipment: 'Sound console operated by on-site AV engineer or certified organizer.',
        cancellation: 'Notice required at least 48 hours in advance.',
      }),
      isVerified: true,
      rating: 4.96,
      reviewCount: 22,
      approvalRequired: true,
    },
  });

  // Venue 2: CIE IIIT Hyderabad Tech Hall
  const venueCIE = await prisma.venue.create({
    data: {
      ownerId: vikram.id,
      name: 'CIE IIIT Hyderabad Innovation Hall',
      description: 'Academic and startup hub inside IIIT Hyderabad campus. Ideal for hands-on technical workshops, paper discussions, and deep tech hackathons.',
      locationCity: 'Hyderabad',
      neighborhood: 'Gachibowli',
      addressSecret: 'Center for Innovation and Entrepreneurship, IIIT-H Campus, Gachibowli, Hyderabad 500032',
      capacity: 65,
      pricingType: 'FREE',
      priceDetails: 'Complimentary for research, engineering cohorts, and student founder events.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800',
      ]),
      facilities: JSON.stringify(['High-speed Wi-Fi', 'Dual Projectors', 'Magnetic Whiteboards', 'Power Outlets at Every Seat', 'AC', 'Visitor Parking']),
      eventTypes: JSON.stringify(['Workshops', 'Meetups', 'Demo Days', 'Study Groups']),
      operatingHours: '10:00 - 21:00',
      rules: JSON.stringify({
        cleanup: 'Return chairs to standard classroom layout after session.',
        security: 'Campus security gate entry requires QR code invitation.',
      }),
      isVerified: true,
      rating: 4.9,
      reviewCount: 16,
      approvalRequired: true,
    },
  });

  // Venue 3: Founders Cafe & Rooftop Lounge
  const venueFoundersCafe = await prisma.venue.create({
    data: {
      ownerId: sneha.id,
      name: 'Founders Cafe & Rooftop Terrace',
      description: 'Cozy, informal networking venue in the heart of Jubilee Hills. Great for founder fireside chats, pitch mixers, and weekend brainstorming sessions.',
      locationCity: 'Hyderabad',
      neighborhood: 'Road No 36, Jubilee Hills',
      addressSecret: 'Plot 420, Road No 36, Jubilee Hills, Hyderabad 500033',
      capacity: 45,
      pricingType: 'BARTER',
      priceDetails: 'Venue is complimentary with minimum beverage/coffee order for attendees.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
      ]),
      facilities: JSON.stringify(['Wi-Fi', 'Smart TV / Display', 'Wireless Mic', 'Coffee Bar', 'Rooftop Open Area', 'Valet Parking']),
      eventTypes: JSON.stringify(['Networking', 'Fireside Chats', 'Founders Breakfast', 'Pitch Mixers']),
      operatingHours: '08:00 - 23:00',
      rules: JSON.stringify({
        cleanup: 'Cafe staff handles cleanup.',
        equipment: 'Plug-and-play HDMI provided.',
      }),
      isVerified: true,
      rating: 4.85,
      reviewCount: 14,
      approvalRequired: false,
    },
  });

  console.log('📌 Creating Initial Requests & Offers...');

  // Request 1: Aarav needs Venue for AI Meetup
  const reqVenue = await prisma.request.create({
    data: {
      userId: aarav.id,
      requestType: 'VENUE',
      title: 'Need a 40-50 person venue for Hyderabad AI Founders & Builders Meetup',
      description: 'Hosting a focused Saturday evening meetup on "Production LLM Agent Frameworks & Evaluation". Looking for a tech venue in Hitec City / Gachibowli with projector, mics, and Wi-Fi.',
      locationCity: 'Hyderabad',
      targetDate: '2026-08-22',
      targetTimeSlot: 'EVENING',
      budgetType: 'FREE',
      capacityNeeded: 45,
      requirements: JSON.stringify(['Projector', 'Mics', 'High-speed Wi-Fi', 'Hitec City or Gachibowli']),
      category: 'AI',
      status: 'PUBLISHED',
    },
  });

  // Request 2: Aarav needs Speaker on AI Agents
  const reqSpeaker = await prisma.request.create({
    data: {
      userId: aarav.id,
      requestType: 'SPEAKER',
      title: 'Looking for a Keynote Speaker on Agentic Architectures & LLM Evaluation',
      description: 'Seeking a hands-on AI researcher or CTO to give a 30-minute keynote on agent failure modes, memory pipelines, and benchmark metrics for our Hyderabad AI meetup.',
      locationCity: 'Hyderabad',
      targetDate: '2026-08-22',
      targetTimeSlot: 'EVENING',
      budgetType: 'FREE',
      requirements: JSON.stringify(['LLMs', 'Agent Frameworks', 'Hands-on Code', 'Research/Industry Experience']),
      category: 'AI',
      status: 'PUBLISHED',
    },
  });

  // Request 3: Need Design Partner for B2B Healthcare SaaS
  const reqDesign = await prisma.request.create({
    data: {
      userId: aarav.id,
      orgId: orgNeuralFlow.id,
      requestType: 'DESIGNER',
      title: 'Looking for a Design Partner for Clinical Trial Agent UI/UX MVP',
      description: 'NeuralFlow AI is designing a web workspace for doctors and researchers. Need a senior product designer for an initial 4-week design sprint to co-create user flows and Figma components.',
      locationCity: 'Hyderabad',
      budgetType: 'PAID',
      budgetAmount: '₹80,000 / sprint',
      requirements: JSON.stringify(['Figma', 'B2B SaaS', 'Healthcare/Complex Workflows', 'Design System']),
      category: 'AI',
      status: 'PUBLISHED',
    },
  });

  // Offer 1: Dr. Vikram offers Speaking & Mentorship
  const offerSpeaker = await prisma.offer.create({
    data: {
      userId: vikram.id,
      offerType: 'SPEAKING',
      title: 'AI/ML Keynote Talks & Deep Tech Architecture Sessions',
      description: 'Available to speak on Agentic AI, reasoning models, neuro-symbolic reasoning, and production LLM scaling for developer communities and startup cohorts.',
      locationCity: 'Hyderabad',
      availability: 'EVENINGS_AND_WEEKENDS',
      pricingType: 'FREE',
      requirements: JSON.stringify(['Technical Audience', 'Q&A Session', 'Advance Notice']),
      category: 'AI',
      status: 'ACTIVE',
    },
  });

  // Offer 2: Sneha offers T-Hub Catalyst Stage
  const offerVenueTHub = await prisma.offer.create({
    data: {
      userId: sneha.id,
      offerType: 'EVENT_VENUE',
      title: 'T-Hub 120-Seat Amphitheater & Innovation Hall for Tech Communities',
      description: 'Offering our premier event facilities for verified developer communities, open source workshops, and founder demo days.',
      locationCity: 'Hyderabad',
      capacity: 120,
      pricingType: 'FREE',
      requirements: JSON.stringify(['Open Registration', 'Tech/Startup Focus', '48hr Advance Approval']),
      category: 'AI',
      status: 'ACTIVE',
    },
  });

  // Offer 3: Kavya offers UX Audits & Design Collaboration
  const offerDesign = await prisma.offer.create({
    data: {
      userId: kavya.id,
      offerType: 'DESIGN',
      title: 'UI/UX Design Sprints & Design System Architecture for Early Startups',
      description: 'Offering design sprints, prototype critiques, and scalable component architecture for seed/early-stage founders.',
      locationCity: 'Hyderabad',
      pricingType: 'DISCOUNTED',
      pricingDetails: 'Startup friendly rates or barter for interesting AI products',
      requirements: JSON.stringify(['Clear product brief', 'Access to target users']),
      category: 'Design',
      status: 'ACTIVE',
    },
  });

  console.log('⚡ Generating Pre-Calculated Transparent Matches...');

  // Match 1: Request Venue <-> T-Hub Venue Offer
  await prisma.match.create({
    data: {
      requestId: reqVenue.id,
      offerId: offerVenueTHub.id,
      matchedUserId: sneha.id,
      matchedVenueId: venueTHub.id,
      matchType: 'VENUE',
      totalScore: 94,
      factors: JSON.stringify({
        location: 30,
        availability: 25,
        capacity: 20,
        facilities: 14,
        reputation: 5,
      }),
      explanation: JSON.stringify([
        'Same city (Hyderabad, Hitec City) +30',
        'Available on target Saturday evening window +25',
        'Capacity compatible (120 seats fits 45 attendees perfectly) +20',
        'Has requested facilities (4K Projector, Wireless Mics, AC, High-speed Wi-Fi) +14',
        'Ecosystem verified venue provider with 4.96 rating +5',
      ]),
      status: 'SUGGESTED',
    },
  });

  // Match 2: Request Speaker <-> Dr. Vikram Rao Speaking Offer
  await prisma.match.create({
    data: {
      requestId: reqSpeaker.id,
      offerId: offerSpeaker.id,
      matchedUserId: vikram.id,
      matchType: 'SPEAKER',
      totalScore: 92,
      factors: JSON.stringify({
        expertise: 35,
        availability: 20,
        location: 15,
        experience: 12,
        reputation: 10,
      }),
      explanation: JSON.stringify([
        'Deep expertise in Agentic LLM Architectures & Transformers +35',
        'Available on weekend evenings +20',
        'Local in Hyderabad (IIIT Hyderabad) +15',
        '18+ years research & industry track record +12',
        'Ecosystem verified keynote speaker with 4.95 score +10',
      ]),
      status: 'SUGGESTED',
    },
  });

  console.log('🎉 Creating Flagship Event: "AI Founders Meetup Hyderabad"...');

  // Flagship Event
  const flagshipEvent = await prisma.event.create({
    data: {
      title: 'AI Founders & Builders Meetup — Agents in Production',
      slug: 'ai-founders-builders-meetup-agents-in-production',
      description: 'An intimate, highly technical meetup for AI founders, engineers, and researchers exploring multi-agent workflows, evals, and memory pipelines.',
      category: 'AI',
      organizerId: aarav.id,
      communityId: commHydAI.id,
      orgId: orgNeuralFlow.id,
      date: '2026-08-22',
      startTime: '17:30',
      endTime: '20:30',
      locationCity: 'Hyderabad',
      capacity: 45,
      status: 'SEEKING_RESOURCES', // Will auto-progress to RESOURCES_FULFILLED once requirements are approved!
      visibility: 'PUBLIC',
      coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000',
      requirements: {
        create: [
          {
            requirementType: 'VENUE',
            title: '40-50 person Tech Event Space in Hitec City / Gachibowli',
            description: 'Needs projector, mic, and seating for 45 engineers.',
            required: true,
            status: 'PENDING',
            linkedRequestId: reqVenue.id,
          },
          {
            requirementType: 'SPEAKER',
            title: 'Keynote Speaker: Agentic Reliability & Architecture',
            description: '30-minute talk + 15 min Q&A on production multi-agent systems.',
            required: true,
            status: 'PENDING',
            linkedRequestId: reqSpeaker.id,
          },
          {
            requirementType: 'COMMUNITY_PARTNER',
            title: 'Community Co-Host & Promotion Partner',
            description: 'Help promote event to local builders and handle registration check-in.',
            required: false,
            status: 'CONFIRMED',
            fulfilledByUserId: pooja.id,
          },
        ],
      },
      registrations: {
        create: [
          { userId: aarav.id, status: 'REGISTERED' },
          { userId: kavya.id, status: 'REGISTERED' },
        ],
      },
    },
  });

  console.log('🤝 Creating Completed Collaboration & Multidimensional Reviews...');

  // Prior Connection between Aarav and Dr. Vikram Rao
  const connectionAaravVikram = await prisma.connection.create({
    data: {
      userAId: aarav.id,
      userBId: vikram.id,
      source: 'INTRO_ACCEPTED',
      relationshipType: 'MENTOR',
      status: 'ACTIVE',
    },
  });

  // Completed Collaboration
  const collabAaravVikram = await prisma.collaboration.create({
    data: {
      connectionId: connectionAaravVikram.id,
      userAId: aarav.id,
      userBId: vikram.id,
      title: 'Agent Evaluation Benchmark Advisory for NeuralFlow AI',
      description: 'Dr. Vikram Rao provided 4 weeks of technical advisory on synthetic dataset generation and medical LLM evaluation rubrics.',
      category: 'MENTORSHIP',
      status: 'COMPLETED',
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  });

  // Outcome
  const outcomeAdvisory = await prisma.outcome.create({
    data: {
      collaborationId: collabAaravVikram.id,
      outcomeType: 'MENTORSHIP_STARTED',
      title: 'Completed 4-Week AI Evals Advisory',
      description: 'Successfully established deterministic benchmark harness for healthcare agents with 94% precision validation.',
      metrics: JSON.stringify({ hoursMentored: 12, benchmarksFormulated: 4 }),
      createdById: aarav.id,
    },
  });

  // Reviews with distinct dimensions
  await prisma.review.create({
    data: {
      outcomeId: outcomeAdvisory.id,
      reviewerId: aarav.id,
      revieweeId: vikram.id,
      dimension: 'SPEAKER',
      rating: 5,
      content: 'Dr. Vikram provided world-class guidance on agent evaluation pipelines. Deep technical clarity, punctual, and highly actionable insights.',
      wasPunctual: true,
      wouldRecommend: true,
    },
  });

  await prisma.review.create({
    data: {
      outcomeId: outcomeAdvisory.id,
      reviewerId: vikram.id,
      revieweeId: aarav.id,
      dimension: 'COLLABORATOR',
      rating: 5,
      content: 'Aarav and NeuralFlow are building exceptionally rigorous engineering pipelines. Great velocity and clear communication throughout.',
      wasPunctual: true,
      wouldRecommend: true,
    },
  });

  // Seed Conversation & Messages
  const convo = await prisma.conversation.create({
    data: {
      type: 'DIRECT',
      title: 'Aarav Sharma & Dr. Vikram Rao',
      participants: {
        create: [
          { userId: aarav.id },
          { userId: vikram.id },
        ],
      },
      messages: {
        create: [
          {
            senderId: aarav.id,
            content: 'Hello Dr. Vikram! Excited to connect and discuss the agent benchmarking notes.',
            isRead: true,
          },
          {
            senderId: vikram.id,
            content: 'Hi Aarav, glad to connect! Reviewed the spec you sent — the evaluation loop looks solid.',
            isRead: true,
          },
        ],
      },
    },
  });

  // Seed In-App Notifications
  await prisma.notification.create({
    data: {
      userId: aarav.id,
      type: 'NEW_MATCH',
      title: '🎯 New 94% Venue Match found for your Meetup',
      message: 'T-Hub Catalyst Stage matches your capacity (45 seats) and location (Hitec City) requirements.',
      link: '/requests',
    },
  });

  await prisma.notification.create({
    data: {
      userId: sneha.id,
      type: 'VENUE_REQUEST',
      title: '📍 New Venue Inquiry for T-Hub Catalyst Stage',
      message: 'Aarav Sharma is seeking a venue for "AI Founders & Builders Meetup" on Aug 22.',
      link: '/venues',
    },
  });

  // Audit Logs
  await prisma.auditLog.create({
    data: {
      actorId: rajesh.id,
      action: 'VENUE_VERIFIED',
      entityType: 'Venue',
      entityId: venueTHub.id,
      details: JSON.stringify({ venueName: 'T-Hub Catalyst Stage & Innovation Arena', verificationStatus: 'APPROVED' }),
    },
  });

  console.log('✅ Database seeded successfully with authentic Hyderabad ecosystem demo records!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
