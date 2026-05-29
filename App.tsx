import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MorningPujaScreen from './src/MorningPujaScreen';
import PujaGuideScreen from './src/PujaGuideScreen';
import GuidedPujaScreen from './src/GuidedPujaScreen';
import NotificationsScreen from './src/NotificationsScreen';
import RitualStepsScreen from './src/RitualStepsScreen';

type Screen = 'home' | 'guide' | 'guided' | 'notifications' | 'ritual';

export default function App() {
  const [history, setHistory] = useState<Screen[]>(['home']);
  const screen = history[history.length - 1];
  const push = (s: Screen) => setHistory((h) => [...h, s]);
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {screen === 'home' && (
        <MorningPujaScreen
          onOpenGuide={() => push('guide')}
          onBeginPuja={() => push('guided')}
          onOpenNotifications={() => push('notifications')}
        />
      )}
      {screen === 'guided' && (
        <GuidedPujaScreen onBack={back} onContinue={() => push('guide')} />
      )}
      {screen === 'guide' && (
        <PujaGuideScreen onBack={back} onBeginPuja={() => push('ritual')} />
      )}
      {screen === 'notifications' && <NotificationsScreen onBack={back} />}
      {screen === 'ritual' && <RitualStepsScreen onBack={back} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf0e3',
    alignItems: 'center',
  },
});
