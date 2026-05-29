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
import StepRing from '../assets/figma/puja/step.svg';
import StepFill from '../assets/figma/puja/step5.svg';
import PinDeity from '../assets/figma/guided/pin-deity.svg';
import Chevron from '../assets/figma/guided/chevron.svg';
import Chevron2 from '../assets/figma/guided/chevron2.svg';
import RadioRing from '../assets/figma/guided/radio.svg';
import CheckIcon from '../assets/figma/guided/check.svg';

const ganeshaBg = require('../assets/figma/ganesha-bg.png') as ImageSourcePropType;
const navDiya = require('../assets/figma/nav-diya.png') as ImageSourcePropType;
const headerSprite = require('../assets/figma/puja/sprite.png') as ImageSourcePropType;
const intentSprite = require('../assets/figma/guided/intentions.png') as ImageSourcePropType;
const deitySprite = require('../assets/figma/guided/deities.png') as ImageSourcePropType;

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

type Crop = { w: number; h: number; left: number; top: number };

// Generic sprite "lens" — fills a w × h box with an oversized, offset image (no clipping mask
// needed because the parent View has overflow:hidden).
function Sprite({
  source,
  W,
  H,
  crop,
  radius,
  border,
}: {
  source: ImageSourcePropType;
  W: number;
  H: number;
  crop: Crop;
  radius?: number;
  border?: { width: number; color: string };
}) {
  return (
    <View
      style={{
        width: W,
        height: H,
        borderRadius: radius,
        overflow: 'hidden',
        borderWidth: border?.width,
        borderColor: border?.color,
      }}
    >
      <Image
        source={source}
        resizeMode="stretch"
        style={{
          position: 'absolute',
          width: W * crop.w,
          height: H * crop.h,
          left: W * crop.left,
          top: H * crop.top,
        }}
      />
    </View>
  );
}

// ---- Step bar ----
const STEP_LABELS = ['Select Deity', 'Puja setup', 'Ritual steps', 'Mantras', 'Aarti & closing'];
const STEP_XS = [0, 65, 130, 195, 260];
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
            backgroundColor: i < 3 ? C.goldDeep : C.goldLight,
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

// ---- Deity rows ----
const DEITIES: { name: string; tag: string; desc: string; top: number }[] = [
  { name: 'Lord Ganesha', tag: 'Vighnaharta', desc: 'Remover of obstacles and bestower of wisdom', top: -3.3554 },
  { name: 'Lord Shiva', tag: '', desc: 'The Auspicious One - Destroyer of ego and transformer of the universe.', top: -4.4283 },
  { name: 'Goddess Lakshmi', tag: 'Goddess of Prosperity', desc: 'Bestower of wealth, abundance and wellbeing.', top: -5.5038 },
  { name: 'Lord Vishnu', tag: 'Preserver of Dharma', desc: 'Sustainer of the universe and protector of dharma.', top: -6.6118 },
  { name: 'Lord Krishna', tag: 'The Divine Beloved', desc: 'Embodiment of love, wisdom and divine play.', top: -7.6993 },
];
const DEITY_CROP_BASE = { w: 4.4857, h: 15.6646, left: -0.3238 };

// ---- Puja types ----
const PUJA_TYPES = [
  { name: 'Daily Puja', sub: 'Short and Simple', time: '5 - 10 Mins', left: -1.3182 },
  { name: 'Standard Puja', sub: 'Complete Ritual', time: '15 - 25 Mins', left: -3.5492 },
  { name: 'Full Puja', sub: 'Traditional & Rituals', time: '15 - 25 Mins', left: -5.8449 },
];
const PUJA_TYPE_CROP = { w: 8.2697, h: 17.8772, top: -8.0608 };

