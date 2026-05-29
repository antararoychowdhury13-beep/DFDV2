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

const bgHall = require('../assets/figma/puja/bg-hall.png') as ImageSourcePropType;
const navDiya = require('../assets/figma/nav-diya.png') as ImageSourcePropType;
const sprite = require('../assets/figma/puja/sprite.png') as ImageSourcePropType;

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

const FILTERS = ['All', 'Puja & Rituals', 'Festival', 'Sadhana', 'System'];

type Notif = {
  title: string;
  badge?: string;
  desc: string;
  time: string;
  ago: string;
  cropLeft: number;
  cropTop: number;
};

const NOTIFS: Notif[] = [
  {
    title: 'Time for Morning Puja',
    desc: 'Begin your day with devotion. Light the diya and connect with divine energy.',
    time: '7:00 AM',
    ago: '2m ago',
    cropLeft: -0.8119,
    cropTop: -3.1921,
  },
  {
    title: 'Ekadashi Reminder',
    badge: 'Calendar',
    desc: 'Today is ekadashi. Observe fast and spend the day in devotion',
    time: '7:00 AM',
    ago: '2m ago',
    cropLeft: -9.4065,
    cropTop: -10.7647,
  },
  {
    title: 'Evening Aarti',
    badge: 'Calendar',
    desc: 'Its time for Evening Aarti.Join and received blessings',
    time: '7:00 AM',
    ago: '2m ago',
    cropLeft: -5.3026,
    cropTop: -6.2456,
  },
  {
    title: 'New Quote for you',
    desc: 'Peace comes from within. Do not seek it without. You are the light',
    time: '7:00 AM',
    ago: '2m ago',
    cropLeft: -3.4391,
    cropTop: -14.8819,
  },
];

type Crop = { w: number; h: number; left: number; top: number };
const SPRITE_W = 33.6572;
const SPRITE_H = 20.3283;

function SpriteCircle({ d, left, top }: { d: number; left: number; top: number }) {
  return (
    <View
      style={{
        width: d,
        height: d,
        borderRadius: d / 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: C.goldLight,
      }}
    >
      <Image
        source={sprite}
        resizeMode="stretch"
        style={{
          position: 'absolute',
          width: d * SPRITE_W,
          height: d * SPRITE_H,
          left: d * left,
          top: d * top,
        }}
      />
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

export default function NotificationsScreen({ onBack }: { onBack?: () => void }) {
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.min(screenWidth, DESIGN_W);
  const s = (n: number) => (n * width) / DESIGN_W;
  const [activeFilter, setActiveFilter] = React.useState(0);

  return (
    <View style={[styles.root, { width, flex: 1 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(120) }}>
        {/* Background */}
        <View style={{ position: 'absolute', top: s(-8), left: 0, width, height: s(420), overflow: 'hidden' }}>
          <Image
            source={bgHall}
            resizeMode="cover"
            style={{ position: 'absolute', top: s(-100), left: 0, width, height: s(600) }}
          />
        </View>
        <LinearGradient
          colors={['rgba(250,240,227,0)', C.cream]}
          style={{ position: 'absolute', top: s(220), left: 0, width, height: s(220) }}
        />

        {/* Title */}
        <View style={{ alignSelf: 'center', paddingTop: s(33), alignItems: 'center' }}>
          <Text style={{ textAlign: 'center', color: C.primary, fontWeight: '600', fontSize: s(20) }}>
            {'❖ '}
            <Text style={{ fontFamily: SERIF, fontSize: s(22) }}>Notifications</Text>
            {' ❖'}
          </Text>
          <View style={{ width: s(80), height: s(1), backgroundColor: C.goldPrimary, marginTop: s(4) }} />
        </View>

        {/* Filter pills */}
        <View
          style={{
            marginTop: s(20),
            marginHorizontal: s(13),
            flexDirection: 'row',
            backgroundColor: C.goldGlow,
            borderRadius: s(40),
            borderWidth: 0.5,
            borderColor: C.goldPrimary,
            padding: s(4),
            gap: s(4),
          }}
        >
          {FILTERS.map((f, i) => {
            const sel = i === activeFilter;
            return (
              <Pressable
                key={f}
                onPress={() => setActiveFilter(i)}
                style={{
                  flex: 1,
                  paddingVertical: s(6),
                  borderRadius: s(36),
                  backgroundColor: sel ? C.goldPrimary : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{ fontSize: s(10), fontWeight: '500', color: sel ? C.white : C.accent }}
                >
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Notifications card */}
        <View
          style={[
            styles.card,
            { marginTop: s(16), marginHorizontal: s(13), borderRadius: s(16), paddingHorizontal: s(12), paddingTop: s(12), paddingBottom: s(16) },
          ]}
        >
          <Text style={{ fontSize: s(16), color: C.muted, marginBottom: s(8), fontWeight: '600' }}>
            <Text style={{ fontSize: s(12) }}>❖</Text> <Text style={{ fontFamily: SERIF }}>New</Text>
          </Text>

          <View style={{ gap: s(8) }}>
            {NOTIFS.map((n, i) => (
              <Pressable key={i} style={[styles.notifRow, { borderRadius: s(13), padding: s(10) }]}>
                <View style={{ marginRight: s(10) }}>
                  <SpriteCircle d={s(50)} left={n.cropLeft} top={n.cropTop} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <Text style={{ fontSize: s(12), fontWeight: '500', color: C.primary }}>{n.title}</Text>
                      {n.badge && (
                        <View
                          style={{
                            marginLeft: s(8),
                            borderWidth: 0.5,
                            borderColor: C.primary,
                            borderRadius: s(100),
                            paddingHorizontal: s(8),
                            paddingVertical: s(1),
                          }}
                        >
                          <Text style={{ fontSize: s(9), color: C.muted, fontWeight: '500' }}>{n.badge}</Text>
                        </View>
                      )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: s(9), color: C.muted }}>{n.ago}</Text>
                      <View
                        style={{
                          width: s(6),
                          height: s(6),
                          borderRadius: s(3),
                          backgroundColor: '#ef4444',
                          marginLeft: s(4),
                        }}
                      />
                    </View>
                  </View>
                  <Text style={{ fontSize: s(9), color: C.secondary, marginTop: s(2), lineHeight: s(11) }}>{n.desc}</Text>
                  <Text style={{ fontSize: s(9), color: C.accent, marginTop: s(4) }}>{n.time}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={{
              alignSelf: 'flex-start',
              marginTop: s(14),
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: C.goldGlow,
              borderWidth: 0.5,
              borderColor: C.goldDeep,
              borderRadius: s(100),
              paddingHorizontal: s(16),
              paddingVertical: s(8),
            }}
          >
            <Text style={{ fontSize: s(14), color: C.accent, fontWeight: '500' }}>Mark all as read</Text>
            <Text style={{ fontSize: s(18), color: C.accent, marginLeft: s(6) }}>›</Text>
          </Pressable>
        </View>
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
  card: {
    backgroundColor: C.card,
    shadowColor: C.goldDeep,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.27,
    shadowRadius: 10.3,
    elevation: 3,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: C.card,
    borderWidth: 0.5,
    borderColor: C.goldPrimary,
    shadowColor: '#9b7038',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
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
