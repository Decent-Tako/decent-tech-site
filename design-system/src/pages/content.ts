import { publicAsset } from '../brand/assets';

export const PAGE_NAV = [
  { id: 'start', label: 'Start' },
  { id: 'learn', label: 'Learn' },
  { id: 'tools', label: 'Tools' },
  { id: 'events', label: 'Events' },
  { id: 'lounge', label: 'Lounge' },
] as const;

export type PageId = (typeof PAGE_NAV)[number]['id'];

export const PHOTOS = {
  hero: {
    src: publicAsset('photos/find-your-uncomfortable.jpg'),
    alt: 'A participant part way through a physical challenge outdoors',
    caption: 'Find Your Uncomfortable challenge',
  },
  crowd: {
    src: publicAsset('photos/academy-crowd.jpg'),
    alt: 'People gathered for an Academy session',
    caption: 'Academy session',
  },
  community: {
    src: publicAsset('photos/challenge-community.jpg'),
    alt: 'Academy community standing together outdoors',
    caption: 'Buddy and Team',
  },
  run: {
    src: publicAsset('photos/community-run.jpg'),
    alt: 'A group running together across a field',
    caption: 'Take it into the street',
  },
  night: {
    src: publicAsset('photos/night-outreach.jpg'),
    alt: 'Volunteers doing night outreach on a city street',
    caption: 'Night outreach',
  },
} as const;

export const HERO = {
  kicker: "Nedd's × Mobilise",
  lede: 'A mental challenge beside the physical one. Six weeks of practice, then ten days of doing it in public. Aim for $3,000 before 19 October 2026.',
  facts: [
    { label: 'Goal', value: '$3,000' },
    { label: 'Challenge week', value: '19–28 Oct 2026' },
    { label: 'Weekly time', value: '1–2 hours' },
  ],
} as const;

export const FEATURES = [
  {
    id: 'start',
    index: '01',
    title: 'Start',
    kicker: 'Week 0',
    copy: 'Set your goal to $3,000. Find your Buddy and Team. Publish your page. Nothing here unlocks until the page is live.',
    photo: PHOTOS.hero,
  },
  {
    id: 'learn',
    index: '02',
    title: 'Learn',
    kicker: 'Six weeks',
    copy: 'Complete one week at a time. Finish the current lesson and its action before the next week opens.',
    photo: PHOTOS.crowd,
  },
  {
    id: 'tools',
    index: '03',
    title: 'Tools',
    kicker: 'Tracker and plan',
    copy: 'The 100-person tracker and the ten-day content plan. List the inner circle first. Send the first asks.',
    photo: PHOTOS.community,
  },
  {
    id: 'challenge',
    index: '04',
    title: 'Challenge week',
    kicker: '19–28 October 2026',
    copy: 'Do it, film it, thank people. Each day: do the challenge, publish, thank, follow up.',
    photo: PHOTOS.night,
  },
  {
    id: 'street',
    index: '05',
    title: 'Street',
    kicker: 'Public work',
    copy: 'Take it into the street. Keep the line short enough to say out loud.',
    photo: PHOTOS.run,
  },
] as const;

export const DESTINATIONS = [
  {
    id: 'start',
    title: 'Start',
    kicker: 'Week 0 · Set Up',
    copy: 'Five things before your first session. Complete Circle profile. Say hi in the Lounge. Find Buddy and Team. Set the goal to $3,000. RSVP to Learn + Do.',
    cta: 'Open Week 0',
    photo: PHOTOS.hero,
  },
  {
    id: 'learn',
    title: 'Learn',
    kicker: 'Six published weeks',
    copy: 'Learn contains six weekly lessons. Complete the current week and its practical action before the next lesson opens. Keep it short enough to say out loud.',
    cta: 'Open Learn',
    photo: PHOTOS.crowd,
  },
  {
    id: 'tools',
    title: 'Tools',
    kicker: 'Tracker and content plan',
    copy: 'Map 100 people. Start with the inner circle. Use the ten-day content plan during Challenge week. State the next action.',
    cta: 'Open the tracker',
    photo: PHOTOS.community,
  },
  {
    id: 'events',
    title: 'Events',
    kicker: 'Learn + Do',
    copy: 'Sunday sessions: 30 minutes learn, 30 minutes do. Challenge week runs 19–28 October 2026.',
    cta: 'See the dates',
    photo: PHOTOS.run,
  },
  {
    id: 'lounge',
    title: 'Lounge',
    kicker: 'Buddy and Team',
    copy: 'The Lounge is where Buddy and Team talk. Share what works. Move when one of you stalls. Do not say squad.',
    cta: 'Open Team chat',
    photo: PHOTOS.night,
  },
] as const;

export type DestinationId = (typeof DESTINATIONS)[number]['id'];

export const ARTICLE = {
  kicker: 'Week 0 · Learn',
  title: 'Set up before the first session.',
  dek: 'Register. Choose the 10-day challenge. Add a photo. Set $3,000. Publish the page. This takes 30 to 45 minutes.',
  readLabel: 'Reading progress',
  sections: [
    {
      heading: 'What this week is for',
      body: [
        'The Uncomfortable Academy is a mental challenge beside the physical one. You practise for six weeks. Then you do the work in public for ten days.',
        'Week 0 is Set Up. It does not ask you to write a story yet. It asks you to make the page real. The later weeks stay locked until this page is live.',
      ],
    },
    {
      heading: 'The five actions',
      body: [
        'Complete the Circle profile. Say hi in the Lounge. Find your Buddy and your Team. Set the goal to $3,000. RSVP to Learn + Do.',
        'Do them in any order. State the next action. Do not claim how a participant will feel.',
      ],
      photo: PHOTOS.crowd,
    },
    {
      heading: 'Buddy and Team',
      body: [
        'Buddy is the person you check in with most. Share what works. Move when one of you stalls.',
        'The Team Leader runs Learn + Do. They keep the Team moving. They escalate craft and safety questions.',
      ],
      photo: PHOTOS.community,
    },
    {
      heading: 'The goal and the date',
      body: [
        'The participant goal is $3,000. Challenge week starts on 19 October 2026 and ends on 28 October 2026.',
        'Weekly time is one to two hours. Challenge week is daily action: do it, film it, thank people.',
      ],
    },
    {
      heading: 'Keep the line short',
      body: [
        'When you write, keep it short enough to say out loud. Say what challenge you chose, why it is uncomfortable, why Mobilise, and what the reader must do.',
        'Use these section names: Start, Learn, Tools, Events, and Lounge. Say Buddy and Team. Do not say squad.',
      ],
      photo: PHOTOS.night,
    },
  ],
} as const;