// ---- Intentions ----
type Intent = { lines: string[]; left: number; top: number };
const INTENTS: Intent[] = [
  { lines: ['Peace & Inner calm'], left: -1.8874, top: -24.6154 },
  { lines: ['Health & Healing'], left: -5.8198, top: -24.6154 },
  { lines: ['Prosperity & Abundance'], left: -9.7333, top: -24.6884 },
  { lines: ['Protection & Safety'], left: -1.8874, top: -26.2888 },
  { lines: ['Strength &', 'Courage'], left: -5.8096, top: -26.2888 },
  { lines: ['Family Harmony', '& Happiness'], left: -9.6969, top: -26.3063 },
  { lines: ['Marriage &', 'Relationship'], left: -13.6714, top: -26.2714 },
  { lines: ['Children’s wellbeing'], left: -1.8853, top: -27.9583 },
  { lines: ['Remove Obstacles', '& Difficulties'], left: -5.7539, top: -27.9689 },
  { lines: ['Spiritual Growth', '& Wishdom'], left: -9.7333, top: -27.9725 },
  { lines: ['Gratitude & Thankfulness'], left: -13.6659, top: -27.9501 },
  { lines: ['Ancestor’s Blessing'], left: -1.8694, top: -29.6539 },
  { lines: ['General Blessing', '(Sarva Mangalam)'], left: -6.9836, top: -29.6539 },
];
const INTENT_CROP = { w: 18.8548, h: 39.1923 };

// ---- Header / tradition sprite crops (chatgpt sprite) ----
const HEADER_CROP_20 = { w: 34.8535, h: 21.0508, left: -0.8649, top: -4.9748 };
const TRADITION_CROP_23 = { w: 50.0476, h: 30.2277, left: -18.7761, top: -25.8871 };

// ---- Top button (round) ----
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

