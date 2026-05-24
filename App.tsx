import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MorningPujaScreen from './src/MorningPujaScreen';
import PujaGuideScreen from './src/PujaGuideScreen';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'guide'>('home');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {screen === 'home' ? (
        <MorningPujaScreen onOpenGuide={() => setScreen('guide')} />
      ) : (
        <PujaGuideScreen onBack={() => setScreen('home')} />
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
