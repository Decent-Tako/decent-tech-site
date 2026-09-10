/** Fictional Academy 2026 cohort snapshot. Not live supporter data. */

export const INK = '#212121';
export const PAPER = '#FFFFFF';
export const LINE = '#D9D9D9';
export const BLUE = '#0035B1';
export const YELLOW = '#DEF54F';

export type WeekRow = {
  id: string;
  title: string;
  asks: number;
  completion: number;
  remaining: number;
  complete: boolean;
};

export type StateRow = {
  id: string;
  name: string;
  participants: number;
};

export const WEEKS: WeekRow[] = [
  {
    id: 'How',
    title: 'How Learn works',
    asks: 4,
    completion: 100,
    remaining: 0,
    complete: true,
  },
  {
    id: 'W0',
    title: 'Set Up',
    asks: 8,
    completion: 40,
    remaining: 60,
    complete: false,
  },
  {
    id: 'W1',
    title: 'Write Your Story',
    asks: 14,
    completion: 0,
    remaining: 100,
    complete: false,
  },
  {
    id: 'W2',
    title: 'Map Your Donor Network',
    asks: 22,
    completion: 0,
    remaining: 100,
    complete: false,
  },
  {
    id: 'W3',
    title: 'Create and Publish Content',
    asks: 31,
    completion: 0,
    remaining: 100,
    complete: false,
  },
  {
    id: 'W4',
    title: 'Get Ready for Challenge Week',
    asks: 28,
    completion: 0,
    remaining: 100,
    complete: false,
  },
  {
    id: 'W5',
    title: 'Challenge Week',
    asks: 40,
    completion: 0,
    remaining: 100,
    complete: false,
  },
];

export const STATES: StateRow[] = [
  { id: 'NSW', name: 'New South Wales', participants: 9 },
  { id: 'VIC', name: 'Victoria', participants: 7 },
  { id: 'QLD', name: 'Queensland', participants: 6 },
  { id: 'WA', name: 'Western Australia', participants: 4 },
  { id: 'SA', name: 'South Australia', participants: 3 },
  { id: 'TAS', name: 'Tasmania', participants: 2 },
  { id: 'NT', name: 'Northern Territory', participants: 1 },
  { id: 'ACT', name: 'Australian Capital Territory', participants: 2 },
];

export const PEAK_WEEK = WEEKS[WEEKS.length - 1];
export const CURRENT_WEEK = WEEKS[1];

export const DATASET_NOTE =
  'Fictional Academy 2026 cohort snapshot. The values are not live supporter data.';
