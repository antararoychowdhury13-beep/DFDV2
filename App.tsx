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
  const [screen, setScreen] = useState<Screen>('home');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {screen === 'home' && (
        <MorningPujaScreen
          onOpenGuide={() => setScreen('guide')}
          onBeginPuja={() => setScreen('guided')}
          onOpenNotifications={() => setScreen('notifications')}
        />
      )}
      {screen === 'guide' && (
        <PujaGuideScreen
          onBack={() => setScreen('home')}
          onBeginPuja={() => setScreen('ritual')}
        />
      )}
      {screen === 'guided' && (
        <GuidedPujaScreen
          onBack={() => setScreen('home')}
          onContinue={() => setScreen('ritual')}
        />
      )}
      {screen === 'notifications' && <NotificationsScreen onBack={() => setScreen('home')} />}
      {screen === 'ritual' && <RitualStepsScreen onBack={() => setScreen('home')} />}
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
