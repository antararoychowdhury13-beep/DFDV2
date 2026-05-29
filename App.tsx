import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MorningPujaScreen from './src/MorningPujaScreen';
import PujaGuideScreen from './src/PujaGuideScreen';
import GuidedPujaScreen from './src/GuidedPujaScreen';

type Screen = 'home' | 'guide' | 'guided';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {screen === 'home' && (
        <MorningPujaScreen
          onOpenGuide={() => setScreen('guide')}
          onBeginPuja={() => setScreen('guided')}
        />
      )}
      {screen === 'guide' && <PujaGuideScreen onBack={() => setScreen('home')} />}
      {screen === 'guided' && <GuidedPujaScreen onBack={() => setScreen('home')} />}
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
