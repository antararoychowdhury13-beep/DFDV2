import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MorningPujaScreen from './src/MorningPujaScreen';
import PujaGuideScreen from './src/PujaGuideScreen';
import GuidedPujaScreen from './src/GuidedPujaScreen';
import NotificationsScreen from './src/NotificationsScreen';
import RitualStepsScreen from './src/RitualStepsScreen';
import OnboardingScreen from './src/OnboardingScreen';
import BookmarksScreen from './src/BookmarksScreen';
import ProfileScreen from './src/ProfileScreen';
import PremiumScreen from './src/PremiumScreen';
import StoreScreen from './src/StoreScreen';
import { NavHandlers } from './src/Chrome';

type Screen =
  | 'onboarding'
  | 'home'
  | 'guide'
  | 'guided'
  | 'notifications'
  | 'ritual'
  | 'bookmarks'
  | 'profile'
  | 'premium'
  | 'store';

export default function App() {
  const [history, setHistory] = useState<Screen[]>(['onboarding']);
  const screen = history[history.length - 1];
  const push = (s: Screen) => setHistory((h) => [...h, s]);
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const replace = (s: Screen) => setHistory([s]);

  // Bottom-nav handlers wired identically across every "level-1" screen, so the
  // user can hop between Home / Bookmarks / Store / Profile and keep the center
  // diya for the Begin Puja flow.
  const navHandlers: NavHandlers = {
    onHome: () => replace('home'),
    onBookmarks: () => replace('bookmarks'),
    onCenter: () => push('guided'),
    onStore: () => replace('store'),
    onProfile: () => replace('profile'),
    onBack: back,
    onBell: () => push('notifications'),
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {screen === 'onboarding' && <OnboardingScreen onFinish={() => replace('home')} />}
      {screen === 'home' && (
        <MorningPujaScreen
          onOpenGuide={() => push('guide')}
          onBeginPuja={() => push('guided')}
          onOpenNotifications={() => push('notifications')}
          onOpenBookmarks={() => replace('bookmarks')}
          onOpenStore={() => replace('store')}
          onOpenProfile={() => replace('profile')}
        />
      )}
      {screen === 'guided' && (
        <GuidedPujaScreen onBack={back} onContinue={() => push('guide')} />
      )}
      {screen === 'guide' && <PujaGuideScreen onBack={back} onBeginPuja={() => push('ritual')} />}
      {screen === 'notifications' && <NotificationsScreen onBack={back} />}
      {screen === 'ritual' && <RitualStepsScreen onBack={back} />}
      {screen === 'bookmarks' && <BookmarksScreen handlers={navHandlers} />}
      {screen === 'profile' && (
        <ProfileScreen handlers={{ ...navHandlers, onPremium: () => push('premium') }} />
      )}
      {screen === 'premium' && <PremiumScreen handlers={navHandlers} />}
      {screen === 'store' && <StoreScreen handlers={navHandlers} />}
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
