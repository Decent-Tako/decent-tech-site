import type { CSSProperties, ReactNode } from 'react';
import {
  BookOpenIcon as HeroBookOpen,
  CalendarIcon as HeroCalendar,
  ChatBubbleLeftRightIcon as HeroChat,
  FlagIcon as HeroFlag,
  MapIcon as HeroMap,
  RocketLaunchIcon as HeroRocket,
  UserGroupIcon as HeroUserGroup,
  UserPlusIcon as HeroUserPlus,
  UsersIcon as HeroUsers,
  WrenchIcon as HeroWrench,
} from '@heroicons/react/24/outline';
import { RocketLaunchIcon as HeroRocketSolid } from '@heroicons/react/24/solid';
import { BarbellIcon } from '@phosphor-icons/react/Barbell';
import { BookOpenIcon } from '@phosphor-icons/react/BookOpen';
import { CalendarIcon } from '@phosphor-icons/react/Calendar';
import { ChatsCircleIcon } from '@phosphor-icons/react/ChatsCircle';
import { FlagIcon } from '@phosphor-icons/react/Flag';
import { HandshakeIcon } from '@phosphor-icons/react/Handshake';
import { MapTrifoldIcon } from '@phosphor-icons/react/MapTrifold';
import { PersonSimpleRunIcon } from '@phosphor-icons/react/PersonSimpleRun';
import { RocketIcon } from '@phosphor-icons/react/Rocket';
import { UsersIcon } from '@phosphor-icons/react/Users';
import { UsersThreeIcon } from '@phosphor-icons/react/UsersThree';
import { WrenchIcon } from '@phosphor-icons/react/Wrench';
import {
  IconBallFootball,
  IconBook,
  IconCalendarEvent,
  IconFriends,
  IconMap,
  IconMessageCircle,
  IconRocket,
  IconRun,
  IconTool,
  IconTrophy,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';
import {
  BookOpen,
  Calendar,
  Dumbbell,
  Flag,
  Handshake,
  Map,
  MessageCircle,
  Rocket,
  Users,
  UsersRound,
  Wrench,
} from 'lucide-react';

import { ACADEMY_CONCEPTS, type ConceptId } from './concepts';
import { ICON_PACKAGES, type IconPackageId } from './packages';

export type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

export type IconRenderProps = {
  size: number;
  color?: string;
  mirrored?: boolean;
  labelled?: boolean;
  strokeWidth?: number;
  weight?: IconWeight;
  heroSolid?: boolean;
};

type CatalogEntry = {
  name: string;
  render: (props: IconRenderProps) => ReactNode;
};

function accessibleName(packageName: string, iconName: string) {
  return `${packageName} ${iconName}`;
}

function cssMirror(mirrored: boolean | undefined): CSSProperties | undefined {
  return mirrored ? { transform: 'scaleX(-1)' } : undefined;
}

function lucideIcon(
  Icon: typeof Rocket,
  iconName: string,
  props: IconRenderProps,
) {
  const name = accessibleName('lucide-react', iconName);
  return (
    <Icon
      size={props.size}
      color={props.color}
      strokeWidth={props.strokeWidth}
      role={props.labelled ? 'img' : undefined}
      aria-label={props.labelled ? name : undefined}
      aria-hidden={props.labelled ? undefined : true}
      style={cssMirror(props.mirrored)}
    />
  );
}

function phosphorIcon(
  Icon: typeof RocketIcon,
  iconName: string,
  props: IconRenderProps,
) {
  const name = accessibleName('@phosphor-icons/react', iconName);
  return (
    <Icon
      size={props.size}
      color={props.color}
      weight={props.weight}
      mirrored={props.mirrored}
      role={props.labelled ? 'img' : undefined}
      alt={props.labelled ? name : undefined}
    />
  );
}

function tablerIcon(
  Icon: typeof IconRocket,
  iconName: string,
  props: IconRenderProps,
) {
  const name = accessibleName('@tabler/icons-react', iconName);
  return (
    <Icon
      size={props.size}
      color={props.color}
      stroke={props.strokeWidth}
      role={props.labelled ? 'img' : undefined}
      title={props.labelled ? name : undefined}
      aria-hidden={props.labelled ? undefined : true}
      style={cssMirror(props.mirrored)}
    />
  );
}

function heroIcon(
  Outline: typeof HeroRocket,
  Solid: typeof HeroRocketSolid | undefined,
  iconName: string,
  props: IconRenderProps,
) {
  const Icon = props.heroSolid && Solid ? Solid : Outline;
  const name = accessibleName('@heroicons/react', iconName);
  return (
    <Icon
      width={props.size}
      height={props.size}
      aria-label={props.labelled ? name : undefined}
      aria-hidden={props.labelled ? undefined : true}
      role={props.labelled ? 'img' : undefined}
      style={{
        color: props.color,
        width: props.size,
        height: props.size,
        ...cssMirror(props.mirrored),
      }}
    />
  );
}

const LUCIDE: Record<ConceptId, CatalogEntry | null> = {
  start: { name: 'Rocket', render: (props) => lucideIcon(Rocket, 'Rocket', props) },
  tools: { name: 'Wrench', render: (props) => lucideIcon(Wrench, 'Wrench', props) },
  learn: { name: 'BookOpen', render: (props) => lucideIcon(BookOpen, 'BookOpen', props) },
  lounge: {
    name: 'MessageCircle',
    render: (props) => lucideIcon(MessageCircle, 'MessageCircle', props),
  },
  events: { name: 'Calendar', render: (props) => lucideIcon(Calendar, 'Calendar', props) },
  captains: { name: 'Users', render: (props) => lucideIcon(Users, 'Users', props) },
  map: { name: 'Map', render: (props) => lucideIcon(Map, 'Map', props) },
  buddy: { name: 'Handshake', render: (props) => lucideIcon(Handshake, 'Handshake', props) },
  teams: {
    name: 'UsersRound',
    render: (props) => lucideIcon(UsersRound, 'UsersRound', props),
  },
  running: null,
  sport: { name: 'Dumbbell', render: (props) => lucideIcon(Dumbbell, 'Dumbbell', props) },
  challenge: { name: 'Flag', render: (props) => lucideIcon(Flag, 'Flag', props) },
};

const PHOSPHOR: Record<ConceptId, CatalogEntry | null> = {
  start: { name: 'RocketIcon', render: (props) => phosphorIcon(RocketIcon, 'RocketIcon', props) },
  tools: { name: 'WrenchIcon', render: (props) => phosphorIcon(WrenchIcon, 'WrenchIcon', props) },
  learn: {
    name: 'BookOpenIcon',
    render: (props) => phosphorIcon(BookOpenIcon, 'BookOpenIcon', props),
  },
  lounge: {
    name: 'ChatsCircleIcon',
    render: (props) => phosphorIcon(ChatsCircleIcon, 'ChatsCircleIcon', props),
  },
  events: {
    name: 'CalendarIcon',
    render: (props) => phosphorIcon(CalendarIcon, 'CalendarIcon', props),
  },
  captains: { name: 'UsersIcon', render: (props) => phosphorIcon(UsersIcon, 'UsersIcon', props) },
  map: {
    name: 'MapTrifoldIcon',
    render: (props) => phosphorIcon(MapTrifoldIcon, 'MapTrifoldIcon', props),
  },
  buddy: {
    name: 'HandshakeIcon',
    render: (props) => phosphorIcon(HandshakeIcon, 'HandshakeIcon', props),
  },
  teams: {
    name: 'UsersThreeIcon',
    render: (props) => phosphorIcon(UsersThreeIcon, 'UsersThreeIcon', props),
  },
  running: {
    name: 'PersonSimpleRunIcon',
    render: (props) => phosphorIcon(PersonSimpleRunIcon, 'PersonSimpleRunIcon', props),
  },
  sport: {
    name: 'BarbellIcon',
    render: (props) => phosphorIcon(BarbellIcon, 'BarbellIcon', props),
  },
  challenge: { name: 'FlagIcon', render: (props) => phosphorIcon(FlagIcon, 'FlagIcon', props) },
};

const TABLER: Record<ConceptId, CatalogEntry | null> = {
  start: { name: 'IconRocket', render: (props) => tablerIcon(IconRocket, 'IconRocket', props) },
  tools: { name: 'IconTool', render: (props) => tablerIcon(IconTool, 'IconTool', props) },
  learn: { name: 'IconBook', render: (props) => tablerIcon(IconBook, 'IconBook', props) },
  lounge: {
    name: 'IconMessageCircle',
    render: (props) => tablerIcon(IconMessageCircle, 'IconMessageCircle', props),
  },
  events: {
    name: 'IconCalendarEvent',
    render: (props) => tablerIcon(IconCalendarEvent, 'IconCalendarEvent', props),
  },
  captains: { name: 'IconUsers', render: (props) => tablerIcon(IconUsers, 'IconUsers', props) },
  map: { name: 'IconMap', render: (props) => tablerIcon(IconMap, 'IconMap', props) },
  buddy: { name: 'IconFriends', render: (props) => tablerIcon(IconFriends, 'IconFriends', props) },
  teams: {
    name: 'IconUsersGroup',
    render: (props) => tablerIcon(IconUsersGroup, 'IconUsersGroup', props),
  },
  running: { name: 'IconRun', render: (props) => tablerIcon(IconRun, 'IconRun', props) },
  sport: {
    name: 'IconBallFootball',
    render: (props) => tablerIcon(IconBallFootball, 'IconBallFootball', props),
  },
  challenge: { name: 'IconTrophy', render: (props) => tablerIcon(IconTrophy, 'IconTrophy', props) },
};

const HEROICONS: Record<ConceptId, CatalogEntry | null> = {
  start: {
    name: 'RocketLaunchIcon',
    render: (props) => heroIcon(HeroRocket, HeroRocketSolid, 'RocketLaunchIcon', props),
  },
  tools: {
    name: 'WrenchIcon',
    render: (props) => heroIcon(HeroWrench, undefined, 'WrenchIcon', props),
  },
  learn: {
    name: 'BookOpenIcon',
    render: (props) => heroIcon(HeroBookOpen, undefined, 'BookOpenIcon', props),
  },
  lounge: {
    name: 'ChatBubbleLeftRightIcon',
    render: (props) => heroIcon(HeroChat, undefined, 'ChatBubbleLeftRightIcon', props),
  },
  events: {
    name: 'CalendarIcon',
    render: (props) => heroIcon(HeroCalendar, undefined, 'CalendarIcon', props),
  },
  captains: {
    name: 'UserGroupIcon',
    render: (props) => heroIcon(HeroUserGroup, undefined, 'UserGroupIcon', props),
  },
  map: { name: 'MapIcon', render: (props) => heroIcon(HeroMap, undefined, 'MapIcon', props) },
  buddy: {
    name: 'UserPlusIcon',
    render: (props) => heroIcon(HeroUserPlus, undefined, 'UserPlusIcon', props),
  },
  teams: {
    name: 'UsersIcon',
    render: (props) => heroIcon(HeroUsers, undefined, 'UsersIcon', props),
  },
  running: null,
  sport: null,
  challenge: {
    name: 'FlagIcon',
    render: (props) => heroIcon(HeroFlag, undefined, 'FlagIcon', props),
  },
};

const CATALOG: Record<IconPackageId, Record<ConceptId, CatalogEntry | null>> = {
  lucide: LUCIDE,
  phosphor: PHOSPHOR,
  tabler: TABLER,
  heroicons: HEROICONS,
};

function IconCell({
  packageId,
  conceptId,
  props,
}: {
  packageId: IconPackageId;
  conceptId: ConceptId;
  props: IconRenderProps;
}) {
  const pkg = ICON_PACKAGES.find((item) => item.id === packageId);
  const concept = ACADEMY_CONCEPTS.find((item) => item.id === conceptId);
  const entry = CATALOG[packageId][conceptId];

  if (!pkg || !concept) {
    return null;
  }

  if (!entry) {
    return (
      <span
        className="icons-gap"
        role="status"
        aria-label={`${pkg.packageName} has no ${concept.label} icon`}
      >
        No icon
      </span>
    );
  }

  return (
    <div className="icons-cell">
      {entry.render(props)}
      <span className="icons-name">{entry.name}</span>
    </div>
  );
}

export function IconComparison({
  themed = false,
  labelled = true,
  size = 24,
}: {
  themed?: boolean;
  labelled?: boolean;
  size?: number;
}) {
  const color = themed ? '#0035B1' : undefined;
  const props: IconRenderProps = { size, color, labelled, strokeWidth: 2, weight: 'regular' };

  return (
    <div className={themed ? 'icons-root icons-themed' : 'icons-root'}>
      <p className="icons-note">
        {themed
          ? 'Light theme: package color #0035B1. Geometry is unchanged.'
          : 'Upstream default: package size 24 and currentColor. Geometry is unchanged.'}
      </p>
      <table className="icons-table">
        <caption className="icons-note">Academy concepts across maintained icon packages</caption>
        <thead>
          <tr>
            <th scope="col">Concept</th>
            {ICON_PACKAGES.map((pkg) => (
              <th key={pkg.id} scope="col">
                {pkg.packageName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ACADEMY_CONCEPTS.map((concept) => (
            <tr key={concept.id}>
              <th scope="row">{concept.label}</th>
              {ICON_PACKAGES.map((pkg) => (
                <td key={pkg.id}>
                  <IconCell packageId={pkg.id} conceptId={concept.id} props={props} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function IconControls({ props }: { props: IconRenderProps }) {
  return (
    <div className="icons-root">
      <p className="icons-note">
        Start / rocket through each package API. Stroke applies to Lucide and Tabler. Weight
        applies to Phosphor. Solid applies to Heroicons. Phosphor uses mirrored. The others use
        CSS scaleX(-1).
      </p>
      <div className="icons-controls">
        {ICON_PACKAGES.map((pkg) => (
          <div key={pkg.id} className="icons-control-card">
            <h3>{pkg.packageName}</h3>
            <IconCell packageId={pkg.id} conceptId="start" props={props} />
            {pkg.strokeProp ? (
              <p className="icons-unsupported">{`${pkg.strokeProp} supported`}</p>
            ) : (
              <p className="icons-unsupported">No stroke prop</p>
            )}
            {pkg.weightProp ? (
              <p className="icons-unsupported">{`${pkg.weightProp} supported`}</p>
            ) : (
              <p className="icons-unsupported">No weight prop</p>
            )}
            {pkg.mirrorProp ? (
              <p className="icons-unsupported">{`${pkg.mirrorProp} supported`}</p>
            ) : (
              <p className="icons-unsupported">Mirror uses CSS</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
