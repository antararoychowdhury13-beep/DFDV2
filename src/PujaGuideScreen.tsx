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
import Flower from '../assets/figma/puja/flower.svg';
import PinNeed from '../assets/figma/puja/pin-need.svg';
import PinSetup from '../assets/figma/puja/pin-setup.svg';

const bgHall = require('../assets/figma/puja/bg-hall.png') as ImageSourcePropType;
const navDiya = require('../assets/figma/nav-diya.png') as ImageSourcePropType;
const sprite = require('../assets/figma/puja/sprite.png') as ImageSourcePropType;
const diagram = require('../assets/figma/puja/diagram.png') as ImageSourcePropType;
const shareIcon = require('../assets/figma/puja/share.png') as ImageSourcePropType;

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

// Slot labels for the "What you will need" grid (Figma node 128:6347).
const NEED_ITEMS = [
  'Diya', 'Oil/Ghee', 'Wicks', 'Water', 'Flower',
  'Ingredient', 'Ingredient', 'Ingredient', 'Ingredient', 'Ingredient',
  'Ingredient', 'Ingredient', 'Ingredient', 'Ingredient', 'Ingredient',
];

// Sprite crops (fractions of the circle diameter) taken directly from Figma.
type Crop = { w: number; h: number; left: number; top: number };
const CROP_FACE: Crop = { w: 33.6572, h: 20.3283, left: -2.1809, top: -3.1921 };
const CROP_TIME: Crop = { w: 33.6572, h: 20.3283, left: -7.5844, top: -6.2456 };
const CROP_KEEP: Crop = { w: 33.6572, h: 20.3283, left: -5.3026, top: -6.2456 };
const CROP_MISSION: Crop = { w: 31.0909, h: 18.7783, left: -29.3707, top: -10.9271 };
const CROP_TRAD: Crop = { w: 33.9178, h: 20.4857, left: -31.1795, top: -7.7521 };

function SpriteCircle({ d, crop }: { d: number; crop: Crop }) {
  return (
    <View
      style={{
        width: d,
        height: d,
        borderRadius: d / 2,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: C.goldLight,
      }}
    >
      <Image
        source={sprite}
        resizeMode="stretch"
        style={{
          position: 'absolute',
          width: d * crop.w,
          height: d * crop.h,
          left: d * crop.left,
          top: d * crop.top,
        }}
      />
    </View>
  );
}

