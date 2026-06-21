import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, Image, Alert } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import axios from 'axios'; 

// Import Komponen Modular
import RadarMap from '../components/RadarMap';
import SkeletonCard from '../components/SkeletonCard'; 

export default function TengkulakScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('tengkulak');
    const [selectedTengkulak, setSelectedTengkulak] = useState(null); 

    const [daftarMitra, setDaftarMitra] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const INKUBATOR_COORDS = {
        latitude: -7.4478,
        longitude: 112.7183
    };

    useEffect(() => {
        fetchDataTengkulak();
    }, []);

    const fetchDataTengkulak = async () => {
        try {
            setLoading(true);
            setError(null); 

            const response = await axios.get('http://192.168.1.21:3000/api/tengkulak-sekitar');
            
            if (response.data.success) {
                const dataDariServer = response.data.data;
                setDaftarMitra(dataDariServer);
                
                if(dataDariServer.length > 0) {
                    setSelectedTengkulak(dataDariServer[0].id);
                }
            }
        } catch (err) {
            console.error("Gagal mengambil data tengkulak:", err);
            setError("Gagal memuat daftar mitra. Periksa koneksi internet Anda atau pastikan server aktif.");
        } finally {
            setLoading(false);
        }
    };

    const hitungJarakHaversine = (lat1, lon1, lat2, lon2) => {
        const R = 6371; 
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1); 
    };

    const handleHubungiWhatsApp = (nama) => {
        Alert.alert(
            "Menghubungi Mitra",
            `Mengalihkan Anda ke WhatsApp ${nama} untuk negosiasi harga hasil panen inkubator...`,
            [{ text: "Lanjutkan" }]
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

            <View style={styles.header}>
                <View>
                    <Text style={styles.headerBrand}>E-NDOG PARTNER</Text>
                    <Text style={styles.headerTitle}>Jaringan Mitra Tengkulak</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} clipToPadding={false}>

                <Text style={styles.sectionTitle}>Radar Lokasi Penyerapan Hasil Panen</Text>

                {/* --- PERUBAHAN DI SINI --- */}
                {/* Kita passing daftarMitra dari API ke dalam RadarMap agar titiknya dinamis */}
                <RadarMap 
                    dataMitra={daftarMitra} 
                    selectedTengkulak={selectedTengkulak} 
                    onSelectTengkulak={setSelectedTengkulak} 
                />

                <Text style={styles.sectionTitle}>Mitra Terdekat Sekitar Kandang</Text>
                
                {loading ? (
                    <View style={styles.skeletonContainer}>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </View>

                ) : error ? (
                    <View style={styles.errorCard}>
                        <Text style={styles.errorTitle}>⚠️ Koneksi Terputus</Text>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchDataTengkulak}>
                            <Text style={styles.retryButtonText}>Coba Lagi</Text>
                        </TouchableOpacity>
                    </View>

                ) : (
                    daftarMitra.map((mitra) => {
                        const isHighlighted = selectedTengkulak === mitra.id;

                        const jarakDinamis = hitungJarakHaversine(
                            INKUBATOR_COORDS.latitude,
                            INKUBATOR_COORDS.longitude,
                            mitra.latitude,
                            mitra.longitude
                        );

                        return (
                            <View key={mitra.id} style={[styles.partnerCard, isHighlighted && styles.partnerCardHighlighted]}>
                                <View style={styles.partnerInfoWrapper}>
                                    <View style={styles.partnerNameRow}>
                                        <Text style={styles.partnerNameText}>{mitra.nama}</Text>
                                        <View style={styles.distanceBadge}>
                                            <Text style={styles.distanceText}>{jarakDinamis} km</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.partnerRegionText}>Status Operasional: <Text style={{ fontFamily: 'Roboto_700Bold', color: mitra.status === 'Buka' ? '#10B981' : '#E63946' }}>{mitra.status}</Text></Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.whatsappButton}
                                    onPress={() => handleHubungiWhatsApp(mitra.nama)}
                                    activeOpacity={0.8}
                                >
                                    <Image source={require('../../assets/icons/whatsapp.png')} style={styles.waIconImage} resizeMode="contain" />
                                    <Text style={styles.waButtonText}>Hubungi WhatsApp</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                )}

            </ScrollView>

            <View style={styles.navbarContainer}>
                {/* Navbar Code ... (Sama seperti sebelumnya) */}
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Weather')}>
                    <Image source={require('../../assets/icons/cuaca.png')} style={styles.navIconImage} resizeMode="contain" />
                    <Text style={styles.navLabel}>Weather</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.replace('Log')}>
                    <Image source={require('../../assets/icons/log.png')} style={styles.navIconImage} resizeMode="contain" />
                    <Text style={styles.navLabel}>Log</Text>
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

                <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('tengkulak')}>
                    <Image source={require('../../assets/icons/tengkulak.png')} style={styles.navIconImage} resizeMode="contain" />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Tengkulak</Text>
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
    scrollContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 160 },
    sectionTitle: { fontFamily: 'Roboto_700Bold', fontSize: 15, color: '#2D3748', marginBottom: 12, marginTop: 14 },
    skeletonContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
    errorCard: { backgroundColor: '#FFF5F5', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#FEB2B2', alignItems: 'center', marginTop: 10 },
    errorTitle: { fontFamily: 'Roboto_700Bold', fontSize: 16, color: '#E53E3E', marginBottom: 8 },
    errorText: { fontFamily: 'Roboto_400Regular', fontSize: 13, color: '#C53030', textAlign: 'center', lineHeight: 20, marginBottom: 16 },
    retryButton: { backgroundColor: '#E53E3E', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    retryButtonText: { fontFamily: 'Roboto_700Bold', color: '#FFFFFF', fontSize: 13 },
    partnerCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 14, elevation: 1, borderWidth: 1.5, borderColor: 'transparent' },
    partnerCardHighlighted: { borderColor: '#F2A505', backgroundColor: '#FFFDF9' },
    partnerInfoWrapper: { width: '100%' },
    partnerNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    partnerNameText: { fontFamily: 'Roboto_700Bold', fontSize: 15, color: '#2D3748' },
    distanceBadge: { backgroundColor: '#FFF0E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    distanceText: { fontFamily: 'Roboto_700Bold', fontSize: 10, color: '#F25C05' },
    partnerRegionText: { fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#718096', marginTop: 6 },
    partnerDemandText: { fontFamily: 'Roboto_500Medium', fontSize: 11, color: '#4A5568', marginTop: 4, backgroundColor: '#F7FAFC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
    whatsappButton: { backgroundColor: '#10B981', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 12, marginTop: 14 },
    waIconImage: { width: 16, height: 16, marginRight: 8, tintColor: '#FFFFFF' },
    waButtonText: { fontFamily: 'Roboto_700Bold', fontSize: 13, color: '#FFFFFF' },
    navbarContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 88, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around', borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 20 },
    navItem: { alignItems: 'center', justifyContent: 'flex-end', flex: 1, height: 66, paddingBottom: 12 },
    navIconImage: { width: 22, height: 22, marginBottom: 4 },
    centerNavWrapper: { alignItems: 'center', justifyContent: 'flex-end', width: 75, height: 66, paddingBottom: 12, position: 'relative' },
    centerNavButton: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -28, borderWidth: 4, borderColor: '#F5F7FA', shadowColor: '#F25C05', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 8 },
    navLabel: { fontFamily: 'Roboto_500Medium', fontSize: 10, color: '#999999' },
    navLabelActive: { color: '#F25C05', fontFamily: 'Roboto_700Bold' },
    centerNavIconImage: { width: 30, height: 30 }
});