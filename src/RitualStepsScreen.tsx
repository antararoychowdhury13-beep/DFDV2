import React, { useState } from 'react';
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
import StepRing from '../assets/figma/puja/step.svg';
import StepFill from '../assets/figma/puja/step5.svg';
import Flower from '../assets/figma/puja/flower.svg';

const ganeshaBg = require('../assets/figma/ganesha-bg.png') as ImageSourcePropType;
const navDiya = require('../assets/figma/nav-diya.png') as ImageSourcePropType;

const C = {
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
const SERIF = 'Georgia, "Times New Roman", serif';
const DESIGN_W = 430;

const STEP_LABELS = ['Select Deity', 'Puja setup', 'Ritual steps', 'Mantras', 'Aarti & closing'];
const STEP_XS = [0, 65, 130, 195, 260];

const RITUAL_STEPS = [
  { num: 2, title: 'Avahana (Invocation)', desc: 'Invite the deity to be present', time: '1 - 2 mins' },
  { num: 3, title: 'Asana & Padya', desc: 'Offer a seat and sacred water', time: '2 - 4 mins' },
  { num: 4, title: 'Snan (Abhishekam)', desc: 'Ritual bath and purification', time: '10 - 12 mins' },
  { num: 5, title: 'Alankara (Decoration)', desc: 'Offer garments, flowers and ornaments.', time: '7 - 10 mins' },
];

const NEED_ITEMS = ['Water', 'Flower', 'Akshat', 'Kumkum'];

function ProgressBar({ s, active }: { s: (n: number) => number; active: number }) {
  return (
    <View style={{ width: s(288), height: s(28) }}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={`l${i}`}
          style={{
            position: 'absolute',
            left: s(STEP_XS[i] + 28),
            top: s(14),
            width: s(STEP_XS[i + 1] - STEP_XS[i] - 28),
            height: Math.max(StyleSheet.hairlineWidth, s(1)),
            backgroundColor: i < active ? C.goldDeep : C.goldLight,
          }}
        />
      ))}
      {STEP_LABELS.map((label, i) => {
        const filled = i === active;
        return (
          <View key={label} style={{ position: 'absolute', left: s(STEP_XS[i]), top: 0, width: s(28) }}>
            <View style={{ width: s(28), height: s(28) }}>
              {filled ? <StepFill width={s(28)} height={s(28)} /> : <StepRing width={s(28)} height={s(28)} />}
              <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ fontSize: s(16), fontWeight: '500', color: filled ? C.goldGlow : C.goldDeep }}>
                  {i + 1}
                </Text>
              </View>
            </View>
            <Text
              style={{
                position: 'absolute',
                top: s(33),
                left: s(-22),
                width: s(72),
                textAlign: 'center',
                fontSize: s(8.5),
                lineHeight: s(10),
                fontWeight: '500',
                color: C.secondary,
              }}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function TopButton({
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
        styles.topButton,
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

export default function RitualStepsScreen({
  onBack,
  onStart,
}: {
  onBack?: () => void;
  onStart?: () => void;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.min(screenWidth, DESIGN_W);
  const s = (n: number) => (n * width) / DESIGN_W;
  const [chantCount] = useState(108);

  return (
    <View style={[styles.root, { width, flex: 1 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(120) }}>
        {/* Background */}
        <View style={{ position: 'absolute', top: s(-8), left: 0, width, height: s(500), overflow: 'hidden' }}>
          <Image
            source={ganeshaBg}
            resizeMode="cover"
            style={{ position: 'absolute', top: s(-150), left: 0, width, height: s(820) }}
          />
        </View>
        <LinearGradient
          colors={['rgba(250,240,227,0)', C.cream]}
          style={{ position: 'absolute', top: s(280), left: 0, width, height: s(220) }}
        />

        {/* Title */}
        <View style={{ alignSelf: 'center', paddingTop: s(33), alignItems: 'center' }}>
          <Text style={{ textAlign: 'center', color: C.primary, fontWeight: '600', fontSize: s(20) }}>
            {'❖ '}
            <Text style={{ fontFamily: SERIF, fontSize: s(24) }}>P</Text>
            <Text style={{ fontFamily: SERIF, fontSize: s(20), fontWeight: '700' }}>uja Guide</Text>
            {' ❖'}
          </Text>
          <Text style={{ marginTop: s(4), fontSize: s(12), color: C.primary }}>
            Step-by-step ritual for daily devotion
          </Text>
        </View>

        {/* Progress card */}
        <View
          style={[
            styles.glassCard,
            {
              marginTop: s(16),
              marginHorizontal: s(8),
              borderRadius: s(13),
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: s(12),
              paddingTop: s(12),
              paddingBottom: s(30),
            },
          ]}
        >
          <ProgressBar s={s} active={2} />
        </View>

        {/* Sankalpa card (expanded) */}
        <View style={[styles.card, { marginTop: s(11), marginHorizontal: s(8), borderRadius: s(15), padding: s(12) }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.stepBadge, { width: s(24), height: s(24), borderRadius: s(12) }]}>
                <Text style={{ fontSize: s(12), fontWeight: '700', color: C.white }}>1</Text>
              </View>
              <Text style={{ marginLeft: s(8), fontSize: s(13), fontWeight: '500', color: C.primary }}>Sankalpa (Intention)</Text>
            </View>
            <Text style={{ fontSize: s(9), color: C.accent }}>{'< 1 min  ›'}</Text>
          </View>
          <Text style={{ marginTop: s(8), fontSize: s(10), color: C.secondary }}>
            Make your sacred intention and invite divine presence.
          </Text>
          <View style={{ marginTop: s(10), padding: s(8), borderRadius: s(8), backgroundColor: C.goldGlow }}>
            <Text style={{ fontSize: s(10), color: C.primary, marginBottom: s(6) }}>What you need</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {NEED_ITEMS.map((item) => (
                <View key={item} style={{ alignItems: 'center' }}>
                  <Flower width={s(28)} height={s(28)} />
                  <Text style={{ fontSize: s(9), color: C.primary, marginTop: s(2) }}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Ritual step rows */}
        <View style={{ marginTop: s(11), marginHorizontal: s(8), gap: s(8) }}>
          {RITUAL_STEPS.map((step) => (
            <Pressable key={step.num} style={[styles.stepRow, { borderRadius: s(8), padding: s(12) }]}>
              <View style={[styles.stepNum, { width: s(24), height: s(24), borderRadius: s(12) }]}>
                <Text style={{ fontSize: s(12), fontWeight: '700', color: C.goldPrimary }}>{step.num}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: s(10) }}>
                <Text style={{ fontSize: s(13), fontWeight: '500', color: C.primary }}>{step.title}</Text>
                <Text style={{ fontSize: s(9), color: C.secondary, marginTop: s(2) }}>{step.desc}</Text>
              </View>
              <Text style={{ fontSize: s(9), color: C.accent }}>{step.time}  ›</Text>
            </Pressable>
          ))}
        </View>

        {/* Chant counter */}
        <View style={[styles.card, { marginTop: s(11), marginHorizontal: s(8), borderRadius: s(15), padding: s(14) }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: s(10), color: C.muted }}>Chant count</Text>
              <Text style={{ fontSize: s(36), fontWeight: '700', color: C.primary, marginTop: s(2) }}>{chantCount}</Text>
              <Text style={{ fontSize: s(10), color: C.muted }}>Mantra Japa</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: s(10), color: C.muted }}>Today's Progress</Text>
              <Text style={{ fontSize: s(28), fontWeight: '700', color: C.goldPrimary, marginTop: s(2) }}>0%</Text>
              <Text style={{ fontSize: s(10), color: C.muted }}>Steps Completed</Text>
            </View>
          </View>
          <View style={{ marginTop: s(10), alignItems: 'center' }}>
            <Text style={{ fontSize: s(11), color: C.primary }}>Om Namah Shivaya</Text>
            <View
              style={{
                marginTop: s(8),
                flexDirection: 'row',
                alignItems: 'center',
                gap: s(2),
              }}
            >
              {Array.from({ length: 30 }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: s(2),
                    height: s(4 + Math.abs(Math.sin(i * 0.5)) * 24),
                    backgroundColor: i < 15 ? C.goldDeep : C.goldLight,
                    borderRadius: s(1),
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Start step 1 button */}
        <Pressable
          onPress={onStart}
          style={[
            styles.actionButton,
            { marginTop: s(11), marginHorizontal: s(8), height: s(47), borderRadius: s(12) },
          ]}
        >
          <Text style={{ fontSize: s(14), fontWeight: '700', color: C.white }}>Start step 1</Text>
          <Text style={{ fontSize: s(9), color: C.white, marginTop: s(2) }}>Sankalpa (intention)</Text>
        </Pressable>
      </ScrollView>

      <TopButton s={s} left={17} onPress={onBack}>
        <ArrowLeftIcon size={s(20)} />
      </TopButton>
      <TopButton s={s} right={9}>
        <BellIcon size={s(20)} />
      </TopButton>

      {/* Sticky bottom nav */}
      <View style={[styles.navWrap, { height: s(95), paddingBottom: s(8) }]}>
        <View style={{ width: s(405), height: s(85) }}>
          <View
            style={[
              styles.navBar,
              { top: s(25), height: s(60), borderRadius: s(19), borderWidth: Math.max(StyleSheet.hairlineWidth, s(1)) },
            ]}
          />
          <View style={[styles.navDivider, { left: s(82), top: s(31), height: s(47) }]} />
          <View style={[styles.navDivider, { left: s(320), top: s(31), height: s(47) }]} />
          <Pressable onPress={onBack} style={[styles.navSlot, { left: s(10), top: s(31), width: s(67), height: s(47) }]}>
            <NavItem s={s} Icon={IconMandir} label="Mandir" iconSize={28} />
          </Pressable>
          <Pressable style={[styles.navSlot, { left: s(88), top: s(31), width: s(67), height: s(47) }]}>
            <NavItem s={s} Icon={IconSadhana} label="Sadhana" iconSize={26} />
          </Pressable>
          <Pressable style={[styles.navSlot, { left: s(248), top: s(31), width: s(67), height: s(47) }]}>
            <NavItem s={s} Icon={IconSeek1} label="Seek" iconSize={26} />
          </Pressable>
          <Pressable style={[styles.navSlot, { left: s(326), top: s(31), width: s(67), height: s(47) }]}>
            <NavItem s={s} Icon={IconSeek2} label="Seek" iconSize={26} />
          </Pressable>
          <Image
            source={navDiya}
            resizeMode="contain"
            style={{ position: 'absolute', width: s(100), height: s(100), left: s(405 / 2 - 50), top: s(-12) }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: C.cream, overflow: 'hidden' },
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
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: C.white,
    shadowColor: '#9b7038',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.goldLight,
    shadowColor: C.goldDeep,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.27,
    shadowRadius: 7,
    elevation: 3,
  },
  stepBadge: {
    backgroundColor: C.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    backgroundColor: C.goldGlow,
    borderWidth: 1,
    borderColor: C.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 0.5,
    borderColor: C.goldPrimary,
    shadowColor: '#9b7038',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    backgroundColor: C.goldPrimary,
    borderWidth: 1,
    borderColor: C.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a6804d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
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
