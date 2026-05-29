import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { C, SERIF, useScale, ScreenTitle, TopButtons, BottomNav, SacredBackground, NavHandlers } from './Chrome';

const BENEFITS = [
  { icon: '✦', title: 'Deeper readings', body: 'Full granthas, commentaries, and curated reading paths.' },
  { icon: '♫', title: 'Guided audio', body: 'Recorded mantras and aartis in clear, sacred voices.' },
  { icon: '☼', title: 'Personalised daily', body: 'Today’s darshan adapts to your deity, tradition, and intentions.' },
  { icon: '◌', title: 'Ad-free, ever', body: 'No banners, no marketing pings. Calm by design.' },
];

type Plan = { id: 'monthly' | 'yearly' | 'lifetime'; title: string; price: string; per: string; note?: string };
const PLANS: Plan[] = [
  { id: 'monthly', title: 'Monthly', price: '₹149', per: '/month' },
  { id: 'yearly', title: 'Yearly', price: '₹999', per: '/year', note: 'Save ~44% · most chosen' },
  { id: 'lifetime', title: 'Lifetime', price: '₹4,999', per: 'once', note: 'A one-time offering' },
];

export default function PremiumScreen({ handlers }: { handlers: NavHandlers }) {
  const { width, s } = useScale();
  const [plan, setPlan] = useState<Plan['id']>('yearly');

  return (
    <View style={[styles.root, { width, flex: 1 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(150) }}>
        <SacredBackground s={s} width={width} image="hall" />

        {/* Header */}
        <View style={{ alignSelf: 'center', paddingTop: s(50), alignItems: 'center', paddingHorizontal: s(24) }}>
          <Text style={{ fontSize: s(28), color: C.accent }}>✦</Text>
          <Text
            style={{
              fontFamily: SERIF,
              fontSize: s(28),
              color: C.primary,
              marginTop: s(8),
              textAlign: 'center',
            }}
          >
            Antar Premium
          </Text>
          <Text
            style={{
              fontSize: s(13),
              color: C.secondary,
              textAlign: 'center',
              lineHeight: s(20),
              marginTop: s(8),
            }}
          >
            Deeper readings, guided audio, and a quietly personalised day.{'\n'}A door, not a wall.
          </Text>
        </View>

        {/* Benefits */}
        <View style={{ marginTop: s(22), marginHorizontal: s(13), gap: s(10) }}>
          {BENEFITS.map((b) => (
            <View key={b.title} style={[styles.benefitRow, { borderRadius: s(13), padding: s(14) }]}>
              <View
                style={{
                  width: s(36),
                  height: s(36),
                  borderRadius: s(18),
                  backgroundColor: C.goldGlow,
                  borderWidth: 0.5,
                  borderColor: C.goldDeep,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontFamily: SERIF, fontSize: s(18), color: C.accent }}>{b.icon}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: s(12) }}>
                <Text style={{ fontSize: s(13), fontWeight: '600', color: C.primary }}>{b.title}</Text>
                <Text style={{ fontSize: s(11), color: C.secondary, marginTop: s(2), lineHeight: s(15) }}>{b.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={{ marginTop: s(20), marginHorizontal: s(13), gap: s(10) }}>
          {PLANS.map((p) => {
            const sel = p.id === plan;
            return (
              <Pressable
                key={p.id}
                onPress={() => setPlan(p.id)}
                style={[
                  styles.planRow,
                  {
                    borderRadius: s(14),
                    padding: s(16),
                    borderColor: sel ? C.goldPrimary : 'rgba(225,155,70,0.3)',
                    borderWidth: sel ? 1.5 : 1,
                    backgroundColor: sel ? C.goldGlow : C.card,
                  },
                ]}
              >
                <View
                  style={{
                    width: s(20),
                    height: s(20),
                    borderRadius: s(10),
                    borderWidth: 1.5,
                    borderColor: C.goldPrimary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {sel && (
                    <View style={{ width: s(12), height: s(12), borderRadius: s(6), backgroundColor: C.goldPrimary }} />
                  )}
                </View>
                <View style={{ flex: 1, marginLeft: s(12) }}>
                  <Text style={{ fontSize: s(15), color: C.primary, fontWeight: '500' }}>{p.title}</Text>
                  {p.note && <Text style={{ fontSize: s(10), color: C.accent, marginTop: s(1) }}>{p.note}</Text>}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: s(17), fontWeight: '700', color: C.primary }}>{p.price}</Text>
                  <Text style={{ fontSize: s(10), color: C.secondary }}>{p.per}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* CTAs */}
        <View style={{ marginTop: s(22), marginHorizontal: s(13) }}>
          <Pressable style={[styles.cta, { height: s(50), borderRadius: s(25) }]}>
            <Text style={{ color: C.white, fontSize: s(15), fontWeight: '600' }}>Begin Premium</Text>
          </Pressable>
          <Pressable onPress={handlers.onBack ?? handlers.onHome} style={{ marginTop: s(10), alignItems: 'center', paddingVertical: s(10) }}>
            <Text style={{ fontSize: s(13), color: C.muted }}>Maybe later</Text>
          </Pressable>
          <Text
            style={{
              marginTop: s(8),
              textAlign: 'center',
              fontSize: s(10),
              color: C.muted,
              lineHeight: s(14),
            }}
          >
            Cancel anytime. No ads. Sacred text translations are human-checked.
          </Text>
        </View>
      </ScrollView>

      <TopButtons s={s} onBack={handlers.onBack ?? handlers.onHome} onBell={handlers.onBell} />
      <BottomNav s={s} handlers={handlers} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: C.cream, overflow: 'hidden' },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 0.5,
    borderColor: C.goldLight,
    shadowColor: C.goldDeep,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#9b7038',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  cta: {
    backgroundColor: C.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a6804d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
});
