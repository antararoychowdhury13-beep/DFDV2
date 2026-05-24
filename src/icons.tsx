import React from 'react';
import Svg, { Path } from 'react-native-svg';
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
