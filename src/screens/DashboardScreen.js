import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, Image, Dimensions, ActivityIndicator, Switch } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- IMPORT GLOBAL CONTEXT DATA CONSUMER ---
import { DataContext } from '../context/DataContext';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('dashboard');

    // Mengonsumsi data dan fungsi terpusat dari DataContext
    const {
        sensorData,
        actuatorStatus,
        isSimulationMode,
        isAutomaticMode,
        userEmail,
        setUserEmail,
        loadingData,
        handleToggleSimulation,
        handleToggleAutomatic,
        handleToggleActuator
    } = useContext(DataContext);

    // Sinkronisasi nama akun baru setiap kali Dashboard terbuka
    useEffect(() => {
        const syncContextName = async () => {
            try {
                const storedName = await AsyncStorage.getItem('userName');
                if (storedName) {
                    setUserEmail(storedName);
                }
            } catch (error) {
                console.log("Gagal menyinkronkan nama akun baru:", error);
            }
        };
        syncContextName();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            setUserEmail('Peternak'); // Reset nama global kembali ke default saat logout
            navigation.replace('Login');
        } catch (error) {
            console.log("Gagal logout:", error);
        }
    };

    let [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold });
    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#F25C05" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeftRow}>
                    <Image source={require('../../assets/logo.png')} style={styles.headerLogo} resizeMode="contain" />
                    <View style={styles.headerTextGroup}>
                        <Text style={styles.headerBrand}>E-NDOG DASHBOARD</Text>
                        <Text style={styles.headerUser} numberOfLines={1}>Halo, {userEmail}!</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Keluar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                {/* Switch Mode Kerja Simulasi */}
                <View style={styles.simulationCard}>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.switchTitle}>Mode Simulasi Data</Text>
                        <Text style={styles.switchSubtitle}>
                            {isSimulationMode ? "Menjalankan data dummy simulasi lokal" : "Menunggu koneksi hardware ESP32"}
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#D1D1D1", true: "#FFD0B3" }}
                        thumbColor={isSimulationMode ? "#F25C05" : "#F4F3F4"}
                        onValueChange={handleToggleSimulation}
                        value={isSimulationMode}
                    />
                </View>

                {/* Switch Mode Kerja Otomatis */}
                <View style={[styles.simulationCard, { backgroundColor: '#EBF3FF' }]}>
                    <View style={styles.cardTextContainer}>
                        <Text style={[styles.switchTitle, { color: '#004B87' }]}>Mode Kerja Otomatis</Text>
                        <Text style={styles.switchSubtitle}>
                            {isAutomaticMode ? "Aktuator diatur otomatis sesuai parameter sensor" : "Mode Manual aktif, klik tombol di bawah untuk menyalakan/mematikan"}
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#D1D1D1", true: "#99C2FF" }}
                        thumbColor={isAutomaticMode ? "#0066CC" : "#F4F3F4"}
                        onValueChange={handleToggleAutomatic}
                        value={isAutomaticMode}
                    />
                </View>

                {loadingData ? (
                    <View style={styles.centerLoading}>
                        <ActivityIndicator size="small" color="#F25C05" />
                        <Text style={styles.loadingText}>Sinkronisasi Firestore...</Text>
                    </View>
                ) : (
                    <>
                        {/* Grid Sensor */}
                        <Text style={styles.sectionTitle}>Monitoring Parameter</Text>
                        <View style={styles.gridContainer}>
                            <SensorCard icon={require('../../assets/icons/suhu.png')} label="Suhu Udara" value={sensorData.suhuUdara} unit="°C" device="DHT22" onPress={() => navigation.navigate('SensorDetail', { title: "Suhu Udara", value: sensorData.suhuUdara, unit: "°C", icon: require('../../assets/icons/suhu.png'), device: "DHT22" })} />
                            <SensorCard icon={require('../../assets/icons/kelembaban.png')} label="Kelembapan" value={sensorData.kelembapan} unit="%" device="DHT22" onPress={() => navigation.navigate('SensorDetail', { title: "Kelembapan", value: sensorData.kelembapan, unit: "%", icon: require('../../assets/icons/kelembaban.png'), device: "DHT22" })} />
                            <SensorCard icon={require('../../assets/icons/suhu_air.png')} label="Suhu Air" value={sensorData.suhuAir} unit="°C" device="DS18B20" onPress={() => navigation.navigate('SensorDetail', { title: "Suhu Air", value: sensorData.suhuAir, unit: "°C", icon: require('../../assets/icons/suhu_air.png'), device: "DS18B20" })} />
                            <SensorCard icon={require('../../assets/icons/cahaya.png')} label="Cahaya" value={sensorData.cahaya} unit="LxF" device="LDR" onPress={() => navigation.navigate('SensorDetail', { title: "Intensitas Cahaya", value: sensorData.cahaya, unit: "LxF", icon: require('../../assets/icons/cahaya.png'), device: "Sensor LDR" })} />
                        </View>

                        {/* Status Aktuator Inkubator */}
                        <Text style={styles.sectionTitle}>Status Aktuator Inkubator {isAutomaticMode ? '(Otomatis)' : '(Manual)'}</Text>
                        <View style={styles.actuatorContainer}>

                            {/* Baris Lampu */}
                            <TouchableOpacity
                                style={styles.actuatorRow}
                                onPress={() => handleToggleActuator('lampu', actuatorStatus.lampu)}
                                activeOpacity={isAutomaticMode ? 1 : 0.7}
                                disabled={isAutomaticMode}
                            >
                                <View style={styles.actuatorLeftRow}>
                                    <Image source={require('../../assets/icons/pemanas.png')} style={styles.actuatorIconImage} resizeMode="contain" />
                                    <Text style={styles.actuatorName}>Lampu Pemanas (LED)</Text>
                                </View>
                                <View style={[styles.badgeContainer, actuatorStatus.lampu ? styles.badgeActive : styles.badgeInactive]}>
                                    <Text style={[styles.statusText, actuatorStatus.lampu ? styles.textActive : styles.textInactive]}>
                                        {actuatorStatus.lampu ? 'ON' : 'OFF'}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/* Baris Kipas */}
                            <TouchableOpacity
                                style={styles.actuatorRow}
                                onPress={() => handleToggleActuator('kipas', actuatorStatus.kipas)}
                                activeOpacity={isAutomaticMode ? 1 : 0.7}
                                disabled={isAutomaticMode}
                            >
                                <View style={styles.actuatorLeftRow}>
                                    <Image source={require('../../assets/icons/ventilasi.png')} style={styles.actuatorIconImage} resizeMode="contain" />
                                    <Text style={styles.actuatorName}>Kipas Ventilasi (Servo)</Text>
                                </View>
                                <View style={[styles.badgeContainer, styles.badgeActive, !actuatorStatus.kipas && styles.badgeInactive]}>
                                    <Text style={[styles.statusText, styles.textActive, !actuatorStatus.kipas && styles.textInactive]}>
                                        {actuatorStatus.kipas ? 'ON' : 'OFF'}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/* Baris Buzzer */}
                            <TouchableOpacity
                                style={styles.actuatorRow}
                                onPress={() => handleToggleActuator('buzzer', actuatorStatus.buzzer)}
                                activeOpacity={isAutomaticMode ? 1 : 0.7}
                                disabled={isAutomaticMode}
                            >
                                <View style={styles.actuatorLeftRow}>
                                    <Image source={require('../../assets/icons/alarm.png')} style={styles.actuatorIconImage} resizeMode="contain" />
                                    <Text style={styles.actuatorName}>Buzzer Alarm</Text>
                                </View>
                                <View style={[styles.badgeContainer, actuatorStatus.buzzer ? styles.badgeAlert : styles.badgeInactive]}>
                                    <Text style={[styles.statusText, actuatorStatus.buzzer ? styles.textAlert : styles.textInactive]}>
                                        {actuatorStatus.buzzer ? 'ON' : 'OFF'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Bottom Navbar */}
            <View style={styles.navbarContainer}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Weather')}><Image source={require('../../assets/icons/cuaca.png')} style={styles.navIconImage} resizeMode="contain" /><Text style={styles.navLabel}>Weather</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Log')}><Image source={require('../../assets/icons/log.png')} style={styles.navIconImage} resizeMode="contain" /><Text style={styles.navLabel}>Log</Text></TouchableOpacity>
                <View style={styles.centerNavWrapper}>
                    <TouchableOpacity style={[styles.centerNavButton, styles.centerNavButtonActive]} onPress={() => setActiveTab('dashboard')}><Image source={require('../../assets/icons/dashboard.png')} style={styles.centerNavIconImage} resizeMode="contain" /></TouchableOpacity>
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Dashboard</Text>
                </View>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Harga')}><Image source={require('../../assets/icons/harga.png')} style={styles.navIconImage} resizeMode="contain" /><Text style={styles.navLabel}>Harga</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Tengkulak')}><Image source={require('../../assets/icons/tengkulak.png')} style={styles.navIconImage} resizeMode="contain" /><Text style={styles.navLabel}>Tengkulak</Text></TouchableOpacity>
            </View>
        </View>
    );
}

