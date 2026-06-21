import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, StatusBar, Image, Dimensions } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

const { width } = Dimensions.get('window');

export default function HargaScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('harga');
    const [selectedEgg, setSelectedEgg] = useState('ras'); // Pilihan: ras, kampung, bebek
    const [eggQuantity, setEggQuantity] = useState(''); // State untuk input jumlah telur

    // Data harga komoditas telur hari ini (Simulasi Harga Pasar)
    const eggPrices = {
        ras: { nama: 'Telur Ayam Ras', harga: 28000, satuan: 'kg', tren: 'Meningkat', history: [40, 55, 65, 60, 85] },
        kampung: { nama: 'Telur Ayam Kampung', harga: 2500, satuan: 'butir', tren: 'Stabil', history: [70, 70, 65, 75, 70] },
        bebek: { nama: 'Telur Bebek', harga: 3200, satuan: 'butir', tren: 'Menurun', history: [90, 80, 75, 65, 55] }
    };

    // Logika kalkulator perhitungan omset otomatis
    const hitungOmset = () => {
        const jumlah = parseInt(eggQuantity) || 0;
        const hargaSatuan = eggPrices[selectedEgg].harga;
        return (jumlah * hargaSatuan).toLocaleString('id-ID');
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

            {/* Header Utama */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerBrand}>E-NDOG MARKET WATCH</Text>
                    <Text style={styles.headerTitle}>Harga Pasar & Estimasi</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} clipToPadding={false}>

                {/* 1. KARTU MONITORING HARGA HARI INI */}
                <Text style={styles.sectionTitle}>Harga Pasar Hari Ini</Text>
                <View style={styles.eggSelectorRow}>
                    {Object.keys(eggPrices).map((key) => {
                        const isSelected = selectedEgg === key;
                        return (
                            <TouchableOpacity
                                key={key}
                                style={[styles.eggTabCard, isSelected && styles.eggTabCardActive]}
                                onPress={() => setSelectedEgg(key)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.eggTabName, isSelected && styles.eggTabNameActive]}>
                                    {eggPrices[key].nama}
                                </Text>
                                <Text style={[styles.eggTabPrice, isSelected && styles.eggTabPriceActive]}>
                                    Rp {eggPrices[key].harga.toLocaleString('id-ID')}
                                </Text>
                                <Text style={[styles.eggTabUnit, isSelected && styles.eggTabUnitActive]}>
                                    per {eggPrices[key].satuan}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* 2. GRAFIK TREN HARGA MINGGUAN */}
                <Text style={styles.sectionTitle}>Tren Perkembangan Harga (5 Minggu Terakhir)</Text>
                <View style={styles.chartContainer}>
                    <View style={styles.chartHeaderRow}>
                        <Text style={styles.chartSubTitle}>Komoditas: {eggPrices[selectedEgg].nama}</Text>
                        <Text style={[
                            styles.trendLabelText,
                            eggPrices[selectedEgg].tren === 'Meningkat' && styles.textTrendUp,
                            eggPrices[selectedEgg].tren === 'Stabil' && styles.textTrendStable,
                            eggPrices[selectedEgg].tren === 'Menurun' && styles.textTrendDown,
                        ]}>
                            Status: {eggPrices[selectedEgg].tren}
                        </Text>
                    </View>

                    {/* Render Grafik Batang Sejarah Harga */}
                    <View style={styles.chartFrame}>
                        {eggPrices[selectedEgg].history.map((val, idx) => (
                            <View key={idx} style={styles.chartCol}>
                                <View style={[styles.chartBar, { height: `${val}%` }]} />
                                <Text style={styles.chartXLabel}>Mgg {idx + 1}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 3. KALKULATOR ESTIMASI OMSET PENJUALAN */}
                <Text style={styles.sectionTitle}>Kalkulator Proyeksi Omset Panen</Text>
                <View style={styles.calculatorCard}>
                    <Text style={styles.calcLabel}>Masukkan Jumlah Hasil Panen Menetas</Text>

                    <View style={styles.inputWrapperRow}>
                        <TextInput
                            style={styles.calcInput}
                            keyboardType="numeric"
                            placeholder="Contoh: 150"
                            placeholderTextColor="#A0AEC0"
                            value={eggQuantity}
                            onChangeText={setEggQuantity}
                        />
                        <View style={styles.inputUnitBadge}>
                            <Text style={styles.inputUnitText}>{eggPrices[selectedEgg].satuan}</Text>
                        </View>
                    </View>

                    <View style={styles.resultDivider} />

                    <View style={styles.resultWrapperRow}>
                        <Text style={styles.resultLabel}>Estimasi Total Pendapatan:</Text>
                        <Text style={styles.resultValueText}>Rp {hitungOmset()}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Navbar (Sinkron dengan nama file aset Anda) */}
            <View style={styles.navbarContainer}>
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

                <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('harga')}>
                    <Image source={require('../../assets/icons/harga.png')} style={styles.navIconImage} resizeMode="contain" />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Harga</Text>
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
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 6,
    },
    headerBrand: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#FFE0CC', letterSpacing: 1 },
    headerTitle: { fontFamily: 'Roboto_700Bold', fontSize: 18, color: '#FFFFFF', marginTop: 1 },

    scrollContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 160 },
    sectionTitle: { fontFamily: 'Roboto_700Bold', fontSize: 15, color: '#2D3748', marginBottom: 12, marginTop: 14 },

    // Style Selector Grid Atas
    eggSelectorRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    eggTabCard: { backgroundColor: '#FFFFFF', width: (width - 68) / 3, padding: 12, borderRadius: 16, elevation: 1, alignItems: 'center' },
    eggTabCardActive: { backgroundColor: '#F25C05', elevation: 4, shadowColor: '#F25C05', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },
    eggTabName: { fontFamily: 'Roboto_500Medium', fontSize: 10, color: '#718096', textAlign: 'center', height: 28 },
    eggTabNameActive: { color: '#FFE0CC', fontFamily: 'Roboto_700Bold' },
    eggTabPrice: { fontFamily: 'Roboto_700Bold', fontSize: 13, color: '#2D3748', marginTop: 6 },
    eggTabPriceActive: { color: '#FFFFFF' },
    eggTabUnit: { fontFamily: 'Roboto_400Regular', fontSize: 9, color: '#A0AEC0', marginTop: 2 },
    eggTabUnitActive: { color: '#FFF0E6' },

    // Style Grafik Tren
    chartContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, elevation: 1 },
    chartHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderColor: '#F7FAFC', paddingBottom: 10 },
    chartSubTitle: { fontFamily: 'Roboto_500Medium', fontSize: 12, color: '#4A5568' },
    trendLabelText: { fontFamily: 'Roboto_700Bold', fontSize: 11 },
    textTrendUp: { color: '#10B981' },
    textTrendStable: { color: '#3182CE' },
    textTrendDown: { color: '#E63946' },
    chartFrame: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 100, width: '100%', paddingTop: 10 },
    chartCol: { alignItems: 'center', flex: 1 },
    chartBar: { width: 14, backgroundColor: '#F25C05', borderTopLeftRadius: 4, borderTopRightRadius: 4, opacity: 0.8 },
    chartXLabel: { fontSize: 9, fontFamily: 'Roboto_400Regular', color: '#A0AEC0', marginTop: 8 },

    // Style Card Kalkulator Penjualan
    calculatorCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, elevation: 1 },
    calcLabel: { fontFamily: 'Roboto_500Medium', fontSize: 13, color: '#4A5568', marginBottom: 10 },
    inputWrapperRow: { flexDirection: 'row', width: '100%', height: 48, borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, overflow: 'hidden' },
    calcInput: { flex: 1, paddingHorizontal: 14, fontSize: 15, fontFamily: 'Roboto_500Medium', color: '#2D3748', backgroundColor: '#FFFFFF' },
    inputUnitBadge: { backgroundColor: '#EDF2F7', width: 60, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: '#E2E8F0' },
    inputUnitText: { fontFamily: 'Roboto_700Bold', fontSize: 12, color: '#4A5568' },
    resultDivider: { height: 1, backgroundColor: '#EDF2F7', marginVertical: 16 },
    resultWrapperRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    resultLabel: { fontFamily: 'Roboto_500Medium', fontSize: 13, color: '#718096' },
    resultValueText: { fontFamily: 'Roboto_700Bold', fontSize: 18, color: '#F25C05' },

    navbarContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 88, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around', borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 20 },
    navItem: { alignItems: 'center', justifyContent: 'flex-end', flex: 1, height: 66, paddingBottom: 12 },
    navIconImage: { width: 22, height: 22, marginBottom: 4 },
    centerNavWrapper: { alignItems: 'center', justifyContent: 'flex-end', width: 75, height: 66, paddingBottom: 12, position: 'relative' },
    centerNavButton: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -28, borderWidth: 4, borderColor: '#F5F7FA', shadowColor: '#F25C05', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 8 },
    navLabel: { fontFamily: 'Roboto_500Medium', fontSize: 10, color: '#999999' },
    navLabelActive: { color: '#F25C05', fontFamily: 'Roboto_700Bold' },
    centerNavIconImage: { width: 30, height: 30 }
});