export default function GuidedPujaScreen({ onBack }: { onBack?: () => void }) {
  const { width } = useWindowDimensions();
  const s = (n: number) => (n * width) / DESIGN_W;

  return (
    <View style={[styles.root, { width, flex: 1 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(120) }}>
        {/* Background image (node 156:3121, image 29) framed per artifact */}
        <View style={{ position: 'absolute', top: s(-8), left: 0, width, height: s(764), overflow: 'hidden' }}>
          <Image
            source={ganeshaBg}
            resizeMode="cover"
            style={{ position: 'absolute', top: s(-188.3), left: 0, width, height: s(931.4) }}
          />
        </View>
        <LinearGradient
          colors={['rgba(250,240,227,0)', C.cream]}
          style={{ position: 'absolute', top: s(593), left: 0, width, height: s(300) }}
        />

        {/* Title block */}
        <View style={{ alignSelf: 'center', paddingHorizontal: s(24), paddingTop: s(8), paddingBottom: s(8), alignItems: 'center' }}>
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

        {/* Column at left 6, top 75 */}
        <View style={{ marginLeft: s(6), width: s(417), marginTop: s(8), gap: s(11) }}>
          {/* Progress card */}
          <View style={[styles.glassCard, { width: s(417), height: s(74), borderRadius: s(13), alignItems: 'center', justifyContent: 'center' }]}>
            <View style={{ marginTop: s(0) }}>
              <ProgressBar s={s} active={0} />
            </View>
          </View>

          {/* Select Deity card (1.5 px offset right inside column) */}
          <View
            style={[
              styles.deityCard,
              { marginLeft: s(1.5), width: s(414), height: s(431), borderRadius: s(15) },
            ]}
          >
            <View style={{ position: 'absolute', left: s(15.6), top: s(8.3), flexDirection: 'row', alignItems: 'center' }}>
              <PinDeity width={s(11.5)} height={s(13)} />
              <Text style={{ marginLeft: s(7), fontSize: s(14), color: C.primary }}>Select Deity </Text>
            </View>
            <Text style={{ position: 'absolute', left: s(37.8), top: s(25.2), width: s(356), fontSize: s(9), lineHeight: s(13), color: C.primary }}>
              Choose the Deity you wish to warship today
            </Text>
            <View style={{ position: 'absolute', left: s(15), top: s(44), width: s(385), gap: s(8) }}>
              {DEITIES.map((d, i) => {
                const selected = i === 0;
                return (
                  <View
                    key={d.name}
                    style={[
                      styles.deityRow,
                      {
                        width: s(385),
                        height: s(68),
                        borderRadius: s(8),
                        borderWidth: selected ? 1 : 0,
                        borderColor: C.goldPrimary,
                      },
                    ]}
                  >
                    <View style={{ position: 'absolute', left: s(0.95), top: s(1), width: s(107), height: s(66), borderRadius: s(6), overflow: 'hidden' }}>
                      <Sprite source={deitySprite} W={s(107)} H={s(66)} crop={{ w: DEITY_CROP_BASE.w, h: DEITY_CROP_BASE.h, left: DEITY_CROP_BASE.left, top: d.top }} />
                    </View>
                    <View style={{ position: 'absolute', left: s(113.4), top: s(13) }}>
                      <Text style={{ fontSize: s(14), fontWeight: '500', color: C.primary, lineHeight: s(15) }}>{d.name}</Text>
                      <View style={{ marginTop: s(4) }}>
                        {d.tag ? (
                          <Text style={{ fontSize: s(9), color: C.primary, lineHeight: s(12) }}>{d.tag}</Text>
                        ) : null}
                        <Text style={{ fontSize: s(9), color: C.primary, lineHeight: s(12), width: s(235) }}>{d.desc}</Text>
                      </View>
                    </View>
                    <View style={{ position: 'absolute', right: s(8), top: s(22) }}>
                      <Chevron width={s(24)} height={s(24)} />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Choose puja type */}
          <View style={[styles.softCard, { width: s(417), height: s(190), borderRadius: s(16) }]}>
            {/* Header */}
            <View style={{ position: 'absolute', left: s(17), top: s(15), flexDirection: 'row', alignItems: 'center' }}>
              <Sprite source={headerSprite} W={s(20)} H={s(20)} crop={HEADER_CROP_20} radius={s(10)} />
              <Text style={{ marginLeft: s(7), fontSize: s(14), color: C.primary }}>Choose puja type</Text>
            </View>
            <Text style={{ position: 'absolute', left: s(43), top: s(35), fontSize: s(9), lineHeight: s(13), color: C.primary }}>
              Select the type of Puja you would like to perform
            </Text>
            {/* 3 cards */}
            {PUJA_TYPES.map((p, i) => {
              const selected = i === 0;
              const cardLeft = [22, 151, 280][i];
              return (
                <View
                  key={p.name}
                  style={{
                    position: 'absolute',
                    left: s(cardLeft),
                    top: s(57),
                    width: s(120),
                    height: s(114),
                    borderRadius: s(8),
                    borderWidth: 1,
                    borderColor: C.goldPrimary,
                    backgroundColor: selected ? C.goldGlow : C.card,
                  }}
                >
                  <View style={{ position: 'absolute', left: s(40), top: s(15), width: s(40), height: s(40), borderRadius: s(20), overflow: 'hidden', borderWidth: 1, borderColor: C.goldPrimary }}>
                    <Sprite source={intentSprite} W={s(40)} H={s(40)} crop={{ w: PUJA_TYPE_CROP.w, h: PUJA_TYPE_CROP.h, left: p.left, top: PUJA_TYPE_CROP.top }} />
                  </View>
                  <View style={{ position: 'absolute', right: s(4), top: s(4), width: s(15), height: s(15) }}>
                    {selected ? <CheckIcon width={s(15)} height={s(15)} /> : <RadioRing width={s(15)} height={s(15)} />}
                  </View>
                  <Text style={{ position: 'absolute', top: s(59), width: s(120), textAlign: 'center', fontSize: s(14), color: C.secondary }}>{p.name}</Text>
                  <Text style={{ position: 'absolute', top: s(79), width: s(120), textAlign: 'center', fontSize: s(10), color: C.accent }}>{p.sub}</Text>
                  <Text style={{ position: 'absolute', top: s(96), width: s(120), textAlign: 'center', fontSize: s(10), color: C.accent }}>{p.time}</Text>
                </View>
              );
            })}
          </View>

          {/* Set your intention */}
          <View style={[styles.intentCard, { width: s(417), height: s(315), borderRadius: s(16) }]}>
            <View style={{ position: 'absolute', left: s(20), top: s(20), flexDirection: 'row', alignItems: 'center' }}>
              <Sprite source={headerSprite} W={s(20)} H={s(20)} crop={HEADER_CROP_20} radius={s(10)} />
              <Text style={{ marginLeft: s(7), fontSize: s(14), color: C.primary }}>Set your intention</Text>
            </View>
            <Text style={{ position: 'absolute', left: s(46), top: s(40), fontSize: s(9), lineHeight: s(13), color: C.primary }}>
              What would you like to pray for today?
            </Text>
            {/* 3x5 grid, 13 chips */}
            <View
              style={{
                position: 'absolute',
                left: s(20),
                top: s(68),
                width: s(376),
                flexDirection: 'row',
                flexWrap: 'wrap',
                rowGap: s(8),
                columnGap: s(8),
              }}
            >
              {INTENTS.map((it, idx) => (
                <View
                  key={idx}
                  style={{
                    width: s(120),
                    height: s(40),
                    borderRadius: s(8),
                    borderWidth: 0.5,
                    borderColor: C.goldPrimary,
                    backgroundColor: C.card,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: s(5.3),
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.18,
                    shadowRadius: 3,
                    elevation: 1,
                  }}
                >
                  <View style={{ width: s(24), height: s(24), borderRadius: s(12), overflow: 'hidden', borderWidth: 0.5, borderColor: C.goldLight }}>
                    <Sprite source={intentSprite} W={s(24)} H={s(24)} crop={{ w: INTENT_CROP.w, h: INTENT_CROP.h, left: it.left, top: it.top }} />
                  </View>
                  <View style={{ marginLeft: s(4), flex: 1 }}>
                    {it.lines.map((line, j) => (
                      <Text key={j} style={{ fontSize: s(9), lineHeight: s(10), color: C.primary }}>
                        {line}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Tradition row */}
          <View style={[styles.tradRow, { width: s(417), height: s(49), borderRadius: s(8) }]}>
            <View style={{ marginLeft: s(17.5) }}>
              <Sprite source={headerSprite} W={s(23)} H={s(23)} crop={TRADITION_CROP_23} radius={s(11.5)} />
            </View>
            <View style={{ flex: 1, marginLeft: s(10) }}>
              <Text style={{ fontSize: s(12), lineHeight: s(15), color: C.secondary }}>
                You can always change the tradition later in
              </Text>
              <Text style={{ fontSize: s(12), lineHeight: s(15), color: C.secondary }}>
                Puja Preference in My Space
              </Text>
            </View>
            <View style={{ marginRight: s(13) }}>
              <Chevron2 width={s(18)} height={s(19)} />
            </View>
          </View>

          {/* Action button */}
          <Pressable
            onPress={onBack}
            style={[
              styles.actionButton,
              { width: s(417), height: s(47), borderRadius: s(12) },
            ]}
          >
            <Text style={{ fontSize: s(12), fontWeight: '700', color: C.white, textAlign: 'center', lineHeight: s(15) }}>
              Continue to Rituals steps
            </Text>
            <Text style={{ fontSize: s(9), color: C.white, textAlign: 'center', lineHeight: s(15) }}>
              Everything looks perfect. Lets begin
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Top buttons fixed */}
      <TopButton s={s} left={17} onPress={onBack}>
        <ArrowLeftIcon size={s(20)} />
      </TopButton>
      <TopButton s={s} right={9}>
        <BellIcon size={s(20)} />
      </TopButton>

      {/* Bottom nav sticky */}
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
  deityCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.goldLight,
  },
  deityRow: {
    backgroundColor: C.card,
    shadowColor: 'rgba(225,155,70,0.3)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3.7,
    elevation: 2,
  },
  softCard: {
    backgroundColor: C.card,
    shadowColor: C.goldPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 7.6,
    elevation: 3,
  },
  intentCard: {
    backgroundColor: C.goldGlow,
    shadowColor: C.goldPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 9.4,
    elevation: 3,
  },
  tradRow: {
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
