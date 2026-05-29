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
import { LinearGradient } from 'expo-linear-gradient';

const bgHall = require('../assets/figma/puja/bg-hall.png') as ImageSourcePropType;
const ganeshaBg = require('../assets/figma/ganesha-bg.png') as ImageSourcePropType;

const C = {
  primary: '#3e2d1a',
  secondary: '#6b4c38',
  muted: '#8a6856',
  accent: '#a87647',
  goldPrimary: '#e19b46',
  goldGlow: '#fdf6eb',
  card: '#fffcf5',
  cream: '#faf0e3',
  white: '#ffffff',
};
const SERIF = 'Georgia, "Times New Roman", serif';
const DESIGN_W = 430;

type Step = {
  title: string;
  body: string;
  cta: string;
  bg: ImageSourcePropType;
};
const STEPS: Step[] = [
  {
    title: 'Welcome to Antar',
    body: 'A calm, daily companion for your inner life — content, rituals, and reflection in one trustworthy place.',
    cta: 'Begin',
    bg: bgHall,
  },
  {
    title: 'A daily moment',
    body: 'Open the app each morning and arrive at today’s darshan, a guided puja, and a quiet quote.',
    cta: 'Continue',
    bg: ganeshaBg,
  },
  {
    title: 'In your language',
    body: 'English, हिंदी, ਪੰਜਾਬੀ, தமிழ், తెలుగు, मराठी and Hinglish. Sacred content is translated with care.',
    cta: 'Enter',
    bg: bgHall,
  },
];

const LANGUAGES = ['English', 'हिंदी (Hindi)', 'Hinglish', 'ਪੰਜਾਬੀ', 'தமிழ்', 'తెలుగు', 'मराठी'];

export default function OnboardingScreen({ onFinish }: { onFinish?: () => void }) {
  const { width: screenWidth, height } = useWindowDimensions();
  const width = Math.min(screenWidth, DESIGN_W);
  const s = (n: number) => (n * width) / DESIGN_W;
  const [stepIdx, setStepIdx] = useState(0);
  const [lang, setLang] = useState(0);
  const step = STEPS[stepIdx];
  const onLast = stepIdx === STEPS.length - 1;

  return (
    <View style={[styles.root, { width, height }]}>
      <Image
        source={step.bg}
        resizeMode="cover"
        style={{ position: 'absolute', top: 0, left: 0, width, height: height * 0.6 }}
      />
      <LinearGradient
        colors={['rgba(250,240,227,0)', C.cream, C.cream]}
        locations={[0, 0.7, 1]}
        style={{ position: 'absolute', top: height * 0.25, left: 0, width, height: height * 0.75 }}
      />

      {/* Step dots */}
      <View style={{ position: 'absolute', top: s(45), left: 0, width, flexDirection: 'row', justifyContent: 'center', gap: s(6) }}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === stepIdx ? s(24) : s(8),
              height: s(8),
              borderRadius: s(4),
              backgroundColor: i === stepIdx ? C.goldPrimary : 'rgba(225,155,70,0.3)',
            }}
          />
        ))}
      </View>

      {/* Content */}
      <View style={{ position: 'absolute', top: height * 0.45, left: s(24), right: s(24), alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', color: C.primary, fontFamily: SERIF, fontSize: s(28), lineHeight: s(34) }}>
          {step.title}
        </Text>
        <Text style={{ textAlign: 'center', color: C.secondary, fontSize: s(14), lineHeight: s(20), marginTop: s(14) }}>
          {step.body}
        </Text>

        {onLast && (
          <View style={{ marginTop: s(20), width: '100%', gap: s(8) }}>
            {LANGUAGES.map((label, i) => (
              <Pressable
                key={label}
                onPress={() => setLang(i)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: s(12),
                  borderRadius: s(12),
                  borderWidth: 1,
                  borderColor: i === lang ? C.goldPrimary : 'rgba(225,155,70,0.25)',
                  backgroundColor: i === lang ? C.goldGlow : C.card,
                }}
              >
                <View
                  style={{
                    width: s(18),
                    height: s(18),
                    borderRadius: s(9),
                    borderWidth: 1.5,
                    borderColor: C.goldPrimary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {i === lang && <View style={{ width: s(10), height: s(10), borderRadius: s(5), backgroundColor: C.goldPrimary }} />}
                </View>
                <Text style={{ marginLeft: s(12), fontSize: s(14), color: C.primary }}>{label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* CTA */}
      <View style={{ position: 'absolute', bottom: s(40), left: s(24), right: s(24) }}>
        <Pressable
          onPress={() => {
            if (onLast) {
              onFinish?.();
            } else {
              setStepIdx((i) => i + 1);
            }
          }}
          style={[styles.cta, { height: s(50), borderRadius: s(25) }]}
        >
          <Text style={{ color: C.white, fontSize: s(16), fontWeight: '600' }}>{step.cta}</Text>
        </Pressable>
        {stepIdx > 0 && (
          <Pressable onPress={() => setStepIdx((i) => i - 1)} style={{ marginTop: s(10), alignItems: 'center', paddingVertical: s(8) }}>
            <Text style={{ color: C.muted, fontSize: s(13) }}>Back</Text>
          </Pressable>
        )}
        {!onLast && (
          <Pressable onPress={onFinish} style={{ alignItems: 'center', paddingVertical: s(8) }}>
            <Text style={{ color: C.muted, fontSize: s(13) }}>Skip</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: C.cream, overflow: 'hidden' },
  cta: {
    backgroundColor: C.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a6804d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
});
