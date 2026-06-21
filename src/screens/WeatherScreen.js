import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, Image, Dimensions, RefreshControl } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import axios from 'axios';

// Import komponen SkeletonCard untuk Tugas 4
import SkeletonCard from '../components/SkeletonCard';

const { width } = Dimensions.get('window');

export default function WeatherScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('weather');
    
    // State Lifecycle (Tugas 4)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    
    // State Pull-to-Refresh (Tugas 6)
    const [refreshing, setRefreshing] = useState(false);

    const [weatherOutside, setWeatherOutside] = useState({
        lokasi: '-',
        kondisi: '-',
        tempLuar: 0,
        kelembapanLuar: 0,
        kecepatanAngin: 0,
        terakhirUpdate: '-'
    });

    const [advisoryMsg, setAdvisoryMsg] = useState({
        status: 'Aman',
        pesan: 'Memuat data mitigasi...',
        tindakan: 'Silakan tunggu.'
    });

    // Data statis untuk UI tambahan (Jika nanti ada API forecast, bisa diparsing di sini juga)
    const forecastData = [
        { jam: '03:00', temp: '26°C', kondisi: 'Hujan', icon: require('../../assets/icons/cuaca.png') },
        { jam: '06:00', temp: '25°C', kondisi: 'Berawan', icon: require('../../assets/icons/cuaca.png') },
        { jam: '09:00', temp: '29°C', kondisi: 'Cerah', icon: require('../../assets/icons/cuaca.png') },
        { jam: '12:00', temp: '32°C', kondisi: 'Cerah Berawan', icon: require('../../assets/icons/cuaca.png') },
    ];

    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
    });

    useEffect(() => {
        fetchWeatherData();
    }, []);

    const determineAdvisory = (temp, humidity, conditionId) => {
        const isRaining = conditionId >= 200 && conditionId < 600;

        if (isRaining || temp < 26 || humidity > 80) {
            return {
                status: 'Waspada',
                pesan: `Cuaca luar sedang ${isRaining ? 'hujan' : 'dingin'} dengan kelembapan tinggi (${humidity}%). Sistem mendeteksi potensi penurunan suhu tajam di dalam inkubator.`,
                tindakan: 'Pastikan kipas ventilasi (Servo) berada pada mode otomatis atau tertutup rapat agar hawa dingin luar tidak merusak kehangatan telur.'
            };
        } else if (temp > 32) {
            return {
                status: 'Waspada',
                pesan: `Suhu luar ruangan cukup panas (${temp}°C). Terdapat risiko kenaikan suhu berlebih (overheating) jika sirkulasi udara inkubator terhambat.`,
                tindakan: 'Pastikan ventilasi mekanik terbuka dengan baik dan pantau pembuangan panas agar suhu internal tetap stabil pada angka ideal.'
            };
        } else {
            return {
                status: 'Aman',
                pesan: `Kondisi cuaca luar ruangan relatif stabil (${temp}°C, Kelembapan ${humidity}%). Sangat ideal untuk mendukung kestabilan suhu sekitar inkubator.`,
                tindakan: 'Pertahankan pengaturan inkubator pada mode otomatis. Tetap lakukan pemantauan berkala pada grafik log data.'
            };
        }
    };

    // Parameter isRefresh ditambahkan agar tarik-layar tidak memunculkan SkeletonCard
    const fetchWeatherData = async (isRefresh = false) => {
        try {
            if (!isRefresh) setLoading(true);
            setError(null); 
            
            const API_KEY = '15f0fe041cc31753ae0783e4a2d6875c'; 
            const LAT = '-7.4478'; 
            const LON = '112.7183'; 
            const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=id`;

            const response = await axios.get(URL);
            
            // TUGAS 5: Data Parsing API Kompleks OpenWeatherMap ke Format Visual Aplikasi
            const data = response.data;
            const tempLuarVal = Math.round(data.main.temp);
            const kelembapanLuarVal = data.main.humidity;
            const conditionId = data.weather[0].id; 

            const now = new Date();
            const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

            setWeatherOutside({
                lokasi: `${data.name}, Indonesia`,
                kondisi: data.weather[0].description.replace(/\b\w/g, l => l.toUpperCase()), 
                tempLuar: tempLuarVal,
                kelembapanLuar: kelembapanLuarVal,
                kecepatanAngin: Math.round(data.wind.speed * 3.6), 
                terakhirUpdate: timeString
            });

            const advisory = determineAdvisory(tempLuarVal, kelembapanLuarVal, conditionId);
            setAdvisoryMsg(advisory);

        } catch (err) {
            console.error("Gagal mengambil data cuaca: ", err);
            setError("Gagal menarik data cuaca terupdate. Periksa koneksi internet Anda atau coba beberapa saat lagi.");
        } finally {
            if (!isRefresh) setLoading(false);
        }
    };

    // ----------------------------------------------------
    // TUGAS 6: FUNGSI PULL-TO-REFRESH
    // ----------------------------------------------------
    const onRefresh = async () => {
        setRefreshing(true); // Memunculkan loading putar di atas layar
        await fetchWeatherData(true); // Memanggil fetch data tanpa mengaktifkan loading Skeleton
        setRefreshing(false); // Menyembunyikan loading putar
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#F25C05" />

            {/* Header Atas */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerBrand}>E-NDOG WEATHER SYSTEM</Text>
                    <Text style={styles.headerTitle}>Sistem Cuaca</Text>
                </View>
                <View style={styles.locationBadge}>
                    <Text style={styles.locationText}>Stationary Mode</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                clipToPadding={false}
                // TUGAS 6: Memasang komponen RefreshControl
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        colors={['#F25C05']} 
                    />
                }
            >
                {loading ? (
                    <View>
                        <Text style={styles.sectionTitle}>Menyinkronkan Satelit Cuaca...</Text>
                        <View style={styles.skeletonContainer}>
                            <SkeletonCard />
                            <SkeletonCard />
                        </View>
                    </View>

                ) : error ? (
                    <View style={styles.errorCard}>
                        <Text style={styles.errorTitle}>⚠️ Gagal Sinkronisasi Cuaca</Text>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={() => fetchWeatherData(false)}>
                            <Text style={styles.retryButtonText}>Coba Lagi</Text>
                        </TouchableOpacity>
                    </View>

                ) : (
                    <>
                        <View style={styles.weatherCard}>
                            <Text style={styles.cityText}>{weatherOutside.lokasi}</Text>
                            <Text style={styles.updateText}>Diperbarui: {weatherOutside.terakhirUpdate}</Text>

                            <View style={styles.weatherMainRow}>
                                <Image source={require('../../assets/icons/cuaca.png')} style={styles.largeWeatherIcon} resizeMode="contain" />
                                <View>
                                    <Text style={styles.tempText}>{weatherOutside.tempLuar}°C</Text>
                                    <Text style={styles.conditionText}>{weatherOutside.kondisi}</Text>
                                </View>
                            </View>

                            <View style={styles.weatherDetailGrid}>
                                <View style={styles.weatherDetailItem}>
                                    <Text style={styles.detailLabel}>Kelembapan Luar</Text>
                                    <Text style={styles.detailValue}>{weatherOutside.kelembapanLuar}%</Text>
                                </View>
                                <View style={styles.weatherDetailItem}>
                                    <Text style={styles.detailLabel}>Kecepatan Angin</Text>
                                    <Text style={styles.detailValue}>{weatherOutside.kecepatanAngin} km/h</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Saran dan Penanganan</Text>
                        <View style={[styles.advisoryCard, advisoryMsg.status === 'Waspada' ? styles.borderWarning : styles.borderSafe]}>
                            <View style={styles.advisoryHeader}>
                                <View style={[styles.statusIndicator, advisoryMsg.status === 'Waspada' ? styles.bgWarning : styles.bgSafe]} />
                                <Text style={styles.advisoryStatusText}>Status Mitigasi: {advisoryMsg.status}</Text>
                            </View>
                            <Text style={styles.advisoryBody}>{advisoryMsg.pesan}</Text>

                            <View style={[styles.actionBox, advisoryMsg.status === 'Aman' && styles.actionBoxSafe]}>
                                <Text style={[styles.actionTitle, advisoryMsg.status === 'Aman' && styles.actionTitleSafe]}>Langkah Rekomendasi:</Text>
                                <Text style={styles.actionBody}>{advisoryMsg.tindakan}</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Prakiraan Cuaca Terdekat</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastRow}>
                            {forecastData.map((item, idx) => (
                                <View key={idx} style={styles.forecastCard}>
                                    <Text style={styles.forecastTime}>{item.jam}</Text>
                                    <Image source={item.icon} style={styles.forecastIcon} resizeMode="contain" />
                                    <Text style={styles.forecastTemp}>{item.temp}</Text>
                                    <Text style={styles.forecastCond}>{item.kondisi}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </>
                )}
            </ScrollView>

            {/* Bottom Navbar */}
            <View style={styles.navbarContainer}>
                <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('weather')}>
                    <Image source={require('../../assets/icons/cuaca.png')} style={styles.navIconImage} resizeMode="contain" />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Weather</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Log')}>
                    <Image source={require('../../assets/icons/log.png')} style={styles.navIconImage} resizeMode="contain" />
                    <Text style={[styles.navLabel, activeTab === 'log' && styles.navLabelActive]}>Log</Text>
                </TouchableOpacity>

                <View style={styles.centerNavWrapper}>
                    <TouchableOpacity style={styles.centerNavButton} activeOpacity={0.85} onPress={() => navigation.replace('Dashboard')}>
                        <Image source={require('../../assets/icons/dashboard.png')} style={styles.centerNavIconImage} resizeMode="contain" />
                    </TouchableOpacity>
                    <Text style={styles.navLabel}>Dashboard</Text>
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
    headerBrand: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#FFE0CC', letterSpacing: 1 },
    headerTitle: { fontFamily: 'Roboto_700Bold', fontSize: 18, color: '#FFFFFF', marginTop: 1 },
    locationBadge: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    locationText: { fontFamily: 'Roboto_500Medium', color: '#FFFFFF', fontSize: 11 },

    scrollContainer: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 160 },

    skeletonContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', marginTop: 10 },
    errorCard: { backgroundColor: '#FFF5F5', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#FEB2B2', alignItems: 'center', marginTop: 20 },
    errorTitle: { fontFamily: 'Roboto_700Bold', fontSize: 16, color: '#E53E3E', marginBottom: 8 },
    errorText: { fontFamily: 'Roboto_400Regular', fontSize: 13, color: '#C53030', textAlign: 'center', lineHeight: 20, marginBottom: 16 },
    retryButton: { backgroundColor: '#E53E3E', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    retryButtonText: { fontFamily: 'Roboto_700Bold', color: '#FFFFFF', fontSize: 13 },

    weatherCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, elevation: 2, marginBottom: 24, minHeight: 180, justifyContent: 'center' },
    cityText: { fontFamily: 'Roboto_700Bold', fontSize: 20, color: '#1A1A1A' },
    updateText: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#999999', marginTop: 2 },
    weatherMainRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 20 },
    largeWeatherIcon: { width: 64, height: 64, marginRight: 18 },
    tempText: { fontFamily: 'Roboto_700Bold', fontSize: 36, color: '#1A1A1A' },
    conditionText: { fontFamily: 'Roboto_500Medium', fontSize: 14, color: '#F25C05', marginTop: 1 },
    weatherDetailGrid: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#F5F5F5', paddingTop: 16 },
    weatherDetailItem: { flex: 1, alignItems: 'center' },
    detailLabel: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#888888' },
    detailValue: { fontFamily: 'Roboto_700Bold', fontSize: 16, color: '#333333', marginTop: 2 },

    sectionTitle: { fontFamily: 'Roboto_700Bold', fontSize: 16, color: '#1A1A1A', marginBottom: 14, marginTop: 10 },

    advisoryCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, elevation: 2, marginBottom: 24, borderWidth: 1 },
    borderWarning: { borderColor: '#F2A505' },
    borderSafe: { borderColor: '#10B981' },
    advisoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    statusIndicator: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
    bgWarning: { backgroundColor: '#F2A505' },
    bgSafe: { backgroundColor: '#10B981' },
    advisoryStatusText: { fontFamily: 'Roboto_700Bold', fontSize: 13, color: '#333333' },
    advisoryBody: { fontFamily: 'Roboto_400Regular', fontSize: 13, color: '#555555', lineHeight: 20 },

    actionBox: { backgroundColor: '#FFFDF6', borderRadius: 12, padding: 12, marginTop: 14, borderWidth: 1, borderColor: '#FFF0D0' },
    actionBoxSafe: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }, 
    actionTitle: { fontFamily: 'Roboto_700Bold', fontSize: 12, color: '#F2A505', marginBottom: 4 },
    actionTitleSafe: { color: '#16A34A' }, 
    actionBody: { fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#666666', lineHeight: 18 },

    forecastRow: { flexDirection: 'row', paddingVertical: 6, marginBottom: 10 },
    forecastCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, width: 100, alignItems: 'center', marginRight: 12, elevation: 2 },
    forecastTime: { fontFamily: 'Roboto_500Medium', fontSize: 11, color: '#888888' },
    forecastIcon: { width: 30, height: 30, marginVertical: 8 },
    forecastTemp: { fontFamily: 'Roboto_700Bold', fontSize: 14, color: '#1A1A1A' },
    forecastCond: { fontFamily: 'Roboto_400Regular', fontSize: 9, color: '#999999', marginTop: 2, textAlign: 'center' },

    navbarContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 88, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around', borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 20 },
    navItem: { alignItems: 'center', justifyContent: 'flex-end', flex: 1, height: 66, paddingBottom: 12 },
    navIconImage: { width: 22, height: 22, marginBottom: 4 },
    centerNavWrapper: { alignItems: 'center', justifyContent: 'flex-end', width: 75, height: 66, paddingBottom: 12, position: 'relative' },
    centerNavButton: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -28, borderWidth: 4, borderColor: '#F5F7FA', shadowColor: '#F25C05', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 8 },
    navLabel: { fontFamily: 'Roboto_500Medium', fontSize: 10, color: '#999999' },
    navLabelActive: { color: '#F25C05', fontFamily: 'Roboto_700Bold' },
    centerNavIconImage: { width: 30, height: 30 }
});