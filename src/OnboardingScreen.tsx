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
import {
  LotusIcon,
  LotusDivider,
  HandsIcon,
  ShrineIcon,
  ArchBellIcon,
  SunriseIcon,
  DiyaIcon,
  FlowerIcon,
  BellIcon,
  StreakIcon,
  ChartUpIcon,
  JournalIcon,
  TrophyIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  MalaIcon,
  CounterIcon,
  HeadphonesIcon,
} from './OnboardingIcons';

// Hero images — these slots use placeholder marble assets today; replace the
// PNGs at assets/onboarding/*.png with your final AI-rendered cards and the
// carousel picks them up with no code change.
const HERO_01 = require('../assets/onboarding/01-mandir.png') as ImageSourcePropType;
const HERO_02 = require('../assets/onboarding/02-guided-puja.png') as ImageSourcePropType;
const HERO_03 = require('../assets/onboarding/03-sadhana-journey.png') as ImageSourcePropType;
const HERO_04 = require('../assets/onboarding/04-panchang.png') as ImageSourcePropType;
const HERO_05 = require('../assets/onboarding/05-mantra-mala.png') as ImageSourcePropType;

// Palette — Antar premium ivory-temple onboarding spec (§4)
const C = {
  bg: '#F8F4ED', // ivory
  card: '#FFF9F1', // warm cream
  marble: '#F7F2EA',
  gold: '#B8862F',
  saffron: '#D69A33',
  rosegold: '#D5A17A',
  sand: '#E8D8BF',
  title: '#3B2A1E',
  body: '#4A382A',
  taupe: '#6F5C4B',
  white: '#FFFFFF',
};
const SERIF = 'Georgia, "Times New Roman", serif';
const DESIGN_W = 430;

type Feature = { Icon: React.FC<{ size: number; color?: string }>; label: string };
type Card = {
  hero: ImageSourcePropType;
  title: string;
  subtitle: string;
  body: string;
  features: Feature[];
};

const CARDS: Card[] = [
  {
    hero: HERO_01,
    title: 'Mandir',
    subtitle: 'Your personal digital temple',
    body: 'Begin every day inside a sacred temple space with divine darshan, peaceful visuals, and spiritual grounding.',
    features: [
      { Icon: HandsIcon, label: 'Daily\ndarshan' },
      { Icon: ShrineIcon, label: 'Personalized\ndeity altar' },
      { Icon: ArchBellIcon, label: 'Temple\nambience' },
      { Icon: SunriseIcon, label: 'Morning &\nevening blessings' },
    ],
  },
  {
    hero: HERO_02,
    title: 'Guided Puja',
    subtitle: 'Step-by-step rituals made simple',
    body: 'Perform puja with calm guided flows designed for everyday devotion.',
    features: [
      { Icon: LotusIcon, label: 'Puja\nmodes' },
      { Icon: DiyaIcon, label: 'Light\ndiya' },
      { Icon: FlowerIcon, label: 'Offer\nflowers' },
      { Icon: BellIcon, label: 'Ring\nbell' },
    ],
  },
  {
    hero: HERO_03,
    title: 'Sadhana Journey',
    subtitle: 'Build a daily spiritual habit',
    body: 'Create consistency through sacred rituals and mindful spiritual practice.',
    features: [
      { Icon: StreakIcon, label: 'Daily\nstreaks' },
      { Icon: ChartUpIcon, label: 'Habit\ntracking' },
      { Icon: JournalIcon, label: 'Reflection\nprompts' },
      { Icon: LotusIcon, label: 'Guided morning\nsadhana' },
      { Icon: TrophyIcon, label: 'Spiritual\nmilestones' },
    ],
  },
  {
    hero: HERO_04,
    title: 'Today’s Panchang,\nFestival & Muhurat',
    subtitle: 'Sacred time, every day',
    body: 'Accurate daily Panchang, Hindu festivals, and auspicious timings — all in one place.',
    features: [
      { Icon: CalendarIcon, label: 'Daily\nPanchang' },
      { Icon: LotusIcon, label: 'Festivals\n& Vrats' },
      { Icon: ClockIcon, label: 'Shubh\nMuhurat' },
      { Icon: StarIcon, label: 'Personalized\nReminders' },
    ],
  },
  {
    hero: HERO_05,
    title: 'Mantra & Jap Mala',
    subtitle: 'Chant with focus and presence',
    body: 'Repeat sacred mantras with immersive chanting tools.',
    features: [
      { Icon: MalaIcon, label: '108-bead\ndigital mala' },
      { Icon: CounterIcon, label: 'Chant\ncounter' },
      { Icon: HeadphonesIcon, label: 'Audio mantra\nguide' },
      { Icon: ChartUpIcon, label: 'Progress\ntracking' },
      { Icon: CalendarIcon, label: 'Daily mantra\nrecommendations' },
    ],
  },
];

