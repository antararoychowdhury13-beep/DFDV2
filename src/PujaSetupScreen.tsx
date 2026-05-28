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
import Svg, { Path, Circle } from 'react-native-svg';
import { ArrowLeftIcon, BellIcon } from './icons';
import IconMandir from '../assets/figma/icon-mandir.svg';
import IconSadhana from '../assets/figma/icon-sadhana.svg';
import IconSeek1 from '../assets/figma/icon-seek1.svg';
import IconSeek2 from '../assets/figma/icon-seek2.svg';
import StepRing from '../assets/figma/puja/step.svg';
import StepFill from '../assets/figma/puja/step5.svg';
import Flower from '../assets/figma/puja/flower.svg';

const bgHall = require('../assets/figma/puja/bg-hall.png') as ImageSourcePropType;
const navDiya = require('../assets/figma/nav-diya.png') as ImageSourcePropType;

const C = {
  primary: '#3e2d1a',
  secondary: '#6b4c38',
  muted: '#8a6856',
  accent: '#a87647',
  goldPrimary: '#e19b46',
  goldDeep: '#cd934c',
  goldGlow: '#fdf6eb',
  goldLight: '#e4c28e',
  card: '#fffcf5',
  canvas: '#fdf8f2',
  cream: '#faf0e3',
  white: '#ffffff',
};

const SERIF = 'Georgia, "Times New Roman", serif';
const DESIGN_W = 430;

type PujaTypeId = 'daily' | 'standard' | 'full';

const PUJA_TYPES: { id: PujaTypeId; title: string; subtitle: string; time: string }[] = [
  { id: 'daily', title: 'Daily Puja', subtitle: 'Short and Simple', time: '5 - 10 Mins' },
  { id: 'standard', title: 'Standard Puja', subtitle: 'Complete Ritual', time: '15 - 25 Mins' },
  { id: 'full', title: 'Full Puja', subtitle: 'Traditional & Rituals', time: '15 - 25 Mins' },
];

const INTENTIONS = [
  'Peace & Inner calm',
  'Health & Healing',
  'Prosperity & Abundance',
  'Protection & Safety',
  'Strength & Courage',
  'Family Harmony & Happiness',
  'Marriage & Relationship',
  "Children's wellbeing",
  'Remove Obstacles & Difficulties',
  'Spiritual Growth & Wishdom',
  'Gratitude & Thankfulness',
  "Ancestor's Blessing",
  'General Blessing (Sarva Mangalam)',
];

