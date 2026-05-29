import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeftIcon, BellIcon } from './icons';
import IconMandir from '../assets/figma/icon-mandir.svg';
import IconSadhana from '../assets/figma/icon-sadhana.svg';
import IconSeek1 from '../assets/figma/icon-seek1.svg';
import IconSeek2 from '../assets/figma/icon-seek2.svg';

const ganeshaBg = require('../assets/figma/ganesha-bg.png') as ImageSourcePropType;
const bgHall = require('../assets/figma/puja/bg-hall.png') as ImageSourcePropType;
const navDiya = require('../assets/figma/nav-diya.png') as ImageSourcePropType;

export const C = {
  primary: '#3e2d1a',
  secondary: '#6b4c38',
  muted: '#8a6856',
  accent: '#a87647',
  goldPrimary: '#e19b46',
  goldDeep: '#cd934c',
  goldGlow: '#fdf6eb',
  goldLight: '#f9c994',
  card: '#fffcf5',
  canvas: '#fdf8f2',
  cream: '#faf0e3',
  white: '#ffffff',
};
export const SERIF = 'Georgia, "Times New Roman", serif';
export const DESIGN_W = 430;

export type NavHandlers = {
  onHome?: () => void;
  onBookmarks?: () => void;
  onCenter?: () => void;
  onStore?: () => void;
  onProfile?: () => void;
  onBack?: () => void;
  onBell?: () => void;
};

export function useScale() {
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.min(screenWidth, DESIGN_W);
  return { width, s: (n: number) => (n * width) / DESIGN_W };
}

export function ScreenTitle({
  s,
  title,
  subtitle,
  serif = true,
}: {
  s: (n: number) => number;
  title: string;
  subtitle?: string;
  serif?: boolean;
}) {
  return (
    <View style={{ alignSelf: 'center', paddingTop: s(33), alignItems: 'center', paddingHorizontal: s(24) }}>
      <Text style={{ textAlign: 'center', color: C.primary, fontWeight: '600', fontSize: s(20) }}>
        {'❖ '}
        <Text style={{ fontFamily: serif ? SERIF : undefined, fontSize: serif ? s(22) : s(20) }}>{title}</Text>
        {' ❖'}
      </Text>
      {subtitle && (
        <Text style={{ marginTop: s(4), fontSize: s(12), lineHeight: s(15), color: C.primary, textAlign: 'center' }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

export function TopButton({
  s,
  left,
  right,
  onPress,
  children,
}: {
  s: (n: number) => number;
  left?: number;
  right?: number;
  onPress?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        chromeStyles.topButton,
        {
          left: left !== undefined ? s(left) : undefined,
          right: right !== undefined ? s(right) : undefined,
          top: s(25),
          width: s(36),
          height: s(36),
          borderRadius: s(18),
        },
      ]}
    >
      <View
        style={{
          position: 'absolute',
          width: s(31.5),
          height: s(31.5),
          borderRadius: s(15.75),
          backgroundColor: C.goldGlow,
          borderWidth: Math.max(StyleSheet.hairlineWidth, s(0.5)),
          borderColor: C.goldPrimary,
        }}
      />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        {children}
      </View>
    </Pressable>
  );
}

export function TopButtons({ s, onBack, onBell }: { s: (n: number) => number; onBack?: () => void; onBell?: () => void }) {
  return (
    <>
      <TopButton s={s} left={17} onPress={onBack}>
        <ArrowLeftIcon size={s(20)} />
      </TopButton>
      <TopButton s={s} right={9} onPress={onBell}>
        <BellIcon size={s(20)} />
      </TopButton>
    </>
  );
}

function NavItem({
  s,
  Icon,
  label,
  iconSize,
}: {
  s: (n: number) => number;
  Icon: React.FC<{ width: number; height: number }>;
  label: string;
  iconSize: number;
}) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Icon width={s(iconSize)} height={s(iconSize)} />
      <Text style={{ fontSize: s(10), marginTop: s(3), color: C.accent }}>{label}</Text>
    </View>
  );
}

export function BottomNav({ s, handlers }: { s: (n: number) => number; handlers: NavHandlers }) {
  return (
    <View style={[chromeStyles.navWrap, { height: s(95), paddingBottom: s(8) }]}>
      <View style={{ width: s(405), height: s(85) }}>
        <View
          style={[
            chromeStyles.navBar,
            { top: s(25), height: s(60), borderRadius: s(19), borderWidth: Math.max(StyleSheet.hairlineWidth, s(1)) },
          ]}
        />
        <View style={[chromeStyles.navDivider, { left: s(82), top: s(31), height: s(47) }]} />
        <View style={[chromeStyles.navDivider, { left: s(320), top: s(31), height: s(47) }]} />
        <Pressable
          onPress={handlers.onHome}
          style={[chromeStyles.navSlot, { left: s(10), top: s(31), width: s(67), height: s(47) }]}
        >
          <NavItem s={s} Icon={IconMandir} label="Mandir" iconSize={28} />
        </Pressable>
        <Pressable
          onPress={handlers.onBookmarks}
          style={[chromeStyles.navSlot, { left: s(88), top: s(31), width: s(67), height: s(47) }]}
        >
          <NavItem s={s} Icon={IconSadhana} label="Sadhana" iconSize={26} />
        </Pressable>
        <Pressable
          onPress={handlers.onStore}
          style={[chromeStyles.navSlot, { left: s(248), top: s(31), width: s(67), height: s(47) }]}
        >
          <NavItem s={s} Icon={IconSeek1} label="Store" iconSize={26} />
        </Pressable>
        <Pressable
          onPress={handlers.onProfile}
          style={[chromeStyles.navSlot, { left: s(326), top: s(31), width: s(67), height: s(47) }]}
        >
          <NavItem s={s} Icon={IconSeek2} label="Profile" iconSize={26} />
        </Pressable>
        <Pressable
          onPress={handlers.onCenter}
          style={{ position: 'absolute', width: s(100), height: s(100), left: s(405 / 2 - 50), top: s(-12) }}
        >
          <Image source={navDiya} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
        </Pressable>
      </View>
    </View>
  );
}

export function SacredBackground({ s, width, image = 'hall' }: { s: (n: number) => number; width: number; image?: 'hall' | 'ganesha' }) {
  const src = image === 'ganesha' ? ganeshaBg : bgHall;
  return (
    <>
      <View style={{ position: 'absolute', top: s(-8), left: 0, width, height: s(420), overflow: 'hidden' }}>
        <Image source={src} resizeMode="cover" style={{ position: 'absolute', top: s(-100), left: 0, width, height: s(600) }} />
      </View>
      <LinearGradient
        colors={['rgba(250,240,227,0)', C.cream]}
        style={{ position: 'absolute', top: s(220), left: 0, width, height: s(220) }}
      />
    </>
  );
}

const chromeStyles = StyleSheet.create({
  topButton: {
    position: 'absolute',
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7b6848',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  navWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: C.cream,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  navBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: C.goldGlow,
    borderColor: 'rgba(225,166,70,0.36)',
    shadowColor: '#342b18',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 9,
    elevation: 5,
  },
  navDivider: { position: 'absolute', width: 1, backgroundColor: 'rgba(225,166,70,0.5)' },
  navSlot: { position: 'absolute', alignItems: 'center', justifyContent: 'flex-start' },
});
