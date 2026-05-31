import React from 'react';
import Svg, { Path, Circle, Rect, Polyline, Line } from 'react-native-svg';

// Premium thin-line gold devotional icons matching the Antar onboarding spec.
// All take { size, color? } and render at 24×24 viewBox.

type IconProps = { size: number; color?: string };
const D = '#B8862F'; // muted temple gold (spec §4)
const sw = 1.3;

const wrap = (children: React.ReactNode, size: number) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {children}
  </Svg>
);

export const LotusIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Path
        d="M12 18 C 7 17 4 14 4 11 C 6 12 8 12.5 9 13"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <Path d="M12 18 C 17 17 20 14 20 11 C 18 12 16 12.5 15 13" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M12 18 C 10 14 10 10 12 6 C 14 10 14 14 12 18 Z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M12 18 C 8.5 16 7 12 8 8 C 10.5 11 11.5 14 12 18 Z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M12 18 C 15.5 16 17 12 16 8 C 13.5 11 12.5 14 12 18 Z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
    </>,
    size,
  );

export const HandsIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Path d="M9 6 L9 14 L7 18" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 6 L15 14 L17 18" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 14 C 10 13 11 12 12 12 C 13 12 14 13 15 14" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M8 18 L16 18" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </>,
    size,
  );

export const ShrineIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Path d="M6 19 L6 9 C 6 6 9 4 12 4 C 15 4 18 6 18 9 L18 19" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Rect x={9} y={11} width={6} height={8} stroke={color} strokeWidth={sw} />
      <Circle cx={12} cy={14} r={1.2} stroke={color} strokeWidth={sw} />
      <Path d="M4 19 L20 19" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </>,
    size,
  );

export const ArchBellIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Path d="M5 19 L5 9 C 5 6 8 4 12 4 C 16 4 19 6 19 9 L19 19" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M12 6 L12 9" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M10 12 C 10 10.5 10.9 9.5 12 9.5 C 13.1 9.5 14 10.5 14 12 L14 14 L10 14 Z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <Circle cx={12} cy={15.5} r={0.6} fill={color} />
      <Path d="M3 19 L21 19" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </>,
    size,
  );

export const SunriseIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Path d="M4 17 L20 17" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M4 20 L20 20" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M6 14 A 6 6 0 0 1 18 14" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M12 5 L12 7" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M5 9 L6 10" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M19 9 L18 10" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </>,
    size,
  );

export const DiyaIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Path d="M12 4 C 11 6 11 8 12 10 C 13 8 13 6 12 4 Z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M5 14 C 7 17 17 17 19 14 L17 18 C 14 19 10 19 7 18 Z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M9 13.5 L15 13.5" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </>,
    size,
  );

export const FlowerIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Circle cx={12} cy={12} r={1.6} stroke={color} strokeWidth={sw} />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        const x = 12 + Math.cos(a) * 5.2;
        const y = 12 + Math.sin(a) * 5.2;
        return (
          <Circle key={i} cx={x} cy={y} r={2.4} stroke={color} strokeWidth={sw} />
        );
      })}
    </>,
    size,
  );

export const BellIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Path
        d="M8 17 C 8 12 8.5 8 12 7 C 15.5 8 16 12 16 17 Z"
        stroke={color}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <Path d="M11 7 L11 5 L13 5 L13 7" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M10.5 17 C 11 18.5 13 18.5 13.5 17" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M6 17 L18 17" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </>,
    size,
  );

export const StreakIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Rect x={4} y={6} width={16} height={14} rx={1.5} stroke={color} strokeWidth={sw} />
      <Path d="M8 4 L8 7 M16 4 L16 7" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M4 10 L20 10" stroke={color} strokeWidth={sw} />
      <Path
        d="M12 12 C 11 13.5 11 15 12 17 C 13.5 16 14 14.5 13 13 Z"
        stroke={color}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
    </>,
    size,
  );