const SensorCard = ({ icon, label, value, unit, device, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.cardHeader}>
            <Image source={icon} style={styles.cardIcon} resizeMode="contain" />
            <Text style={styles.deviceLabel}>{device}</Text>
        </View>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardValue}>{value}<Text style={styles.cardUnit}> {unit}</Text></Text>
        <View style={styles.miniBarGraphContainer}>
            <View style={[styles.miniBar, { height: 12 }]} />
            <View style={[styles.miniBar, { height: 18 }]} />
            <View style={[styles.miniBar, { height: 14 }]} />
            <View style={[styles.miniBar, { height: 24, backgroundColor: '#F25C05' }]} />
            <View style={[styles.miniBar, { height: 16 }]} />
            <View style={[styles.miniBar, { height: 20 }]} />
            <View style={[styles.miniBar, { height: 13 }]} />
        </View>
    </TouchableOpacity>
);

// --- BAGIAN UTAMA STYLESYSTEM YANG WAJIB ADA AGAR TIDAK ERROR CODES STACK CRASH ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: { backgroundColor: '#F25C05', paddingHorizontal: 24, paddingTop: 50, paddingBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 6 },
    headerLeftRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    headerLogo: { width: 45, height: 45, backgroundColor: '#FFFFFF', borderRadius: 99, marginRight: 12, padding: 4 },
    headerTextGroup: { justifyContent: 'center', flex: 1, paddingRight: 8 },
    headerBrand: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#FFE0CC', letterSpacing: 1 },
    headerUser: { fontFamily: 'Roboto_700Bold', fontSize: 18, color: '#FFFFFF', marginTop: 1 },
    logoutButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
    logoutText: { fontFamily: 'Roboto_500Medium', color: '#FFFFFF', fontSize: 12 },
    scrollContainer: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 130 },
    simulationCard: { backgroundColor: '#EAEFF5', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    cardTextContainer: { flex: 1, paddingRight: 10 },
    switchTitle: { fontFamily: 'Roboto_700Bold', fontSize: 15, color: '#1A1A1A' },
    switchSubtitle: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#666666', marginTop: 2 },
    centerLoading: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50 },
    loadingText: { fontFamily: 'Roboto_400Regular', color: '#666666', marginTop: 10, fontSize: 14 },
    sectionTitle: { fontFamily: 'Roboto_700Bold', fontSize: 15, color: '#1A1A1A', marginBottom: 12, marginTop: 14 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
    card: { backgroundColor: '#FFFFFF', width: (width - 64) / 2, padding: 16, borderRadius: 18, marginBottom: 16, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    cardIcon: { width: 28, height: 28 },
    deviceLabel: { fontFamily: 'Roboto_500Medium', fontSize: 10, color: '#999999', backgroundColor: '#F5F5F5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    cardLabel: { fontFamily: 'Roboto_500Medium', fontSize: 14, color: '#666666', marginTop: 4, marginBottom: 4 },
    cardValue: { fontFamily: 'Roboto_700Bold', fontSize: 24, color: '#1A1A1A' },
    cardUnit: { fontSize: 14, color: '#666666' },
    miniBarGraphContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 25, marginTop: 12, paddingHorizontal: 2 },
    miniBar: { width: 6, backgroundColor: '#FFD0B3', borderRadius: 3, height: 10 },
    actuatorContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4, elevation: 2, marginBottom: 16 },
    actuatorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    actuatorLeftRow: { flexDirection: 'row', alignItems: 'center' },
    actuatorIconImage: { width: 22, height: 22, marginRight: 10 },
    actuatorName: { fontFamily: 'Roboto_500Medium', fontSize: 14, color: '#333333' },
    badgeContainer: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8, minWidth: 65, alignItems: 'center', justifyContent: 'center' },
    badgeInactive: { backgroundColor: '#F5F5F5' },
    badgeActive: { backgroundColor: '#FFF0E6' },
    badgeAlert: { backgroundColor: '#FFEBE6' },
    statusText: { fontFamily: 'Roboto_700Bold', fontSize: 12, textAlign: 'center' },
    textInactive: { color: '#999999' },
    textActive: { color: '#F25C05' },
    textAlert: { color: '#E63946' },
    navbarContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 88, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around', borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 20 },
    navItem: { alignItems: 'center', justifyContent: 'flex-end', flex: 1, height: 66, paddingBottom: 12 },
    navIconImage: { width: 22, height: 22, marginBottom: 4 },
    centerNavWrapper: { alignItems: 'center', justifyContent: 'flex-end', width: 75, height: 66, paddingBottom: 12, position: 'relative' },
    centerNavButton: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -28, borderWidth: 4, borderColor: '#F5F7FA', elevation: 8 },
    centerNavButtonActive: { backgroundColor: '#FFF0E6', borderColor: '#FFFFFF' },
    centerNavIconImage: { width: 30, height: 30 },
    navLabel: { fontFamily: 'Roboto_500Medium', fontSize: 10, color: '#999999' },
    navLabelActive: { color: '#F25C05', fontFamily: 'Roboto_700Bold' },
});