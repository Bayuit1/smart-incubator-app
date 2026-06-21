import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, Image, Alert } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

import FullDatePicker from '../components/FullDatePicker';

export default function LogScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('log');

    const [selectedDate, setSelectedDate] = useState({
        day: 21,
        month: 'Juni',
        year: 2026
    });

    const masterLogs = {
        "21_Juni_2026": [
            { id: 1, waktu: '02:45', tipe: 'danger', judul: 'Buzzer Alarm ON', pesan: 'Suhu udara terdeteksi terlalu tinggi di angka 38.7 °C', icon: require('../../assets/icons/alarm.png') },
            { id: 2, waktu: '02:40', tipe: 'warning', judul: 'Kipas Ventilasi AKTIF', pesan: 'Servo terbuka otomatis untuk membuang hawa panas luar', icon: require('../../assets/icons/ventilasi.png') },
            { id: 3, waktu: '02:15', tipe: 'info', judul: 'Sistem Telemetri Normal', pesan: 'Suhu Udara: 37.4 °C | Kelembapan: 56% | Suhu Air: 36.5 °C', icon: require('../../assets/icons/log.png') },
        ],
        "20_Juni_2026": [
            { id: 4, waktu: '18:20', tipe: 'info', judul: 'Sistem Telemetri Normal', pesan: 'Suhu Udara: 37.5 °C | Kelembapan: 55% | Suhu Air: 36.6 °C', icon: require('../../assets/icons/log.png') },
            { id: 5, waktu: '06:00', tipe: 'neutral', judul: 'Lampu Pemanas OFF', pesan: 'Lampu mati otomatis karena suhu stabil', icon: require('../../assets/icons/pemanas.png') },
        ],
    };

    const logKey = `${selectedDate.day}_${selectedDate.month}_${selectedDate.year}`;
    const currentLogs = masterLogs[logKey] || [];

    const handleExportData = () => {
        Alert.alert(
            "Export Laporan Berhasil",
            `File LOG_ENDOG_${selectedDate.day}_${selectedDate.month}_${selectedDate.year}.csv telah berhasil dibuat dan disimpan ke folder penyimpanan lokal HP Anda.`,
            [{ text: "OK" }]
        );
    };

    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#F25C05" />

            {/* Header - Tombol Export Menggunakan Tulisan Teks Bersih */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerBrand}>E-NDOG DATA LOGGER</Text>
                    <Text style={styles.headerTitle}>Log Riwayat Sistem</Text>
                </View>
                <TouchableOpacity style={styles.exportButton} onPress={handleExportData} activeOpacity={0.8}>
                    <Text style={styles.exportText}>Export CSV</Text>
                </TouchableOpacity>
            </View>

            <FullDatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} clipToPadding={false}>
                {currentLogs.length > 0 ? (
                    <View style={styles.timelineWrapper}>
                        {currentLogs.map((log) => (
                            <View key={log.id} style={styles.logItemRow}>
                                <View style={styles.timeColumn}>
                                    <Text style={styles.logTimeText}>{log.waktu}</Text>
                                    <Text style={styles.logWibText}>WIB</Text>
                                </View>

                                <View style={styles.lineColumn}>
                                    <View style={[
                                        styles.dotIndicator,
                                        log.tipe === 'danger' && styles.dotDanger,
                                        log.tipe === 'warning' && styles.dotWarning,
                                        log.tipe === 'info' && styles.dotInfo,
                                        log.tipe === 'neutral' && styles.dotNeutral,
                                    ]} />
                                    <View style={styles.verticalLine} />
                                </View>

                                <View style={styles.logCardContent}>
                                    <View style={styles.logCardHeaderRow}>
                                        <Image source={log.icon} style={styles.logMiniIcon} resizeMode="contain" />
                                        <Text style={styles.logCardTitle}>{log.judul}</Text>
                                    </View>
                                    <Text style={styles.logCardBody}>{log.pesan}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Image source={require('../../assets/icons/log.png')} style={styles.emptyIcon} resizeMode="contain" />
                        <Text style={styles.emptyText}>Tidak ada aktivitas log terekam pada tanggal ini.</Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Navbar */}
            <View style={styles.navbarContainer}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Weather')}>
                    <Image source={require('../../assets/icons/cuaca.png')} style={styles.navIconImage} resizeMode="contain" />
                    <Text style={styles.navLabel}>Weather</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('log')}>
                    <Image source={require('../../assets/icons/log.png')} style={styles.navIconImage} resizeMode="contain" />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Log</Text>
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

    // Style Tombol Export Baru (Minimalis & Center-Aligned)
    exportButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exportText: { fontFamily: 'Roboto_700Bold', fontSize: 11, color: '#F25C05' },

    scrollContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 160 },
    timelineWrapper: { width: '100%' },
    logItemRow: { flexDirection: 'row', width: '100%', marginBottom: 4 },
    timeColumn: { width: 45, alignItems: 'flex-start', paddingTop: 14 },
    logTimeText: { fontFamily: 'Roboto_700Bold', fontSize: 13, color: '#2D3748' },
    logWibText: { fontFamily: 'Roboto_400Regular', fontSize: 9, color: '#A0AEC0', marginTop: 1 },
    lineColumn: { width: 24, alignItems: 'center', position: 'relative' },
    dotIndicator: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#999999', marginTop: 16, zIndex: 2, borderWidth: 2, borderColor: '#F5F7FA' },
    dotDanger: { backgroundColor: '#E63946' },
    dotWarning: { backgroundColor: '#F2A505' },
    dotInfo: { backgroundColor: '#3182CE' },
    dotNeutral: { backgroundColor: '#718096' },
    verticalLine: { position: 'absolute', top: 20, bottom: -20, width: 2, backgroundColor: '#E2E8F0', zIndex: 1 },

    logCardContent: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 16, elevation: 1 },
    logCardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    logMiniIcon: { width: 16, height: 16, marginRight: 8 },
    logCardTitle: { fontFamily: 'Roboto_700Bold', fontSize: 13, color: '#2D3748' },
    logCardBody: { fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#718096', lineHeight: 18 },

    emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 40, width: '100%' },
    emptyIcon: { width: 48, height: 48, opacity: 0.3, marginBottom: 12 },
    emptyText: { fontFamily: 'Roboto_500Medium', fontSize: 13, color: '#A0AEC0', textAlign: 'center', paddingHorizontal: 20 },

    navbarContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 88, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around', borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 20 },
    navItem: { alignItems: 'center', justifyContent: 'flex-end', flex: 1, height: 66, paddingBottom: 12 },
    navIconImage: { width: 22, height: 22, marginBottom: 4 },
    centerNavWrapper: { alignItems: 'center', justifyContent: 'flex-end', width: 75, height: 66, paddingBottom: 12, position: 'relative' },
    centerNavButton: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -28, borderWidth: 4, borderColor: '#F5F7FA', shadowColor: '#F25C05', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 8 },
    navLabel: { fontFamily: 'Roboto_500Medium', fontSize: 10, color: '#999999' },
    navLabelActive: { color: '#F25C05', fontFamily: 'Roboto_700Bold' },
    centerNavIconImage: { width: 30, height: 30 }
});