function Pill({ s, label }: { s: (n: number) => number; label: string }) {
  return (
    <View
      style={{
        borderWidth: 0.5,
        borderColor: C.goldDeep,
        backgroundColor: C.canvas,
        borderRadius: s(100),
        paddingHorizontal: s(8),
        paddingVertical: s(2),
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ fontSize: s(12), color: C.accent, fontWeight: '500' }}>{label}</Text>
    </View>
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

export default function PujaGuideScreen({
  onBack,
  onBeginPuja,
}: {
  onBack?: () => void;
  onBeginPuja?: () => void;
}) {
  const { width: screenWidth, height } = useWindowDimensions();
  const width = Math.min(screenWidth, DESIGN_W);
  const s = (n: number) => (n * width) / DESIGN_W;

  const stepLabels = ['Select Deity', 'Puja setup', 'Ritual steps', 'Mantras', 'Aarti & closing'];
  const stepXs = [0, 65, 130, 195, 260]; // left of each 28px circle on the 288px bar

  return (
    <View style={[styles.root, { width, height }]}>
      {/* Background image (node 129:7470, image 29) framed exactly as the artifact */}
      <View style={{ position: 'absolute', top: s(-96), left: 0, width, height: s(781.8), overflow: 'hidden' }}>
        <Image
          source={bgHall}
          resizeMode="cover"
          style={{ position: 'absolute', top: s(16.7), left: 0, width, height: s(929) }}
        />
      </View>
      <LinearGradient
        colors={['rgba(250,240,227,0)', C.cream]}
        style={{ position: 'absolute', top: s(356), left: 0, width, height: s(192) }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: s(120) }}
      >
        <View style={{ width: s(414), marginLeft: s(8), marginTop: s(25), height: s(944) }}>
          {/* Title */}
          <View style={{ position: 'absolute', left: 0, top: 0, width: s(414), alignItems: 'center' }}>
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
              { left: 0, top: s(75), width: s(414), height: s(74), borderRadius: s(13) },
            ]}
          >
            <View style={{ position: 'absolute', left: s(63), top: s(12), width: s(288), height: s(28) }}>
              {/* connecting lines */}
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

          {/* Group 76 */}
          <View style={[styles.group76, { left: 0, top: s(157), width: s(414), height: s(421), borderRadius: s(16) }]}>
            {/* header */}
            <View style={{ position: 'absolute', left: s(8), top: s(9), right: s(8) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={shareIcon} style={{ width: s(24), height: s(24) }} resizeMode="contain" />
                <Text style={{ marginLeft: s(8), fontSize: s(14), color: C.primary }}>2. Puja setup</Text>
              </View>
              <Text style={{ marginLeft: s(28), marginTop: s(4), fontSize: s(9), lineHeight: s(13), color: C.primary }}>
                Prepare your space and essential before begining the puja
              </Text>
            </View>

            {/* What you will need card */}
            <View
              style={[
                styles.needCard,
                { left: s(8), top: s(48), width: s(398), height: s(284), borderRadius: s(15) },
              ]}
            >
              <View style={{ position: 'absolute', left: s(8), top: s(11), flexDirection: 'row', alignItems: 'center' }}>
                <PinNeed width={s(11)} height={s(13)} />
                <Text style={{ marginLeft: s(8), fontSize: s(14), color: C.primary }}>What you will need</Text>
              </View>
              <View
                style={{
                  position: 'absolute',
                  left: s(7),
                  top: s(41),
                  width: s(384),
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  columnGap: s(10),
                  rowGap: s(12),
                }}
              >
                {NEED_ITEMS.map((label, i) => (
                  <View key={i} style={{ width: s(68), height: s(66) }}>
                    <View style={{ position: 'absolute', left: s(14), top: 0, width: s(41), height: s(41) }}>
                      <Flower width={s(41)} height={s(41)} />
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{ position: 'absolute', top: s(43), width: s(68), textAlign: 'center', fontSize: s(12), color: '#000' }}
                    >
                      {label}
                    </Text>
                    <Text
                      style={{ position: 'absolute', top: s(58), width: s(68), textAlign: 'center', fontSize: s(10), color: C.muted }}
                    >
                      Essental
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Mission row */}
            <View
              style={[
                styles.infoRow,
                { left: s(8), top: s(345), width: s(398), height: s(68), borderRadius: s(13) },
              ]}
            >
              <View style={{ marginLeft: s(8) }}>
                <SpriteCircle d={s(33)} crop={CROP_MISSION} />
              </View>
              <View style={{ flex: 1, marginLeft: s(12) }}>
                <Text style={{ fontSize: s(12), fontWeight: '700', color: C.secondary, lineHeight: s(15) }}>
                  Mission something !
                </Text>
                <Text style={{ fontSize: s(10), color: C.secondary, lineHeight: s(13) }}>
                  Don’t worry intention and devotion are most important
                </Text>
              </View>
              <View style={{ marginRight: s(10) }}>
                <Pill s={s} label="View substitute" />
              </View>
            </View>
          </View>

          {/* Where to setup */}
          <View style={[styles.needCard, { left: 0, top: s(586), width: s(414), height: s(242), borderRadius: s(15) }]}>
            <View style={{ position: 'absolute', left: s(16), top: s(9), right: s(10) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <PinSetup width={s(11)} height={s(11)} />
                <Text style={{ marginLeft: s(8), fontSize: s(14), color: C.primary }}>Where to setup</Text>
              </View>
              <Text style={{ marginTop: s(3), fontSize: s(9), lineHeight: s(13), color: C.primary }}>
                Follow this simple layout for a sacred and harmonious setup.
              </Text>
            </View>

            {/* Diagram (masked crop of diagram.png) */}
            <View
              style={{
                position: 'absolute',
                left: s(14.67),
                top: s(51),
                width: s(242.11),
                height: s(173),
                borderRadius: s(16),
                overflow: 'hidden',
              }}
            >
              <Image
                source={diagram}
                resizeMode="stretch"
                style={{ position: 'absolute', left: s(-23), top: s(-577), width: s(472), height: s(1020) }}
              />
            </View>

            {/* Info column */}
            <View style={{ position: 'absolute', left: s(269), top: s(55), width: s(131), height: s(182) }}>
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: s(131),
                  height: s(173),
                  borderRadius: s(11),
                  borderWidth: 0.5,
                  borderColor: C.goldLight,
                  backgroundColor: C.canvas,
                }}
              />
              {[41, 88, 128].map((y) => (
                <View
                  key={y}
                  style={{
                    position: 'absolute',
                    left: s(7.38),
                    top: s(y),
                    width: s(116.24),
                    height: Math.max(StyleSheet.hairlineWidth, s(0.5)),
                    backgroundColor: C.goldLight,
                  }}
                />
              ))}
              {/* Row 1: Face Direction */}
              <View style={{ position: 'absolute', left: s(7.38), top: s(9), flexDirection: 'row', alignItems: 'center' }}>
                <SpriteCircle d={s(22.14)} crop={CROP_FACE} />
                <View style={{ marginLeft: s(5) }}>
                  <Text style={{ fontSize: s(12), fontWeight: '500', color: C.secondary, lineHeight: s(13) }}>Face Direction</Text>
                  <Text style={{ fontSize: s(9), color: C.secondary, lineHeight: s(12) }}>East or North</Text>
                </View>
              </View>
              {/* Row 2: Best time */}
              <View style={{ position: 'absolute', left: s(7.38), top: s(48), flexDirection: 'row', alignItems: 'center' }}>
                <SpriteCircle d={s(22.14)} crop={CROP_TIME} />
                <View style={{ marginLeft: s(5) }}>
                  <Text style={{ fontSize: s(12), fontWeight: '500', color: C.secondary, lineHeight: s(13) }}>Best time</Text>
                  <Text style={{ fontSize: s(9), color: C.secondary, lineHeight: s(12) }}>Bramha muhurta</Text>
                  <Text style={{ fontSize: s(9), color: C.secondary, lineHeight: s(12) }}>to sunrise or sunset</Text>
                </View>
              </View>
              {/* Row 3: Keep the space */}
              <View style={{ position: 'absolute', left: s(7.38), top: s(98), flexDirection: 'row', alignItems: 'center' }}>
                <SpriteCircle d={s(22.14)} crop={CROP_KEEP} />
                <View style={{ marginLeft: s(5) }}>
                  <Text style={{ fontSize: s(12), fontWeight: '500', color: C.secondary, lineHeight: s(13) }}>Keep the space</Text>
                  <Text style={{ fontSize: s(9), color: C.secondary, lineHeight: s(12) }}>Clean,calm ,clutterfree</Text>
                </View>
              </View>
              {/* Row 4: note */}
              <Text style={{ position: 'absolute', left: s(7.38), top: s(135), width: s(116), fontSize: s(8), color: C.secondary, lineHeight: s(10) }}>
                If your home doesn’t allow this exactly, any clean, intentional space is sacred.
              </Text>
            </View>
          </View>

          {/* Traditions & Method */}
          <View style={[styles.infoRow, { left: 0, top: s(836), width: s(414), height: s(68), borderRadius: s(13) }]}>
            <View style={{ marginLeft: s(17) }}>
              <SpriteCircle d={s(38)} crop={CROP_TRAD} />
            </View>
            <View style={{ flex: 1, marginLeft: s(10) }}>
              <Text style={{ fontSize: s(12), fontWeight: '700', color: C.secondary, lineHeight: s(15) }}>
                Traditions & Method
              </Text>
              <Text style={{ fontSize: s(11), color: C.secondary, lineHeight: s(15) }}>
                This pujs follow Smarta tradition
              </Text>
            </View>
            <View style={{ marginRight: s(10) }}>
              <Pill s={s} label="View substitute" />
            </View>
          </View>

          {/* Begin Puja button */}
          <Pressable
            onPress={onBeginPuja}
            style={[
              styles.beginButton,
              { left: 0, top: s(912), width: s(414), height: s(32), borderRadius: s(100) },
            ]}
          >
            <Text style={{ fontSize: s(14), color: C.white }}>Begin Puja</Text>
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
  group76: {
    position: 'absolute',
    backgroundColor: 'rgba(228,194,142,0.18)',
    borderWidth: 1,
    borderColor: C.white,
  },
  needCard: {
    position: 'absolute',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.goldLight,
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
  beginButton: {
    position: 'absolute',
    backgroundColor: C.goldPrimary,
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
