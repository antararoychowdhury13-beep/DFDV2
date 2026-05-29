import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch, StyleSheet } from 'react-native';
import { C, SERIF, useScale, ScreenTitle, TopButtons, BottomNav, SacredBackground, NavHandlers } from './Chrome';

type Row =
  | { kind: 'value'; label: string; value: string; onPress?: () => void }
  | { kind: 'toggle'; label: string; value: boolean; onChange: (v: boolean) => void }
  | { kind: 'link'; label: string; onPress?: () => void; danger?: boolean };

function Section({ s, title, rows }: { s: (n: number) => number; title: string; rows: Row[] }) {
  return (
    <View style={{ marginTop: s(18) }}>
      <Text
        style={{
          fontSize: s(11),
          color: C.muted,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: s(8),
          marginLeft: s(4),
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: C.card,
          borderRadius: s(14),
          borderWidth: 1,
          borderColor: C.goldLight,
          overflow: 'hidden',
        }}
      >
        {rows.map((row, i) => (
          <View key={i}>
            {i > 0 && <View style={{ height: 0.5, backgroundColor: 'rgba(225,155,70,0.2)', marginLeft: s(16) }} />}
            <Pressable
              onPress={row.kind === 'toggle' ? undefined : (row as any).onPress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: s(12),
                paddingHorizontal: s(16),
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: s(14),
                  color: row.kind === 'link' && (row as any).danger ? '#c33' : C.primary,
                }}
              >
                {row.label}
              </Text>
              {row.kind === 'value' && (
                <>
                  <Text style={{ fontSize: s(13), color: C.secondary }}>{row.value}</Text>
                  <Text style={{ marginLeft: s(6), fontSize: s(16), color: C.accent }}>›</Text>
                </>
              )}
              {row.kind === 'toggle' && (
                <Switch
                  value={row.value}
                  onValueChange={row.onChange}
                  trackColor={{ false: '#ccc', true: C.goldPrimary }}
                  thumbColor={C.white}
                />
              )}
              {row.kind === 'link' && <Text style={{ fontSize: s(16), color: C.accent }}>›</Text>}
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ProfileScreen({ handlers }: { handlers: NavHandlers & { onPremium?: () => void } }) {
  const { width, s } = useScale();
  const [reminders, setReminders] = useState(true);
  const [quietHours, setQuietHours] = useState(false);

  return (
    <View style={[styles.root, { width, flex: 1 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(120) }}>
        <SacredBackground s={s} width={width} image="ganesha" />
        <ScreenTitle s={s} title="My Space" subtitle="Your preferences and account" />

        {/* User card */}
        <View
          style={[
            styles.userCard,
            { marginTop: s(18), marginHorizontal: s(13), borderRadius: s(16), padding: s(16) },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: s(54),
                height: s(54),
                borderRadius: s(27),
                backgroundColor: C.goldGlow,
                borderWidth: 1,
                borderColor: C.goldPrimary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: SERIF, fontSize: s(22), color: C.accent }}>ॐ</Text>
            </View>
            <View style={{ marginLeft: s(14), flex: 1 }}>
              <Text style={{ fontSize: s(16), color: C.primary, fontWeight: '500' }}>Devotee</Text>
              <Text style={{ fontSize: s(11), color: C.secondary, marginTop: s(2) }}>+91 ••••• ••••• · Free plan</Text>
            </View>
          </View>
          <Pressable
            onPress={handlers.onPremium}
            style={{
              marginTop: s(14),
              padding: s(12),
              borderRadius: s(12),
              backgroundColor: C.goldGlow,
              borderWidth: 0.5,
              borderColor: C.goldDeep,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontFamily: SERIF, fontSize: s(18), color: C.accent }}>✦</Text>
            <View style={{ flex: 1, marginLeft: s(10) }}>
              <Text style={{ fontSize: s(13), fontWeight: '600', color: C.primary }}>Go Premium</Text>
              <Text style={{ fontSize: s(10), color: C.secondary, marginTop: s(1) }}>
                Deeper readings, guided audio, ad-free. A door, not a wall.
              </Text>
            </View>
            <Text style={{ fontSize: s(18), color: C.accent }}>›</Text>
          </Pressable>
        </View>

        <View style={{ marginHorizontal: s(13) }}>
          <Section
            s={s}
            title="Puja preference"
            rows={[
              { kind: 'value', label: 'Default deity', value: 'Lord Ganesha' },
              { kind: 'value', label: 'Tradition', value: 'Smarta' },
              { kind: 'value', label: 'Default puja type', value: 'Daily Puja' },
            ]}
          />
          <Section
            s={s}
            title="Reminders & nudges"
            rows={[
              { kind: 'toggle', label: 'Daily reminders', value: reminders, onChange: setReminders },
              { kind: 'value', label: 'Morning reminder', value: '6:30 AM' },
              { kind: 'value', label: 'Evening aarti', value: '7:00 PM' },
              { kind: 'toggle', label: 'Quiet hours (9 PM – 6 AM)', value: quietHours, onChange: setQuietHours },
            ]}
          />
          <Section
            s={s}
            title="Language & content"
            rows={[
              { kind: 'value', label: 'Language', value: 'English' },
              { kind: 'value', label: 'Sacred text translations', value: 'Human-checked' },
            ]}
          />
          <Section
            s={s}
            title="Account"
            rows={[
              { kind: 'link', label: 'Privacy policy' },
              { kind: 'link', label: 'Terms of use' },
              { kind: 'link', label: 'Sign out', danger: true },
            ]}
          />
        </View>
      </ScrollView>

      <TopButtons s={s} onBack={handlers.onBack ?? handlers.onHome} onBell={handlers.onBell} />
      <BottomNav s={s} handlers={handlers} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: C.cream, overflow: 'hidden' },
  userCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.goldLight,
    shadowColor: C.goldDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
});
