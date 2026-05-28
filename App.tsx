import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@/navigation/RootNavigator';
import { COLORS } from './src/theme/colors';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          backgroundColor={COLORS.background}
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <View style={styles.container}>
          <RootNavigator />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  content: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: 'center',
  },
  placeholderText: {
    color: COLORS.inactive,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default App;