function FeatureChip({
  s,
  Icon,
  label,
}: {
  s: (n: number) => number;
  Icon: React.FC<{ size: number; color?: string }>;
  label: string;
}) {
  return (
    <View style={{ alignItems: 'center', width: s(76) }}>
      <View
        style={{
          width: s(54),
          height: s(54),
          borderRadius: s(27),
          backgroundColor: C.marble,
          borderWidth: 0.5,
          borderColor: C.sand,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#3B2A1E',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <Icon size={s(28)} />
      </View>
      <Text
        style={{
          marginTop: s(6),
          textAlign: 'center',
          fontSize: s(11),
          lineHeight: s(14),
          color: C.taupe,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function OnboardingScreen({ onFinish }: { onFinish?: () => void }) {
  const { width: screenWidth, height } = useWindowDimensions();
  const width = Math.min(screenWidth, DESIGN_W);
  const s = (n: number) => (n * width) / DESIGN_W;
  const [step, setStep] = useState(0);
  const card = CARDS[step];
  const onLast = step === CARDS.length - 1;

  return (
    <View style={[styles.root, { width, height, flexDirection: 'column' }]}>
      {/* Hero — fixed 48% of screen height, with soft rounded bottom */}
      <Image
        source={card.hero}
        resizeMode="cover"
        style={{
          width,
          height: height * 0.48,
          borderBottomLeftRadius: s(28),
          borderBottomRightRadius: s(28),
        }}
      />

      {/* Content area fills the rest, leaves room for dots + skip/next at bottom */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: s(20),
          paddingTop: s(16),
          paddingBottom: s(80),
          alignItems: 'center',
        }}
      >
        <LotusIcon size={s(22)} />

        <Text
          style={{
            marginTop: s(10),
            fontFamily: SERIF,
            fontSize: s(26),
            lineHeight: s(31),
            color: C.title,
            textAlign: 'center',
          }}
        >
          {card.title}
        </Text>

        <Text
          style={{
            marginTop: s(4),
            fontFamily: SERIF,
            fontSize: s(14),
            lineHeight: s(19),
            color: C.gold,
            textAlign: 'center',
          }}
        >
          {card.subtitle}
        </Text>

        <View style={{ marginTop: s(6) }}>
          <LotusDivider size={s(26)} />
        </View>

        <Text
          style={{
            marginTop: s(6),
            fontSize: s(12.5),
            lineHeight: s(18),
            color: C.body,
            textAlign: 'center',
            paddingHorizontal: s(8),
          }}
        >
          {card.body}
        </Text>

        <View
          style={{
            marginTop: s(14),
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            rowGap: s(10),
            columnGap: s(4),
            alignSelf: 'stretch',
          }}
        >
          {card.features.map((f, i) => (
            <FeatureChip key={i} s={s} Icon={f.Icon} label={f.label} />
          ))}
        </View>
      </View>

      {/* Pagination dots */}
      <View
        style={{
          position: 'absolute',
          bottom: s(56),
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: s(7),
        }}
      >
        {CARDS.map((_, i) => (
          <Pressable key={i} onPress={() => setStep(i)} hitSlop={6}>
            <View
              style={{
                width: i === step ? s(22) : s(8),
                height: s(8),
                borderRadius: s(4),
                backgroundColor: i === step ? C.gold : 'rgba(184,134,47,0.25)',
              }}
            />
          </Pressable>
        ))}
      </View>

      {/* Skip / Next */}
      <View
        style={{
          position: 'absolute',
          bottom: s(14),
          left: s(24),
          right: s(24),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Pressable onPress={onFinish} hitSlop={10} style={{ paddingVertical: s(8) }}>
          <Text style={{ fontSize: s(13), color: C.taupe, letterSpacing: 0.3 }}>Skip</Text>
        </Pressable>
        <Pressable
          onPress={() => (onLast ? onFinish?.() : setStep((i) => i + 1))}
          hitSlop={10}
          style={{ paddingVertical: s(8), flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ fontSize: s(13), color: C.gold, fontWeight: '600', letterSpacing: 0.3 }}>
            {onLast ? 'Enter' : 'Next'}
          </Text>
          <Text style={{ marginLeft: s(6), fontSize: s(15), color: C.gold }}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: C.bg, overflow: 'hidden' },
});
