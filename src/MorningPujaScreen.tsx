import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, DESIGN_WIDTH, DESIGN_HEIGHT } from './theme';
import { ArrowLeftIcon, BellIcon, PauseIcon } from './icons';
import IconMandir from '../assets/figma/icon-mandir.svg';
import IconSadhana from '../assets/figma/icon-sadhana.svg';
import IconSeek1 from '../assets/figma/icon-seek1.svg';
import IconSeek2 from '../assets/figma/icon-seek2.svg';
import IconFire from '../assets/figma/icon-fire.svg';

const ganeshaBg = require('../assets/figma/ganesha-bg.png') as ImageSourcePropType;
const diyaCardImg = require('../assets/figma/diya-card.jpg') as ImageSourcePropType;
const navDiya = require('../assets/figma/nav-diya.png') as ImageSourcePropType;

// Waveform bar heights (px on the 440 artboard), taken directly from Figma.
const WAVEFORM = [
  16, 30.4, 31, 32, 32, 32, 32, 27.2, 16.2, 18.2, 8.5, 4, 8.2, 5.4, 17.5, 18.5,
  20.2, 32, 32, 32, 32, 32, 25.4, 27.7, 16.7, 18.9, 9.7, 4,
];

function RoundIconButton({
  s,
  left,
  onPress,
  children,
}: {
  s: (n: number) => number;
  left: number;
  onPress?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.roundButton,
        { left: s(left), top: s(24), width: s(36), height: s(36), borderRadius: s(18) },
      ]}
    >
      <View
        style={{
          position: 'absolute',
          width: s(31.5),
          height: s(31.5),
          borderRadius: s(15.75),
          backgroundColor: colors.goldGlow,
          borderWidth: Math.max(StyleSheet.hairlineWidth, s(0.5)),
          borderColor: colors.goldPrimary,
        }}
      />
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        {children}
      </View>
    </Pressable>
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
    <View style={styles.navItem}>
      <Icon width={s(iconSize)} height={s(iconSize)} />
      <Text style={[styles.navLabel, { fontSize: s(10), marginTop: s(3) }]}>{label}</Text>
    </View>
  );
}

