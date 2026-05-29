import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { C, SERIF, useScale, ScreenTitle, TopButtons, BottomNav, SacredBackground, NavHandlers } from './Chrome';

type Product = { id: string; name: string; tagline: string; price: string; emoji: string };
const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Brass Diya — small', tagline: 'Hand-finished · Moradabad', price: '₹449', emoji: '🪔' },
  { id: 'p2', name: 'Pure Ghee — 200ml', tagline: 'Cow ghee · A2 desi', price: '₹520', emoji: '🫙' },
  { id: 'p3', name: 'Sandalwood incense', tagline: 'No charcoal · slow burn', price: '₹199', emoji: '🌿' },
  { id: 'p4', name: 'Cotton wicks (pack of 50)', tagline: 'Soft, long-burning', price: '₹89', emoji: '✦' },
  { id: 'p5', name: 'Kumkum & Chandan set', tagline: 'Mysore sourced', price: '₹299', emoji: '◯' },
];

const TRUST = [
  { icon: '✓', label: 'Sourced from trusted ateliers' },
  { icon: '✓', label: 'Fair-priced · no festival markups' },
  { icon: '✓', label: 'Honest reviews · free returns 7 days' },
];

export default function StoreScreen({ handlers }: { handlers: NavHandlers }) {
  const { width, s } = useScale();

  return (
    <View style={[styles.root, { width, flex: 1 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(120) }}>
        <SacredBackground s={s} width={width} image="hall" />
        <ScreenTitle s={s} title="Store" subtitle="Devotional goods, fair-sourced" />

        {/* Trust card — appears BEFORE the catalogue, per PRD */}
        <View
          style={[
            styles.trustCard,
            { marginTop: s(18), marginHorizontal: s(13), borderRadius: s(14), padding: s(14) },
          ]}
        >
          <Text style={{ fontFamily: SERIF, fontSize: s(13), color: C.primary, marginBottom: s(8) }}>
            Why you can buy with calm
          </Text>
          {TRUST.map((t) => (
            <View key={t.label} style={{ flexDirection: 'row', alignItems: 'center', marginTop: s(4) }}>
              <Text style={{ fontSize: s(12), color: C.accent, width: s(18) }}>{t.icon}</Text>
              <Text style={{ fontSize: s(11), color: C.secondary }}>{t.label}</Text>
            </View>
          ))}
        </View>

        {/* Catalogue (light entry, per PRD F8 "Could") */}
        <Text
          style={{
            marginTop: s(20),
            marginLeft: s(16),
            fontSize: s(11),
            color: C.muted,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Essentials for today's puja
        </Text>
        <View style={{ marginTop: s(8), marginHorizontal: s(13), gap: s(10) }}>
          {PRODUCTS.map((p) => (
            <Pressable key={p.id} style={[styles.productRow, { borderRadius: s(13), padding: s(14) }]}>
              <View
                style={{
                  width: s(54),
                  height: s(54),
                  borderRadius: s(10),
                  backgroundColor: C.goldGlow,
                  borderWidth: 0.5,
                  borderColor: C.goldLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: s(26) }}>{p.emoji}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: s(12) }}>
                <Text style={{ fontSize: s(14), fontWeight: '500', color: C.primary }}>{p.name}</Text>
                <Text style={{ fontSize: s(10), color: C.secondary, marginTop: s(2) }}>{p.tagline}</Text>
                <Text style={{ fontSize: s(13), fontWeight: '700', color: C.primary, marginTop: s(4) }}>{p.price}</Text>
              </View>
              <Pressable
                style={{
                  paddingHorizontal: s(12),
                  height: s(30),
                  borderRadius: s(15),
                  backgroundColor: C.goldGlow,
                  borderWidth: 0.5,
                  borderColor: C.goldDeep,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: s(12), color: C.accent, fontWeight: '500' }}>Add</Text>
              </Pressable>
            </Pressable>
          ))}
        </View>

        <Text
          style={{
            marginTop: s(16),
            marginHorizontal: s(24),
            fontSize: s(10),
            color: C.muted,
            textAlign: 'center',
            lineHeight: s(14),
          }}
        >
          Full catalogue arrives soon. v2.0 is a light, trust-first entry — by design.
        </Text>
      </ScrollView>

      <TopButtons s={s} onBack={handlers.onBack ?? handlers.onHome} onBell={handlers.onBell} />
      <BottomNav s={s} handlers={handlers} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: C.cream, overflow: 'hidden' },
  trustCard: {
    backgroundColor: C.goldGlow,
    borderWidth: 0.5,
    borderColor: C.goldDeep,
    shadowColor: '#9b7038',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  productRow: {
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
});
