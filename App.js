import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- IMPORT ASYNC STORAGE UNTUK MEMBACA MANAGEMENT SESI ASLI KELOMPOK ---
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- IMPORT GLOBAL CONTEXT DATA PROVIDER ---
import { DataProvider } from './src/context/DataContext';

// Import halaman-halaman pendukung
import GetStartedScreen from './src/screens/GetStartedScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SensorDetailScreen from './src/screens/SensorDetailScreen';
import WeatherSystemScreen from './src/screens/WeatherScreen';
import LogScreen from './src/screens/LogScreen';
import HargaScreen from './src/screens/HargaScreen';
import TengkulakScreen from './src/screens/TengkulakScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  // --- FIX AUTO-LOGIN: MEMBACA TOKEN BERDASARKAN LOGIKA DATABASE ANGGOTA 3 ---
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const sessionToken = await AsyncStorage.getItem('isLoggedIn');
        if (sessionToken === 'true') {
          setHasSession(true); // Set true agar rute otomatis melompat ke Dashboard
        } else {
          setHasSession(false);
        }
      } catch (error) {
        console.log("Gagal memvalidasi status auto-login:", error);
      } finally {
        setIsLoading(false); // Matikan splash loading screen
      }
    };

    checkUserSession();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F25C05" />
      </View>
    );
  }

  return (
    <DataProvider>
      <NavigationContainer>
        <Stack.Navigator
          // JIKA ADA SESI AKTIF -> LANGSUNG KE DASHBOARD. JIKA TIDAK -> MULAI DARI GET STARTED
          initialRouteName={hasSession ? "Dashboard" : "GetStarted"}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="SensorDetail" component={SensorDetailScreen} />
          <Stack.Screen name="Weather" component={WeatherSystemScreen} />
          <Stack.Screen name="Log" component={LogScreen} />
          <Stack.Screen name="Harga" component={HargaScreen} />
          <Stack.Screen name="Tengkulak" component={TengkulakScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});