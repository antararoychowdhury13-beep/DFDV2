import React from 'react';
import Svg, {
  Path,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { colors } from './theme';

export function ArrowLeftIcon({ size, color = colors.accent }: { size: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BellIcon({ size, color = colors.accent }: { size: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8a6 6 0 1 0-12 0c0 3.6-1 5.2-1.8 6.2-.5.6-.1 1.6.7 1.6h14.2c.8 0 1.2-1 .7-1.6C19 13.2 18 11.6 18 8Z"
        fill={color}
      />
      <Path
        d="M10 18a2 2 0 0 0 4 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export function PauseIcon({ size, color = colors.white }: { size: number; color?: string }) {
  const barW = size * 0.18;
  const barH = size * 0.5;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={`M${12 - barW * 1.4} ${12 - barH / 2} h${barW} v${barH} h-${barW} Z`}
        fill={color}
      />
      <Path
        d={`M${12 + barW * 0.4} ${12 - barH / 2} h${barW} v${barH} h-${barW} Z`}
        fill={color}
      />
    </Svg>
  );
}

// The glowing diya inside a pointed temple arch — the centerpiece of the
// bottom navigation bar.
export function CenterDiya({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 84 84" fill="none">
      <Defs>
        <RadialGradient id="glow" cx="42" cy="46" r="38" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={colors.goldPrimary} stopOpacity="0.45" />
          <Stop offset="0.6" stopColor={colors.goldPrimary} stopOpacity="0.15" />
          <Stop offset="1" stopColor={colors.goldPrimary} stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="arch" x1="42" y1="6" x2="42" y2="76" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={colors.goldGlow} />
          <Stop offset="1" stopColor="#f6e3c8" />
        </LinearGradient>
        <LinearGradient id="flame" x1="42" y1="34" x2="42" y2="58" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#fff3d6" />
          <Stop offset="0.5" stopColor="#f6b94a" />
          <Stop offset="1" stopColor="#e2792a" />
        </LinearGradient>
        <LinearGradient id="bowl" x1="42" y1="56" x2="42" y2="70" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={colors.goldDeep} />
          <Stop offset="1" stopColor="#a8702f" />
        </LinearGradient>
      </Defs>

      <Circle cx="42" cy="46" r="40" fill="url(#glow)" />

      {/* Pointed arch niche */}
      <Path
        d="M16 76 L16 40 Q16 12 42 7 Q68 12 68 40 L68 76 Z"
        fill="url(#arch)"
        stroke={colors.goldPrimary}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Flame */}
      <Path
        d="M42 34 C 34 44, 37 53, 42 56 C 47 53, 50 44, 42 34 Z"
        fill="url(#flame)"
      />
      <Path d="M42 42 C 38.5 47, 40 52, 42 53.5 C 44 52, 45.5 47, 42 42 Z" fill="#fff6e0" />

      {/* Diya bowl */}
      <Path d="M27 60 Q42 73 57 60 Q50 64 42 64 Q34 64 27 60 Z" fill="url(#bowl)" />
      <Ellipse cx="42" cy="60" rx="15" ry="3.4" fill={colors.goldDeep} />
    </Svg>
  );
}