function CheckFill({ size, color = C.goldPrimary }: { size: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={11} fill={color} />
      <Path
        d="M7 12.5 L10.5 16 L17 8.5"
        stroke="#ffffff"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function EmptyCircle({ size, color = C.goldPrimary }: { size: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={11} fill="none" stroke={color} strokeWidth={1.2} />
    </Svg>
  );
}

function LotusHeaderIcon({ size, color = C.goldDeep }: { size: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5c1.4 2 1.4 5 0 7-1.4-2-1.4-5 0-7Z"
        fill={color}
      />
      <Path
        d="M5 9c2.2.4 4.4 2.2 5 4.6-2.2-.4-4.4-2.2-5-4.6Z"
        fill={color}
        opacity={0.85}
      />
      <Path
        d="M19 9c-2.2.4-4.4 2.2-5 4.6 2.2-.4 4.4-2.2 5-4.6Z"
        fill={color}
        opacity={0.85}
      />
      <Path
        d="M3 14c3 .2 6 1.8 9 4-3 .2-6.4-1.2-9-4Z"
        fill={color}
        opacity={0.7}
      />
      <Path
        d="M21 14c-3 .2-6 1.8-9 4 3 .2 6.4-1.2 9-4Z"
        fill={color}
        opacity={0.7}
      />
    </Svg>
  );
}

function HelpCircle({ size, color = C.accent }: { size: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1.4} />
      <Path
        d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1-1 1.7"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx={12} cy={17} r={0.9} fill={color} />
    </Svg>
  );
}

function ChevronRight({ size, color = C.accent }: { size: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6l6 6-6 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
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

function TopButton({
  s,
  left,
  right,
  children,
}: {
  s: (n: number) => number;
  left?: number;
  right?: number;
  children: React.ReactNode;
}) {
  return (
    <View
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
      {children}
    </View>
  );
}

export default function PujaSetupScreen({
  onBack,
  onContinue,
}: {
  onBack?: () => void;
  onContinue?: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const s = (n: number) => (n * width) / DESIGN_W;

  const [selectedType, setSelectedType] = useState<PujaTypeId>('daily');
  const [selectedIntention, setSelectedIntention] = useState<number>(0);

  const stepLabels = ['Select Deity', 'Puja setup', 'Ritual steps', 'Mantras', 'Aarti & closing'];
  const stepXs = [0, 65, 130, 195, 260];

  return (
    <View style={[styles.root, { width, height }]}>
      {/* Background image */}
      <View style={{ position: 'absolute', top: s(-8), left: 0, width, height: s(781.8), overflow: 'hidden' }}>
        <Image
          source={bgHall}
          resizeMode="cover"
          style={{ position: 'absolute', top: 0, left: 0, width, height: s(929) }}
        />
      </View>
      <LinearGradient
        colors={['rgba(250,240,227,0)', C.cream]}
        style={{ position: 'absolute', top: s(425), left: 0, width, height: s(360) }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: s(140) }}
      >
        <View style={{ width: s(430), height: s(940) }}>
          {/* Title */}
          <View style={{ position: 'absolute', left: 0, top: 0, width: s(430), alignItems: 'center', paddingTop: s(8) }}>
            <Text style={{ textAlign: 'center', color: C.primary, fontWeight: '600', fontSize: s(20) }}>
              {'❖ '}
              <Text style={{ fontFamily: SERIF, fontSize: s(24) }}>P</Text>
              <Text style={{ fontFamily: SERIF, fontSize: s(20), fontWeight: '700' }}>uja Guide</Text>
              {' ❖'}
            </Text>
            <Text style={{ marginTop: s(8), fontSize: s(12), lineHeight: s(15), color: C.primary }}>
              Step-by-step ritual for daily devotion
            </Text>
          </View>

          {/* Progress card */}
          <View
            style={[
              styles.glassCard,
              { left: 0, top: s(75), width: s(414), height: s(74), borderRadius: s(13), marginLeft: s(8) },
            ]}
          >
            <View style={{ position: 'absolute', left: s(63), top: s(12), width: s(288), height: s(48) }}>
              {[0, 1, 2, 3].map((i) => (
                <View
                  key={`l${i}`}
                  style={{
                    position: 'absolute',
                    left: s(stepXs[i] + 28),
                    top: s(14),
                    width: s(stepXs[i + 1] - stepXs[i] - 28),
                    height: Math.max(StyleSheet.hairlineWidth, s(1)),
                    backgroundColor: i < 3 ? C.goldDeep : C.goldLight,
                  }}
                />
              ))}
              {stepLabels.map((label, i) => {
                const filled = i === 4;
                return (
                  <View key={label} style={{ position: 'absolute', left: s(stepXs[i]), top: 0, width: s(28) }}>
                    <View style={{ width: s(28), height: s(28) }}>
                      {filled ? (
                        <StepFill width={s(28)} height={s(28)} />
                      ) : (
                        <StepRing width={s(28)} height={s(28)} />
                      )}
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
          </View>

          {/* Choose puja type card */}
          <View
            style={[
              styles.pujaTypeCard,
              { left: s(6), top: s(195), width: s(417), height: s(190), borderRadius: s(16) },
            ]}
          >
            <View style={{ position: 'absolute', left: s(17), top: s(15), flexDirection: 'row', alignItems: 'center' }}>
              <LotusHeaderIcon size={s(20)} />
              <Text style={{ marginLeft: s(8), fontSize: s(14), color: C.primary, fontWeight: '500' }}>
                Choose puja type
              </Text>
            </View>
            <Text style={{ position: 'absolute', left: s(43), top: s(35), fontSize: s(9), lineHeight: s(13), color: C.primary }}>
              Select the type of Puja you would like to perform
            </Text>

            <View
              style={{
                position: 'absolute',
                left: s(22),
                top: s(57),
                right: s(17),
                height: s(114),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              {PUJA_TYPES.map((t) => {
                const selected = selectedType === t.id;
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => setSelectedType(t.id)}
                    style={{
                      width: s(116),
                      height: s(114),
                      borderRadius: s(8),
                      borderWidth: 1,
                      borderColor: C.goldPrimary,
                      backgroundColor: selected ? C.goldGlow : C.card,
                    }}
                  >
                    <View
                      style={{
                        position: 'absolute',
                        left: s(116 / 2 - 28.5),
                        top: s(15),
                        width: s(57),
                        height: s(57),
                        borderRadius: s(28.5),
                        borderWidth: 1,
                        borderColor: C.goldPrimary,
                        backgroundColor: C.goldGlow,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Flower width={s(38)} height={s(38)} />
                    </View>
                    <View style={{ position: 'absolute', right: s(8), top: s(8) }}>
                      {selected ? (
                        <CheckFill size={s(15)} />
                      ) : (
                        <EmptyCircle size={s(15)} />
                      )}
                    </View>
                    <Text
                      style={{
                        position: 'absolute',
                        top: s(74),
                        left: 0,
                        width: s(116),
                        textAlign: 'center',
                        fontSize: s(13),
                        lineHeight: s(15),
                        color: C.secondary,
                      }}
                    >
                      {t.title}
                    </Text>
                    <Text
                      style={{
                        position: 'absolute',
                        top: s(90),
                        left: 0,
                        width: s(116),
                        textAlign: 'center',
                        fontSize: s(9),
                        lineHeight: s(11),
                        color: C.accent,
                      }}
                    >
                      {t.subtitle}
                    </Text>
                    <Text
                      style={{
                        position: 'absolute',
                        top: s(102),
                        left: 0,
                        width: s(116),
                        textAlign: 'center',
                        fontSize: s(9),
                        lineHeight: s(11),
                        color: C.accent,
                      }}
                    >
                      {t.time}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Set your intention card */}
          <View
            style={[
              styles.intentionCard,
              { left: s(6), top: s(396), width: s(417), height: s(315), borderRadius: s(16) },
            ]}
          >
            <View style={{ position: 'absolute', left: s(17), top: s(15), flexDirection: 'row', alignItems: 'center' }}>
              <LotusHeaderIcon size={s(20)} />
              <Text style={{ marginLeft: s(8), fontSize: s(14), color: C.primary, fontWeight: '500' }}>
                Set your intention
              </Text>
            </View>
            <Text style={{ position: 'absolute', left: s(43), top: s(35), fontSize: s(9), lineHeight: s(13), color: C.primary }}>
              What would you like to pray for today?
            </Text>

            <View
              style={{
                position: 'absolute',
                left: s(20),
                top: s(68),
                right: s(21),
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              {INTENTIONS.map((label, i) => {
                const selected = selectedIntention === i;
                return (
                  <Pressable
                    key={label}
                    onPress={() => setSelectedIntention(i)}
                    style={{
                      width: s(120),
                      height: s(40),
                      marginRight: (i % 3 === 2) ? 0 : s(8),
                      marginBottom: s(8),
                      borderRadius: s(8),
                      borderWidth: 0.5,
                      borderColor: selected ? C.goldDeep : C.goldPrimary,
                      backgroundColor: selected ? C.goldGlow : C.card,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: s(6),
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.08,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <View
                      style={{
                        width: s(24),
                        height: s(24),
                        borderRadius: s(12),
                        borderWidth: 0.5,
                        borderColor: C.goldLight,
                        backgroundColor: C.goldGlow,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Flower width={s(16)} height={s(16)} />
                    </View>
                    <Text
                      numberOfLines={2}
                      style={{
                        flex: 1,
                        marginLeft: s(6),
                        fontSize: s(9),
                        lineHeight: s(10),
                        color: C.primary,
                      }}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Info row */}
          <View
            style={[
              styles.infoRow,
              { left: s(6), top: s(722), width: s(417), height: s(49), borderRadius: s(8) },
            ]}
          >
            <View style={{ marginLeft: s(10) }}>
              <HelpCircle size={s(23)} />
            </View>
            <View style={{ flex: 1, marginLeft: s(10), justifyContent: 'center' }}>
              <Text style={{ fontSize: s(11), lineHeight: s(14), color: C.secondary }}>
                You can always change the tradition later in
              </Text>
              <Text style={{ fontSize: s(11), lineHeight: s(14), color: C.secondary }}>
                Puja Preference in My Space
              </Text>
            </View>
            <View style={{ marginRight: s(12) }}>
              <ChevronRight size={s(18)} />
            </View>
          </View>

          {/* Continue button */}
          <Pressable
            onPress={onContinue}
            style={[
              styles.continueButton,
              { left: s(6), top: s(782), width: s(417), height: s(47), borderRadius: s(12) },
            ]}
          >
            <Text style={{ fontSize: s(13), color: C.white, fontWeight: '700', lineHeight: s(16) }}>
              Continue to Rituals steps
            </Text>
            <Text style={{ fontSize: s(10), color: C.white, lineHeight: s(13), marginTop: s(2) }}>
              Everything looks perfect. Lets begin
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Top buttons (fixed) */}
      <TopButton s={s} left={17}>
        <Pressable onPress={onBack} style={StyleSheet.absoluteFill} />
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.center]}>
          <ArrowLeftIcon size={s(20)} />
        </View>
      </TopButton>
      <TopButton s={s} right={9}>
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.center]}>
          <BellIcon size={s(20)} />
        </View>
      </TopButton>

      {/* Bottom navigation (fixed) */}
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
          <View style={[styles.navSlot, { left: s(10), top: s(31), width: s(67), height: s(47) }]}>
            <NavItem s={s} Icon={IconMandir} label="Mandir" iconSize={28} />
          </View>
          <View style={[styles.navSlot, { left: s(88), top: s(31), width: s(67), height: s(47) }]}>
            <NavItem s={s} Icon={IconSadhana} label="Sadhana" iconSize={26} />
          </View>
          <View style={[styles.navSlot, { left: s(248), top: s(31), width: s(67), height: s(47) }]}>
            <NavItem s={s} Icon={IconSeek1} label="Seek" iconSize={26} />
          </View>
          <View style={[styles.navSlot, { left: s(326), top: s(31), width: s(67), height: s(47) }]}>
            <NavItem s={s} Icon={IconSeek2} label="Seek" iconSize={26} />
          </View>
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
  center: { alignItems: 'center', justifyContent: 'center' },
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
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: C.white,
    shadowColor: '#9b7038',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  pujaTypeCard: {
    position: 'absolute',
    backgroundColor: C.card,
    shadowColor: C.goldPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 7.6,
    elevation: 3,
  },
  intentionCard: {
    position: 'absolute',
    backgroundColor: C.goldGlow,
    shadowColor: C.goldPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 9.4,
    elevation: 4,
  },
  infoRow: {
    position: 'absolute',
    backgroundColor: C.goldGlow,
    borderWidth: 0.5,
    borderColor: C.goldPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#9b7038',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  continueButton: {
    position: 'absolute',
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
