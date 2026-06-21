import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, Image, ActivityIndicator } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

// --- IMPORT COMPONENT MODULAR MANDIRI ANDA ---
import FullDatePicker from '../components/FullDatePicker';

// --- IMPORT FIREBASE FIRESTORE & ASYNC STORAGE ---
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

export default function LogScreen({ navigation }) {
    const [logData, setLogData] = useState([]);
    const [loading, setLoading] = useState(true);

    const sekarang = new Date();
    const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    // State objek tanggal yang dilempar dan dibaca oleh FullDatePicker
    const [selectedDate, setSelectedDate] = useState({
        day: sekarang.getDate(),
        month: namaBulan[sekarang.getMonth()],
        year: sekarang.getFullYear()
    });

    // --- SINKRONISASI DATA LOG DARI FIRESTORE BERDASARKAN TANGGAL UTK USER ---
    useEffect(() => {
        let unsubscribe;

        const listenToUserLogs = async () => {
            try {
                setLoading(true);
                const storedName = await AsyncStorage.getItem('userName');
                const cleanUserName = storedName ? storedName.replace(/\s+/g, '').toLowerCase() : 'peternak';

                // Format ID Dokumen Firestore: username_tanggal_Bulan_Tahun (Contoh: bayu_21_Juni_2026)
                const idDokumenLog = `${cleanUserName}_${selectedDate.day}_${selectedDate.month}_${selectedDate.year}`;
                const logDocRef = doc(db, 'log_system', idDokumenLog);

                unsubscribe = onSnapshot(logDocRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const docData = snapshot.data();
                        if (docData && docData.data_riwayat) {
                            const sortedLogs = [...docData.data_riwayat].sort((a, b) => b.id - a.id);
                            setLogData(sortedLogs);
                        } else {
                            setLogData([]);
                        }
                    } else {
                        setLogData([]);
                    }
                    setLoading(false);
                }, (error) => {
                    console.log("Error Fetching Log System:", error);
                    setLoading(false);
                });

            } catch (error) {
                console.log("Gagal memuat log data:", error);
                setLoading(false);
            }
        };

        listenToUserLogs();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [selectedDate]); // Otomatis reload pas data di dalam objek FullDatePicker berubah

    let [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold });
    if (!fontsLoaded) return null;

    const getIndicatorColor = (type) => {
        if (type === 'warning') return '#F25C05';
        if (type === 'danger') return '#E63946';
        return '#718096';
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#F25C05" />

            {/* HEADER LOG SCREEN */}
            <View style={styles.header}>
                <Text style={styles.headerBrand}>E-NDOG SYSTEM</Text>
                <Text style={styles.headerTitle}>Riwayat Aktivitas Inkubator</Text>
            </View>

            {/* AREA UTAMA / LIST RIWAYAT */}
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                {/* PEMANGGILAN UTAMA COMPONENT MODULAR KAMU */}
                {/* Karena FullDatePicker milikmu membawa container padding internal, taruh di paling atas */}
                <FullDatePicker
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />

                <View style={styles.logListWrapper}>
                    <Text style={styles.sectionTitle}>Log Terekam Hari Ini</Text>

                    {loading ? (
                        <View style={styles.centerLoading}>
                            <ActivityIndicator size="small" color="#F25C05" />
                            <Text style={styles.loadingText}>Memuat riwayat sistem...</Text>
                        </View>
                    ) : logData.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Image source={require('../../assets/icons/log.png')} style={styles.emptyIcon} tintColor="#CBD5E0" />
                            <Text style={styles.emptyText}>Tidak ada aktivitas terekam pada tanggal {selectedDate.day} {selectedDate.month} {selectedDate.year}.</Text>
                        </View>
                    ) : (
                        logData.map((item) => (
                            <View key={item.id} style={styles.logCard}>
                                <View style={[styles.statusIndicator, { backgroundColor: getIndicatorColor(item.tipe) }]} />
                                <View style={styles.logContent}>
                                    <View style={styles.logHeaderRow}>
                                        <Text style={styles.logTitle} numberOfLines={1}>{item.judul}</Text>
                                        <Text style={styles.logTime}>{item.waktu} WIB</Text>
                                    </View>
                                    <Text style={styles.logPesan}>{item.pesan}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* BOTTOM NAVBAR */}
            <View style={styles.navbarContainer}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Weather')}>
                    <Image source={require('../../assets/icons/cuaca.png')} style={styles.navIconImage} resizeMode="contain" />
                    <Text style={styles.navLabel}>Weather</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => { }}>
                    <Image source={require('../../assets/icons/log.png')} style={[styles.navIconImage, { tintColor: '#F25C05' }]} resizeMode="contain" />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Log</Text>
                </TouchableOpacity>

                <View style={styles.centerNavWrapper}>
                    <TouchableOpacity style={styles.centerNavButton} onPress={() => navigation.replace('Dashboard')}>
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
    header: { backgroundColor: '#F25C05', paddingHorizontal: 24, paddingTop: 50, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 6 },
    headerBrand: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#FFE0CC', letterSpacing: 1 },
    headerTitle: { fontFamily: 'Roboto_700Bold', fontSize: 18, color: '#FFFFFF', marginTop: 1 },

    // Padding horizontal dilepas di container utama agar tombol FullDatePicker kamu tidak menjepit ke dalam
    scrollContainer: { paddingTop: 0, paddingBottom: 130 },
    logListWrapper: { paddingHorizontal: 24, marginTop: 16 },
    sectionTitle: { fontFamily: 'Roboto_700Bold', fontSize: 15, color: '#1A1A1A', marginBottom: 14 },

    centerLoading: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
    loadingText: { fontFamily: 'Roboto_400Regular', color: '#666666', marginTop: 10, fontSize: 14 },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 40, paddingHorizontal: 20 },
    emptyIcon: { width: 50, height: 50, marginBottom: 12 },
    emptyText: { fontFamily: 'Roboto_400Regular', fontSize: 13, color: '#999999', textAlign: 'center', lineHeight: 20 },

    logCard: { backgroundColor: '#FFFFFF', borderRadius: 14, marginBottom: 12, flexDirection: 'row', overflow: 'hidden', elevation: 1.5, minHeight: 75 },
    statusIndicator: { width: 5 },
    logContent: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, justifyContent: 'center' },
    logHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    logTitle: { fontFamily: 'Roboto_700Bold', fontSize: 14, color: '#2D3748', flex: 1, paddingRight: 10 },
    logTime: { fontFamily: 'Roboto_500Medium', fontSize: 11, color: '#A0AEC0' },
    logPesan: { fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#4A5568', lineHeight: 17 },

    navbarContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 88, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around', borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 20 },
    navItem: { alignItems: 'center', justifyContent: 'flex-end', flex: 1, height: 66, paddingBottom: 12 },
    navIconImage: { width: 22, height: 22, marginBottom: 4 },
    centerNavWrapper: { alignItems: 'center', justifyContent: 'flex-end', width: 75, height: 66, paddingBottom: 12, position: 'relative' },
    centerNavButton: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -28, borderWidth: 4, borderColor: '#F5F7FA', elevation: 8 },
    centerNavIconImage: { width: 30, height: 30 },
    navLabel: { fontFamily: 'Roboto_500Medium', fontSize: 10, color: '#999999' },
    navLabelActive: { color: '#F25C05', fontFamily: 'Roboto_700Bold' },
});