export const ChartUpIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Path d="M4 20 L20 20" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Rect x={6} y={14} width={3} height={6} stroke={color} strokeWidth={sw} />
      <Rect x={10.5} y={10} width={3} height={10} stroke={color} strokeWidth={sw} />
      <Rect x={15} y={6} width={3} height={14} stroke={color} strokeWidth={sw} />
      <Path d="M5 6 L17 6 L15 4 M17 6 L15 8" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>,
    size,
  );

export const JournalIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Rect x={5} y={4} width={12} height={16} rx={1} stroke={color} strokeWidth={sw} />
      <Path d="M8 4 L8 20" stroke={color} strokeWidth={sw} />
      <Path d="M11 9 L15 9 M11 12 L15 12 M11 15 L14 15" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M17 8 L20 11 L18 13 L15 10 Z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
    </>,
    size,
  );

export const TrophyIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Path
        d="M8 5 L16 5 L15 12 C 14 13.5 10 13.5 9 12 Z"
        stroke={color}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <Path d="M8 7 C 6 7 5 8 5 9.5 C 5 11 6.5 12 8.5 12" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M16 7 C 18 7 19 8 19 9.5 C 19 11 17.5 12 15.5 12" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M12 13.5 L12 17 M9 17 L15 17 L14.5 19 L9.5 19 Z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
    </>,
    size,
  );

export const CalendarIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Rect x={4} y={6} width={16} height={14} rx={1.5} stroke={color} strokeWidth={sw} />
      <Path d="M8 4 L8 7 M16 4 L16 7" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M4 10 L20 10" stroke={color} strokeWidth={sw} />
      <Path d="M7 13 L17 13 M7 16 L13 16" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </>,
    size,
  );

export const ClockIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Circle cx={12} cy={12} r={8} stroke={color} strokeWidth={sw} />
      <Path d="M12 7 L12 12 L15.5 14" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </>,
    size,
  );

export const StarIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <Path
      d="M12 4 L14.4 9.2 L20 10 L16 14 L17 19.5 L12 17 L7 19.5 L8 14 L4 10 L9.6 9.2 Z"
      stroke={color}
      strokeWidth={sw}
      strokeLinejoin="round"
    />,
    size,
  );

export const MalaIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x = 12 + Math.cos(a) * 6;
        const y = 12 + Math.sin(a) * 6;
        return <Circle key={i} cx={x} cy={y} r={1.05} stroke={color} strokeWidth={sw} />;
      })}
      <Circle cx={12} cy={20} r={1.5} stroke={color} strokeWidth={sw} />
      <Path d="M12 19 L12 21" stroke={color} strokeWidth={sw} />
    </>,
    size,
  );

export const CounterIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Rect x={4} y={6} width={16} height={9} rx={1.5} stroke={color} strokeWidth={sw} />
      <Rect x={7} y={9} width={3} height={3} stroke={color} strokeWidth={sw} />
      <Rect x={10.5} y={9} width={3} height={3} stroke={color} strokeWidth={sw} />
      <Rect x={14} y={9} width={3} height={3} stroke={color} strokeWidth={sw} />
      <Path d="M9 18 L12 16 L15 18" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 16 L12 21" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </>,
    size,
  );

export const HeadphonesIcon = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Path d="M4 13 C 4 8 8 5 12 5 C 16 5 20 8 20 13" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Rect x={3.5} y={13} width={4} height={6} rx={1.2} stroke={color} strokeWidth={sw} />
      <Rect x={16.5} y={13} width={4} height={6} rx={1.2} stroke={color} strokeWidth={sw} />
    </>,
    size,
  );

export const LotusDivider = ({ size, color = D }: IconProps) =>
  wrap(
    <>
      <Path d="M3 12 L9 12 M15 12 L21 12" stroke={color} strokeWidth={sw * 0.8} strokeLinecap="round" />
      <Path
        d="M12 9 C 10.5 10 10 11 10 12 C 10 13 10.8 13.5 12 13.5 C 13.2 13.5 14 13 14 12 C 14 11 13.5 10 12 9 Z"
        stroke={color}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <Path d="M9.5 12.5 L12 13.5 L14.5 12.5" stroke={color} strokeWidth={sw * 0.8} strokeLinecap="round" />
    </>,
    size,
  );
