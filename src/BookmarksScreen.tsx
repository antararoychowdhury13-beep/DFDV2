import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { C, SERIF, useScale, ScreenTitle, TopButtons, BottomNav, SacredBackground, NavHandlers } from './Chrome';

type Bookmark = {
  id: string;
  title: string;
  type: 'puja' | 'mantra' | 'quote' | 'reading';
  meta: string;
};

const SAMPLE: Bookmark[] = [
  { id: '1', title: 'Ganesha Chaturthi Puja', type: 'puja', meta: 'Daily · Smarta · 15 min' },
  { id: '2', title: 'Om Namah Shivaya', type: 'mantra', meta: '108 / day · 7-day streak' },
  { id: '3', title: 'When the heart is pure…', type: 'quote', meta: 'Divine Within' },
  { id: '4', title: 'Lakshmi Stotram', type: 'reading', meta: '5 min read' },
];

const TYPE_LABEL: Record<Bookmark['type'], string> = {
  puja: 'Puja',
  mantra: 'Mantra',
  quote: 'Quote',
  reading: 'Reading',
};

export default function BookmarksScreen({ handlers }: { handlers: NavHandlers }) {
  const { width, s } = useScale();
  const [items] = useState(SAMPLE);
  const isEmpty = items.length === 0;

  return (
    <View style={[styles.root, { width, flex: 1 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(120) }}>
        <SacredBackground s={s} width={width} image="hall" />
        <ScreenTitle s={s} title="Sadhana" subtitle="Your saved practices and readings" />

        <View style={{ marginTop: s(20), marginHorizontal: s(13) }}>
          {isEmpty ? (
            <View
              style={[styles.card, { borderRadius: s(16), padding: s(24), alignItems: 'center' }]}
            >
              <Text style={{ fontFamily: SERIF, fontSize: s(18), color: C.primary }}>Nothing saved yet</Text>
              <Text style={{ marginTop: s(8), fontSize: s(12), color: C.secondary, textAlign: 'center', lineHeight: s(18) }}>
                Tap the bookmark on any puja, mantra, or quote you want to return to. They'll wait here, quietly.
              </Text>
              <Pressable
                onPress={handlers.onHome}
                style={[styles.cta, { marginTop: s(20), paddingHorizontal: s(20), height: s(40), borderRadius: s(20) }]}
              >
                <Text style={{ color: C.white, fontSize: s(13), fontWeight: '500' }}>Open today's darshan</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ gap: s(10) }}>
              {items.map((b) => (
                <Pressable key={b.id} style={[styles.row, { borderRadius: s(13), padding: s(14) }]}>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        alignSelf: 'flex-start',
                        backgroundColor: C.goldGlow,
                        paddingHorizontal: s(8),
                        paddingVertical: s(2),
                        borderRadius: s(100),
                        borderWidth: 0.5,
                        borderColor: C.goldDeep,
                      }}
                    >
                      <Text style={{ fontSize: s(9), color: C.accent, fontWeight: '500' }}>{TYPE_LABEL[b.type]}</Text>
                    </View>
                    <Text style={{ marginTop: s(6), fontSize: s(14), fontWeight: '500', color: C.primary }}>{b.title}</Text>
                    <Text style={{ marginTop: s(2), fontSize: s(10), color: C.secondary }}>{b.meta}</Text>
                  </View>
                  <Text style={{ fontSize: s(20), color: C.accent }}>›</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <TopButtons s={s} onBack={handlers.onBack ?? handlers.onHome} onBell={handlers.onBell} />
      <BottomNav s={s} handlers={handlers} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: C.cream, overflow: 'hidden' },
  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.goldLight,
    shadowColor: C.goldDeep,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 0.5,
    borderColor: C.goldPrimary,
    shadowColor: '#9b7038',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
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
