import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  ImageSourcePropType,
} from 'react-native';

// Each card is a complete Figma-rendered design (full-bleed image with title,
// subtitle, body, feature icons, dots all baked in). Today only two slots hold
// real Figma exports — Mandir and Divine Reminders. Replace the placeholder
// PNGs in this folder with the matching Figma exports to upgrade the rest.
const HERO_MANDIR = require('../assets/onboarding/mandir.png') as ImageSourcePropType;
const HERO_REMINDERS = require('../assets/onboarding/divine-reminders.png') as ImageSourcePropType;
const HERO_GUIDED = require('../assets/onboarding/guided-puja.png') as ImageSourcePropType;
const HERO_SADHANA = require('../assets/onboarding/sadhana-journey.png') as ImageSourcePropType;
const HERO_PANCHANG = require('../assets/onboarding/panchang.png') as ImageSourcePropType;
const HERO_MANTRA = require('../assets/onboarding/mantra-mala.png') as ImageSourcePropType;

const CARDS: { key: string; src: ImageSourcePropType; aria: string }[] = [
  { key: 'mandir', src: HERO_MANDIR, aria: 'Mandir — Your personal digital temple' },
  { key: 'reminders', src: HERO_REMINDERS, aria: 'Divine Reminders — Gentle spiritual nudges' },
  { key: 'guided', src: HERO_GUIDED, aria: 'Guided Puja — Step-by-step rituals' },
  { key: 'sadhana', src: HERO_SADHANA, aria: 'Sadhana Journey — Build a daily spiritual habit' },
  { key: 'panchang', src: HERO_PANCHANG, aria: 'Today’s Panchang, Festival & Muhurat' },
  { key: 'mantra', src: HERO_MANTRA, aria: 'Mantra & Jap Mala — Chant with focus and presence' },
];

// Figma palette + token notes (node 203:5674)
const C = {
  bg: '#fbf5ef', // ivory background behind the card
  goldDeep: '#cd934c', // Next button fill
  goldGlow: '#fdf6eb', // Skip button fill
  accent: '#a87647', // Skip text colour
  white: '#ffffff',
};
const DESIGN_W = 440;

export default function OnboardingScreen({ onFinish }: { onFinish?: () => void }) {
  const { width: screenWidth, height } = useWindowDimensions();
  const width = Math.min(screenWidth, DESIGN_W);
  const s = (n: number) => (n * width) / DESIGN_W;
  const [step, setStep] = useState(0);
  const prev = (step + CARDS.length - 1) % CARDS.length;
  const next = (step + 1) % CARDS.length;
  const onLast = step === CARDS.length - 1;

  // Scale the vertical Figma positions to the actual viewport height — keeps
  // the card visually proportional on devices with different aspect ratios.
  const verticalScale = Math.min(1, height / 956);
  const yCard = s(158) * verticalScale;
  const cardHeight = s(640) * verticalScale;
  const yButton = height - s(48) * verticalScale; // bottom inset

  return (
    <View style={[styles.root, { width, height, backgroundColor: C.bg }]}>
      {/* Previous card peek — Figma x = -306 on a 440-wide canvas */}
      <Pressable
        onPress={() => setStep(prev)}
        style={{
          position: 'absolute',
          left: s(-306),
          top: yCard,
          width: s(340),
          height: cardHeight,
          borderRadius: s(32),
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        <Image source={CARDS[prev].src} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
      </Pressable>

      {/* Next card peek — Figma x = 406 */}
      <Pressable
        onPress={() => setStep(next)}
        style={{
          position: 'absolute',
          left: s(406),
          top: yCard,
          width: s(340),
          height: cardHeight,
          borderRadius: s(32),
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        <Image source={CARDS[next].src} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
      </Pressable>

      {/* Current card centred — Figma x = 50, y = 158, 340 × 640 */}
      <View
        accessibilityLabel={CARDS[step].aria}
        style={{
          position: 'absolute',
          left: s(50),
          top: yCard,
          width: s(340),
          height: cardHeight,
          borderRadius: s(32),
          overflow: 'hidden',
          backgroundColor: '#fff',
          // soft sandstone shadow per spec
          shadowColor: '#3B2A1E',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 18,
          elevation: 6,
        }}
      >
        <Image source={CARDS[step].src} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
      </View>

      {/* Skip — bottom left, 79×32, gold-glow pill with gold-deep border */}
      <Pressable
        onPress={onFinish}
        style={{
          position: 'absolute',
          left: s(16),
          top: yButton - s(32),
          width: s(79),
          height: s(32),
          borderRadius: s(100),
          borderWidth: 0.5,
          borderColor: C.goldDeep,
          backgroundColor: C.goldGlow,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#a6804d',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <Text style={{ color: C.accent, fontSize: s(16), fontWeight: '500' }}>Skip</Text>
        <Text style={{ color: C.accent, fontSize: s(20), marginLeft: s(4) }}>›</Text>
      </Pressable>

      {/* Next — bottom right, 79×32, gold-deep fill, white text */}
      <Pressable
        onPress={() => (onLast ? onFinish?.() : setStep((i) => i + 1))}
        style={{
          position: 'absolute',
          left: s(345),
          top: yButton - s(32),
          width: s(79),
          height: s(32),
          borderRadius: s(100),
          backgroundColor: C.goldDeep,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#a6804d',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <Text style={{ color: C.white, fontSize: s(16), fontWeight: '500' }}>
          {onLast ? 'Enter' : 'Next'}
        </Text>
        <Text style={{ color: C.white, fontSize: s(20), marginLeft: s(4) }}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { overflow: 'hidden', alignSelf: 'center' },
});
