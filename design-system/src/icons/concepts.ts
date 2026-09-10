export const ACADEMY_CONCEPTS = [
  { id: 'start', label: 'Start / rocket' },
  { id: 'tools', label: 'Tools / wrench' },
  { id: 'learn', label: 'Learn / book' },
  { id: 'lounge', label: 'Lounge / chat' },
  { id: 'events', label: 'Events / calendar' },
  { id: 'captains', label: 'Captains / people' },
  { id: 'map', label: 'Map' },
  { id: 'buddy', label: 'Buddy' },
  { id: 'teams', label: 'Teams' },
  { id: 'running', label: 'Running' },
  { id: 'sport', label: 'Sport' },
  { id: 'challenge', label: 'Challenge' },
] as const;

export type ConceptId = (typeof ACADEMY_CONCEPTS)[number]['id'];
