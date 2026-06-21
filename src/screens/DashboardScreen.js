import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, StatusBar, Image, Dimensions } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

import SensorCard from '../components/SensorCard';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
    const [isSimulationMode, setIsSimulationMode] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    const [sensorData, setSensorData] = useState({
        suhuUdara: 37.5,
        kelembapan: 55,
        suhuAir: 36.8,
        cahaya: 450,
    });

    const [history, setHistory] = useState({
        suhuUdara: [40, 55, 45, 60, 70, 65, 75],
        kelembapan: [60, 50, 65, 55, 70, 60, 55],
        suhuAir: [50, 48, 52, 58, 62, 60, 68],
        cahaya: [30, 45, 40, 55, 50, 65, 45],
    });

    useEffect(() => {
        let interval;
        if (isSimulationMode) {
            interval = setInterval(() => {
                const nextSuhu = parseFloat((36.5 + Math.random() * 2).toFixed(1));
                const nextKelembapan = Math.floor(50 + Math.random() * 10);
                const nextSuhuAir = parseFloat((35.8 + Math.random() * 2).toFixed(1));
                const nextCahaya = Math.floor(400 + Math.random() * 100);

                setSensorData({
                    suhuUdara: nextSuhu,
                    kelembapan: nextKelembapan,
                    suhuAir: nextSuhuAir,
                    cahaya: nextCahaya,
                });

                setHistory(prev => ({
                    suhuUdara: [...prev.suhuUdara.slice(1), Math.floor((nextSuhu - 35) * 20)],
                    kelembapan: [...prev.kelembapan.slice(1), Math.floor(nextKelembapan)],
                    suhuAir: [...prev.suhuAir.slice(1), Math.floor((nextSuhuAir - 34) * 20)],
                    cahaya: [...prev.cahaya.slice(1), Math.floor((nextCahaya - 380) * 0.8)],
                }));
            }, 2000);
        } else {
            setSensorData({ suhuUdara: 37.5, kelembapan: 55, suhuAir: 36.8, cahaya: 450 });
            setHistory({
                suhuUdara: [40, 55, 45, 60, 70, 65, 75],
                kelembapan: [60, 50, 65, 55, 70, 60, 55],
                suhuAir: [50, 48, 52, 58, 62, 60, 68],
                cahaya: [30, 45, 40, 55, 50, 65, 45],
            });
        }
        return () => clearInterval(interval);
    }, [isSimulationMode]);

    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const openSensorDetail = (title, value, unit, icon, device) => {
        navigation.navigate('SensorDetail', { title, value, unit, icon, device });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#F25C05" />

            {/* Header Utama */}
            <View style={styles.header}>
                <View style={styles.headerLeftRow}>
                    <Image source={require('../../assets/logo.png')} style={styles.headerLogo} resizeMode="contain" />
                    <View style={styles.headerTextGroup}>
                        <Text style={styles.headerBrand}>E-NDOG DASHBOARD</Text>
                        <Text style={styles.headerUser}>Halo, Peternak!</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
                    <Text style={styles.logoutText}>Keluar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                <View style={[styles.simulationBanner, isSimulationMode && styles.simulationBannerActive]}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.simTitle}>Mode Simulasi Data</Text>
                        <Text style={styles.simSub}>
                            {isSimulationMode ? 'Menggunakan data acak sistem' : 'Menunggu koneksi hardware ESP32'}
                        </Text>
                    </View>
                    <Switch trackColor={{ false: '#767577', true: '#F2A505' }} thumbColor={isSimulationMode ? '#FFFFFF' : '#f4f3f4'} onValueChange={setIsSimulationMode} value={isSimulationMode} />
                </View>

                {/* Grid Sensor Parameter */}
                <Text style={styles.sectionTitle}>Monitoring Parameter</Text>
                <View style={styles.gridContainer}>
                    <SensorCard icon={require('../../assets/icons/suhu.png')} label="Suhu Udara" value={sensorData.suhuUdara} unit="°C" device="DHT22" historyData={history.suhuUdara} onPress={() => openSensorDetail("Suhu Udara", sensorData.suhuUdara, "°C", require('../../assets/icons/suhu.png'), "DHT22")} />
                    <SensorCard icon={require('../../assets/icons/kelembaban.png')} label="Kelembapan" value={sensorData.kelembapan} unit="%" device="DHT22" historyData={history.kelembapan} onPress={() => openSensorDetail("Kelembapan", sensorData.kelembapan, "%", require('../../assets/icons/kelembaban.png'), "DHT22")} />
                    <SensorCard icon={require('../../assets/icons/suhu_air.png')} label="Suhu Air" value={sensorData.suhuAir} unit="°C" device="DS18B20" historyData={history.suhuAir} onPress={() => openSensorDetail("Suhu Air", sensorData.suhuAir, "°C", require('../../assets/icons/suhu_air.png'), "DS18B20")} />
                    <SensorCard icon={require('../../assets/icons/cahaya.png')} label="Cahaya" value={sensorData.cahaya} unit="LxF" device="LDR" historyData={history.cahaya} onPress={() => openSensorDetail("Intensitas Cahaya", sensorData.cahaya, "LxF", require('../../assets/icons/cahaya.png'), "Sensor LDR")} />
                </View>

                {/* Status Aktuator - Menggunakan Gambar Ikon Kustom */}
                <Text style={styles.sectionTitle}>Status Aktuator Inkubator</Text>
                <View style={styles.actuatorContainer}>

                    {/* Row 1: Lampu */}
                    <View style={styles.actuatorRow}>
                        <View style={styles.actuatorLeftRow}>
                            <Image source={require('../../assets/icons/pemanas.png')} style={styles.actuatorIconImage} resizeMode="contain" />
                            <Text style={styles.actuatorName}>Lampu Pemanas (LED)</Text>
                        </View>
                        <Text style={[styles.statusBadge, sensorData.suhuUdara < 37.8 ? styles.statusActive : styles.statusInactive]}>
                            {sensorData.suhuUdara < 37.8 ? 'AKTIF' : 'OFF'}
                        </Text>
                    </View>

                    {/* Row 2: Kipas */}
                    <View style={styles.actuatorRow}>
                        <View style={styles.actuatorLeftRow}>
                            <Image source={require('../../assets/icons/ventilasi.png')} style={styles.actuatorIconImage} resizeMode="contain" />
                            <Text style={styles.actuatorName}>Kipas Ventilasi (Servo)</Text>
                        </View>
                        <Text style={[styles.statusBadge, sensorData.suhuUdara >= 38.0 ? styles.statusAccent : styles.statusInactive]}>
                            {sensorData.suhuUdara >= 38.0 ? 'AKTIF' : 'OFF'}
                        </Text>
                    </View>

                    {/* Row 3: Buzzer */}
                    <View style={styles.actuatorRow}>
                        <View style={styles.actuatorLeftRow}>
                            <Image source={require('../../assets/icons/alarm.png')} style={styles.actuatorIconImage} resizeMode="contain" />
                            <Text style={styles.actuatorName}>Buzzer Alarm</Text>
                        </View>
                        <Text style={[styles.statusBadge, sensorData.suhuUdara > 38.5 ? styles.statusAlert : styles.statusSafe]}>
                            {sensorData.suhuUdara > 38.5 ? 'ON' : 'OFF'}
                        </Text>
                    </View>

                </View>

            </ScrollView>

            {/* Bottom Navbar */}
            <View style={styles.navbarContainer}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Weather')}>
                    <Image source={require('../../assets/icons/cuaca.png')} style={styles.navIconImage} resizeMode="contain" />
                    <Text style={[styles.navLabel, activeTab === 'weather' && styles.navLabelActive]}>Weather</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Log')}>
                    <Image source={require('../../assets/icons/log.png')} style={styles.navIconImage} resizeMode="contain" />
                    <Text style={[styles.navLabel, activeTab === 'log' && styles.navLabelActive]}>Log</Text>
                </TouchableOpacity>

                <View style={styles.centerNavWrapper}>
                    <TouchableOpacity
                        style={[styles.centerNavButton, activeTab === 'dashboard' && styles.centerNavButtonActive]}
                        activeOpacity={0.85}
                        onPress={() => setActiveTab('dashboard')}
                    >
                        <Image source={require('../../assets/icons/dashboard.png')} style={styles.centerNavIconImage} resizeMode="contain" />
                    </TouchableOpacity>
                    <Text style={[styles.navLabel, activeTab === 'dashboard' && styles.navLabelActive]}>Dashboard</Text>
                </View>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Harga')}>
                    <Image source={require('../../assets/icons/harga.png')} style={styles.navIconImage} resizeMode="contain" />
                    <Text style={styles.navLabel}>Harga</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Tengkulak')}>
                    <Image source={require('../../assets/icons/tengkulak.png')} style={styles.navIconImage} resizeMode="contain" />
                    <Text style={styles.navLabel}>Tengkulak</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: {
        backgroundColor: '#F25C05',
        paddingHorizontal: 24,
        paddingTop: 50,
        paddingBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 6,
    },
    headerLeftRow: { flexDirection: 'row', alignItems: 'center' },
    headerLogo: { width: 45, height: 45, backgroundColor: '#FFFFFF', borderRadius: 99, marginRight: 12, padding: 4 },
    headerTextGroup: { justifyContent: 'center' },
    headerBrand: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#FFE0CC', letterSpacing: 1 },
    headerUser: { fontFamily: 'Roboto_700Bold', fontSize: 18, color: '#FFFFFF', marginTop: 1 },
    logoutButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
    logoutText: { fontFamily: 'Roboto_500Medium', color: '#FFFFFF', fontSize: 12 },
    scrollContainer: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 130 },
    simulationBanner: { backgroundColor: '#E6EAF0', padding: 16, borderRadius: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    simulationBannerActive: { backgroundColor: '#FFEFD6', borderWidth: 1, borderColor: '#F2A505' },
    simTitle: { fontFamily: 'Roboto_700Bold', fontSize: 15, color: '#1A1A1A' },
    simSub: { fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#666666', marginTop: 2 },
    sectionTitle: { fontFamily: 'Roboto_700Bold', fontSize: 16, color: '#1A1A1A', marginBottom: 14, marginTop: 14 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },

    // Style Aktuator yang Diperbarui
    actuatorContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, elevation: 2 },
    actuatorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    actuatorLeftRow: { flexDirection: 'row', alignItems: 'center' },
    actuatorIconImage: { width: 22, height: 22, marginRight: 10 },
    actuatorName: { fontFamily: 'Roboto_500Medium', fontSize: 14, color: '#333333' },

    statusBadge: { fontFamily: 'Roboto_700Bold', fontSize: 11, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, overflow: 'hidden', textAlign: 'center', minWidth: 65 },
    statusInactive: { backgroundColor: '#F5F5F5', color: '#999999' },
    statusActive: { backgroundColor: '#FFF0E6', color: '#F25C05' },
    statusAccent: { backgroundColor: '#FFF9E6', color: '#F2A505' },
    statusAlert: { backgroundColor: '#FFEBE6', color: '#E63946' },
    statusSafe: { backgroundColor: '#F5F5F5', color: '#999999' },

    navbarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 88,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 20,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
        height: 66,
        paddingBottom: 12,
    },
    navIconImage: {
        width: 22,
        height: 22,
        marginBottom: 4,
    },
    centerNavWrapper: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 75,
        height: 66,
        paddingBottom: 12,
        position: 'relative',
    },
    centerNavButton: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -28,
        borderWidth: 4,
        borderColor: '#F5F7FA',
        shadowColor: '#F25C05',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 8,
    },
    centerNavButtonActive: {
        backgroundColor: '#FFF0E6',
        borderColor: '#FFFFFF',
    },
    centerNavIconImage: {
        width: 30,
        height: 30,
    },
    navLabel: {
        fontFamily: 'Roboto_500Medium',
        fontSize: 10,
        color: '#999999',
    },
    navLabelActive: {
        color: '#F25C05',
        fontFamily: 'Roboto_700Bold',
    },
});