export default function MorningPujaScreen({
  onOpenGuide,
  onBeginPuja,
  onOpenNotifications,
  onOpenBookmarks,
  onOpenStore,
  onOpenProfile,
}: {
  onOpenGuide?: () => void;
  onBeginPuja?: () => void;
  onOpenNotifications?: () => void;
  onOpenBookmarks?: () => void;
  onOpenStore?: () => void;
  onOpenProfile?: () => void;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.min(screenWidth, DESIGN_WIDTH);
  const scale = width / DESIGN_WIDTH;
  const s = (n: number) => n * scale;

  return (
    <View style={[styles.root, { width, height: s(DESIGN_HEIGHT) }]}>
      {/* Background deity image fading into the cream page */}
      <Image
        source={ganeshaBg}
        resizeMode="cover"
        style={{ position: 'absolute', top: s(-52), left: 0, width, height: s(781.8) }}
      />
      <LinearGradient
        colors={['rgba(250,240,227,0)', colors.cream]}
        style={{ position: 'absolute', top: s(399), left: 0, width, height: s(191) }}
      />

      {/* Top buttons */}
      <RoundIconButton s={s} left={16}>
        <ArrowLeftIcon size={s(20)} />
      </RoundIconButton>
      <RoundIconButton s={s} left={384} onPress={onOpenNotifications}>
        <BellIcon size={s(20)} />
      </RoundIconButton>

      {/* Title block */}
      <View style={[styles.titleBlock, { top: s(97) }]}>
        <Text style={[styles.title, { fontSize: s(20) }]}>{'❖ Morning Puja ❖'}</Text>
        <Text style={[styles.subtitle, { fontSize: s(12), lineHeight: s(16), marginTop: s(8) }]}>
          Begin your day with devotion{'\n'}and inner peace.
        </Text>
      </View>

      {/* Card: Light the sacred Diya */}
      <View
        style={[
          styles.diyaCard,
          {
            left: s(23),
            top: s(509),
            width: s(391),
            height: s(160),
            borderRadius: s(24),
            borderWidth: s(3),
          },
        ]}
      >
        <Image
          source={diyaCardImg}
          resizeMode="cover"
          style={{ position: 'absolute', top: 0, left: 0, width: s(425), height: s(154) }}
        />
        <View style={[styles.diyaContent, { left: s(134), top: s(23), width: s(238), height: s(116) }]}>
          <View style={styles.diyaTitleRow}>
            <IconFire width={s(24)} height={s(24)} />
            <Text style={[styles.diyaTitle, { fontSize: s(19), marginLeft: s(10) }]} numberOfLines={1}>
              Light the sacred Diya
            </Text>
          </View>
          <Text style={[styles.diyaDesc, { fontSize: s(14), lineHeight: s(20) }]}>
            Offer light gratitude and peace into your day
          </Text>
          <Pressable
            onPress={onBeginPuja}
            style={[
              styles.beginButton,
              { borderRadius: s(100), paddingHorizontal: s(16), height: s(34) },
            ]}
          >
            <Text style={[styles.beginButtonText, { fontSize: s(16) }]}>Begin Puja</Text>
            <Text style={[styles.beginButtonChevron, { fontSize: s(20), marginLeft: s(6) }]}>{'›'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Card: Mantra Chanting */}
      <View
        style={[
          styles.flatCard,
          {
            left: s(21),
            top: s(681),
            width: s(401),
            height: s(94),
            borderRadius: s(13),
            borderWidth: s(2),
            paddingHorizontal: s(16),
          },
        ]}
      >
        <View style={[styles.innerBorder, { borderRadius: s(11), margin: s(2) }]} />
        {/* Count */}
        <View style={styles.mantraCount}>
          <Text style={[styles.mutedSmall, { fontSize: s(11) }]}>Mantra Chanting</Text>
          <View style={styles.numberRow}>
            <Text style={[styles.bigNumber, { fontSize: s(32) }]}>27</Text>
            <Text style={[styles.mutedSmall, { fontSize: s(14), marginLeft: s(4) }]}>/108</Text>
          </View>
          <Text style={[styles.mutedSmall, { fontSize: s(11) }]}>Chants Today</Text>
        </View>

        {/* Waveform */}
        <View style={styles.waveform}>
          {WAVEFORM.map((h, i) => (
            <View
              key={i}
              style={{
                width: s(3),
                height: s(h),
                marginHorizontal: s(1.5),
                borderRadius: s(2),
                backgroundColor: colors.goldDeep,
              }}
            />
          ))}
        </View>

        {/* Play area */}
        <View style={styles.playArea}>
          <View style={[styles.omBadge, { width: s(32), height: s(32), borderRadius: s(16) }]}>
            <Text style={[styles.omText, { fontSize: s(16) }]}>{'ॐ'}</Text>
          </View>
          <Text style={[styles.mantraName, { fontSize: s(11), width: s(64), marginHorizontal: s(8) }]}>
            Om Namah Shivaya
          </Text>
          <View style={[styles.playButton, { width: s(28), height: s(28), borderRadius: s(14) }]}>
            <PauseIcon size={s(14)} />
          </View>
        </View>
      </View>

      {/* Card: Quote */}
      <View
        style={[
          styles.flatCard,
          {
            left: s(21),
            top: s(782),
            width: s(401),
            height: s(74),
            borderRadius: s(13),
            borderWidth: s(2),
          },
        ]}
      >
        <View style={[styles.innerBorder, { borderRadius: s(11), margin: s(2) }]} />
        <Text style={[styles.quoteMark, { fontSize: s(72), left: s(10), top: s(-12) }]}>{'“'}</Text>
        <Text style={[styles.quoteText, { fontSize: s(12), lineHeight: s(15), left: s(44), top: s(14), width: s(150) }]}>
          When the heart is pure, every moment becomes worship. <Text style={{ color: colors.goldDeep }}>-Divine Within</Text>
        </Text>
        <View
          style={{
            position: 'absolute',
            right: s(3),
            top: s(3),
            bottom: s(3),
            width: s(196),
            borderRadius: s(11),
            overflow: 'hidden',
          }}
        >
          <Image
            source={diyaCardImg}
            resizeMode="cover"
            style={{ width: '100%', height: '100%', transform: [{ scaleX: -1 }, { scale: 1.35 }, { translateY: -s(4) }] }}
          />
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={[colors.goldGlow, 'rgba(253,246,235,0.5)', 'rgba(253,246,235,0)']}
            locations={[0, 0.35, 0.7]}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </View>

      {/* Bottom navigation */}
      <View style={[styles.nav, { left: s(13), top: s(857), width: s(405), height: s(85) }]}>
        <View
          style={[
            styles.navBar,
            {
              top: s(25),
              height: s(60),
              borderRadius: s(19),
              borderWidth: Math.max(StyleSheet.hairlineWidth, s(1)),
            },
          ]}
        />
        {/* Dividers */}
        <View style={[styles.navDivider, { left: s(82), top: s(31), height: s(47) }]} />
        <View style={[styles.navDivider, { left: s(320), top: s(31), height: s(47) }]} />

        {/* Left items */}
        <Pressable style={[styles.navSlot, { left: s(10), top: s(31), width: s(67), height: s(47) }]}>
          <NavItem s={s} Icon={IconMandir} label="Mandir" iconSize={28} />
        </Pressable>
        <Pressable onPress={onOpenBookmarks} style={[styles.navSlot, { left: s(88), top: s(31), width: s(67), height: s(47) }]}>
          <NavItem s={s} Icon={IconSadhana} label="Sadhana" iconSize={26} />
        </Pressable>
        {/* Right items */}
        <Pressable onPress={onOpenStore} style={[styles.navSlot, { left: s(248), top: s(31), width: s(67), height: s(47) }]}>
          <NavItem s={s} Icon={IconSeek1} label="Store" iconSize={26} />
        </Pressable>
        <Pressable onPress={onOpenProfile} style={[styles.navSlot, { left: s(326), top: s(31), width: s(67), height: s(47) }]}>
          <NavItem s={s} Icon={IconSeek2} label="Profile" iconSize={26} />
        </Pressable>

        {/* Center diya */}
        <Pressable
          onPress={onOpenGuide}
          style={[styles.centerDiya, { width: s(100), height: s(100), left: s(405 / 2 - 50), top: s(-12) }]}
        >
          <Image source={navDiya} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.cream,
    overflow: 'hidden',
  },
  roundButton: {
    position: 'absolute',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7b6848',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },
  titleBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    color: colors.accent,
    fontWeight: '300',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.secondary,
    textAlign: 'center',
  },
  diyaCard: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderColor: colors.white,
    overflow: 'hidden',
    shadowColor: '#7b6848',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  diyaContent: {
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  diyaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  diyaTitle: {
    color: colors.secondary,
    fontWeight: '500',
  },
  diyaDesc: {
    color: colors.secondary,
    textAlign: 'right',
    alignSelf: 'stretch',
  },
  beginButton: {
    backgroundColor: colors.goldDeep,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a6804d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  beginButtonText: {
    color: colors.actionText,
    fontWeight: '500',
  },
  beginButtonChevron: {
    color: colors.actionText,
  },
  flatCard: {
    position: 'absolute',
    backgroundColor: colors.goldGlow,
    borderColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#654526',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 3,
  },
  innerBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 0.5,
    borderColor: colors.goldPrimary,
  },
  mantraCount: {
    justifyContent: 'center',
  },
  mutedSmall: {
    color: colors.muted,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bigNumber: {
    color: colors.primary,
    fontWeight: '700',
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  omBadge: {
    backgroundColor: colors.goldGlow,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  omText: {
    color: colors.accent,
    fontWeight: '700',
  },
  mantraName: {
    color: colors.primary,
    fontWeight: '500',
  },
  playButton: {
    backgroundColor: colors.actionBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteMark: {
    position: 'absolute',
    color: colors.goldPrimary,
    fontWeight: '700',
  },
  quoteText: {
    position: 'absolute',
    color: colors.secondary,
  },
  nav: {
    position: 'absolute',
  },
  navBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.goldGlow,
    borderColor: 'rgba(225,166,70,0.36)',
    shadowColor: '#342b18',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 9,
    elevation: 5,
  },
  navDivider: {
    position: 'absolute',
    width: 1,
    backgroundColor: 'rgba(225,166,70,0.5)',
  },
  navSlot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    color: colors.accent,
  },
  centerDiya: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
