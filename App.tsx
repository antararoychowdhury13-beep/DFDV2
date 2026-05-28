import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MorningPujaScreen from './src/MorningPujaScreen';
import PujaSetupScreen from './src/PujaSetupScreen';
import PujaGuideScreen from './src/PujaGuideScreen';

type Screen = 'home' | 'setup' | 'guide';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {screen === 'home' && (
        <MorningPujaScreen onOpenGuide={() => setScreen('setup')} />
      )}
      {screen === 'setup' && (
        <PujaSetupScreen
          onBack={() => setScreen('home')}
          onContinue={() => setScreen('guide')}
        />
      )}
      {screen === 'guide' && (
        <PujaGuideScreen onBack={() => setScreen('setup')} />
      )}
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
