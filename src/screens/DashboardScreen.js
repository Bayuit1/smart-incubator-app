import React, { useState, useEffect, useRef } from 'react';

import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, Image, Dimensions, Alert, ActivityIndicator, Switch } from 'react-native';

import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';



// --- IMPORT FIREBASE AUTH & FIRESTORE ---

import { auth, db } from '../config/firebaseConfig';

import { signOut, onAuthStateChanged } from 'firebase/auth';

import { doc, onSnapshot, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';



const { width } = Dimensions.get('window');



export default function DashboardScreen({ navigation, route }) {

    const [activeTab, setActiveTab] = useState('dashboard');

    const [userEmail, setUserEmail] = useState('Peternak');

    const [loadingData, setLoadingData] = useState(true);

    const [isSimulationMode, setIsSimulationMode] = useState(false);

    const [isAutomaticMode, setIsAutomaticMode] = useState(false);



    // State Sensor (Dicocokkan dengan Key di Firestore)

    const [sensorData, setSensorData] = useState({

        suhuUdara: 0,

        kelembapan: 0,

        suhuAir: 0,

        cahaya: 0,

    });



    // State Aktuator (Dicocokkan dengan Key di Firestore)

    const [actuatorStatus, setActuatorStatus] = useState({

        lampu: false,

        kipas: false,

        buzzer: false

    });



    // Ref untuk menyimpan status aktuator sebelumnya (Mencegah spamming log pada mode otomatis)

    const prevActuatorStatus = useRef({ lampu: false, kipas: false, buzzer: false });



    // --- SYNC PROFIL USER ---

// --- SYNC PROFIL USER ---
useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user && user.email) {
            // Mengambil nama dari email akun yang login
            const rawName = user.email.split('@')[0];
            const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
            setUserEmail(formattedName);
        } else {
            // Hapus atau kosongkan jika tidak ada user login
            setUserEmail('Peternak'); 
            console.log("Tidak ada user yang login");
        }
    });
    return () => unsubscribeAuth();
}, []); // Dependency array kosong agar hanya jalan saat komponen pertama kali dimuat



    // --- FUNGSI AUTO LOG SYSTEM ---

// --- FUNGSI AUTO LOG SYSTEM ---
const writeLogHistory = async (field, value, isAutoTriggered = false) => {
    try {
        const sekarang = new Date();
        const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        
        // Format tanggal: 21_Juni_2026
        const tanggalStr = `${sekarang.getDate()}_${namaBulan[sekarang.getMonth()]}_${sekarang.getFullYear()}`;
        
        // Membuat ID dokumen dengan format: nama_tanggal
        // Kita menggunakan state 'userEmail' yang sudah ada di komponen Anda
        const idDokumenLog = `${userEmail.toLowerCase()}_${tanggalStr}`;

        let judulLog = '';
        let tipeLog = value ? 'warning' : 'neutral';
        
        if (field === 'lampu') judulLog = `Lampu Pemanas ${value ? 'ON' : 'OFF'}`;
        if (field === 'kipas') judulLog = `Kipas Ventilasi ${value ? 'ON' : 'OFF'}`;
        if (field === 'buzzer') {
            judulLog = `Buzzer Alarm ${value ? 'ON' : 'OFF'}`;
            tipeLog = value ? 'danger' : 'neutral';
        }

        const pembuatAksi = isAutoTriggered ? "Sistem Otomatis" : `Manual oleh ${userEmail}`;

        const logBaru = {
            id: Date.now(),
            waktu: sekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            tipe: tipeLog,
            judul: judulLog,
            pesan: `Perangkat diubah [${pembuatAksi}]. Parameter saat ini -> Udara: ${sensorData.suhuUdara}°C, Air: ${sensorData.suhuAir}°C`,
            fieldTarget: field
        };

        // Path ke dokumen dengan ID spesifik per user per hari
        const logDocRef = doc(db, 'log_system', idDokumenLog);
        
        await setDoc(logDocRef, {
            data_riwayat: arrayUnion(logBaru),
            // Tambahkan field opsional untuk mempermudah pencarian/filter di masa depan
            user: userEmail,
            tanggal: tanggalStr
        }, { merge: true });
        
    } catch (err) {
        console.log("Gagal menulis log_system:", err);
    }
};



    // --- MONITORING DATA REAL-TIME & SIMULASI ---

    useEffect(() => {

        const sensorDocRef = doc(db, 'data_sensor', 'inkubator_01');

        const actuatorDocRef = doc(db, 'status_aktuator', 'inkubator_01');



        let simulationInterval = null;



        if (isSimulationMode) {

            setLoadingData(false);

            simulationInterval = setInterval(async () => {

                const randSuhuUdara = parseFloat((35 + Math.random() * 3).toFixed(1));

                const randKelembapan = Math.floor(52 + Math.random() * 6);          

                const randSuhuAir = parseFloat((34 + Math.random() * 3).toFixed(1));  

                const randCahaya = Math.floor(420 + Math.random() * 40);            



                try {

                    await setDoc(sensorDocRef, {

                        suhu_udara: randSuhuUdara,

                        kelembapan: randKelembapan,

                        suhu_air: randSuhuAir,

                        cahaya: randCahaya,

                    }, { merge: true });



                    if (isAutomaticMode) {

                        const nextLampu = randSuhuUdara < 37.0;

                        const nextKipas = randSuhuUdara >= 37.0;

                        const nextBuzzer = randSuhuUdara > 37.8;



                        await setDoc(actuatorDocRef, {

                            lampu: nextLampu,

                            kipas: nextKipas,

                            buzzer: nextBuzzer

                        }, { merge: true });

                    }

                } catch (error) {

                    console.log("Gagal push simulasi ke Firestore:", error);

                }

            }, 3000);

        }



        // --- AMBIL DATA DARI FIRESTORE SECARA REAL-TIME ---

        const unsubscribeSensor = onSnapshot(sensorDocRef, (snapshot) => {

            if (snapshot.exists()) {

                const data = snapshot.data();

                const currentSuhu = data.suhu_udara || 0;



                setSensorData({

                    suhuUdara: currentSuhu,

                    kelembapan: data.kelembapan || 0,

                    suhuAir: data.suhu_air || 0,

                    cahaya: data.cahaya || 0,

                });



                if (isAutomaticMode && !isSimulationMode) {

                    updateDoc(actuatorDocRef, {

                        lampu: currentSuhu < 37.0,

                        kipas: currentSuhu >= 37.0,

                        buzzer: currentSuhu > 37.8

                    }).catch(e => console.log(e));

                }

            }

            setLoadingData(false);

        }, (error) => {

            console.log("Error Sensor Snapshot:", error);

            setLoadingData(false);

        });



        const unsubscribeActuator = onSnapshot(actuatorDocRef, (snapshot) => {

            if (snapshot.exists()) {

                const data = snapshot.data();

                const currentStatus = {

                    lampu: data.lampu ?? false,

                    kipas: data.kipas ?? false,

                    buzzer: data.buzzer ?? false,

                };



                // Cek perubahan status untuk pencatatan Log Otomatis

                if (isAutomaticMode) {

                    if (currentStatus.lampu !== prevActuatorStatus.current.lampu) {

                        writeLogHistory('lampu', currentStatus.lampu, true);

                    }

                    if (currentStatus.kipas !== prevActuatorStatus.current.kipas) {

                        writeLogHistory('kipas', currentStatus.kipas, true);

                    }

                    if (currentStatus.buzzer !== prevActuatorStatus.current.buzzer) {

                        writeLogHistory('buzzer', currentStatus.buzzer, true);

                    }

                }



                // Perbarui data penanda status sebelumnya

                prevActuatorStatus.current = currentStatus;

                setActuatorStatus(currentStatus);

            }

        }, (error) => {

            console.log("Error Actuator Snapshot:", error);

        });



        return () => {

            if (simulationInterval) clearInterval(simulationInterval);

            unsubscribeSensor();

            unsubscribeActuator();

        };

    }, [isSimulationMode, isAutomaticMode]);





    // --- KENDALI SAKELAR MANUAL AKTUATOR ---

    const handleToggleActuator = async (type, currentStatus) => {

        if (isAutomaticMode) {

            Alert.alert(

                "Mode Otomatis Aktif",

                "Matikan 'Mode Kerja Otomatis' terlebih dahulu untuk mengontrol perangkat secara manual."

            );

            return;

        }



        const actuatorDocRef = doc(db, 'status_aktuator', 'inkubator_01');

        const targetStatus = !currentStatus;

        try {

            await updateDoc(actuatorDocRef, {

                [type]: targetStatus

            });

            // Tulis Log Aksi Manual

            await writeLogHistory(type, targetStatus, false);

        } catch (error) {

            Alert.alert('Gagal', 'Tidak dapat terhubung ke database.');

            console.error(error);

        }

    };



    const handleLogout = () => {

        Alert.alert('Keluar Akun', 'Apakah Anda yakin ingin keluar?', [

            { text: 'Batal', style: 'cancel' },

            {

                text: 'Keluar',

                style: 'destructive',

                onPress: async () => {

                    await signOut(auth);

                    navigation.replace('Login');

                }

            }

        ]);

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

                        onValueChange={() => setIsSimulationMode(!isSimulationMode)}

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

                        onValueChange={() => setIsAutomaticMode(!isAutomaticMode)}

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

                            >

                                <View style={styles.actuatorLeftRow}>

                                    <Image source={require('../../assets/icons/ventilasi.png')} style={styles.actuatorIconImage} resizeMode="contain" />

                                    <Text style={styles.actuatorName}>Kipas Ventilasi (Servo)</Text>

                                </View>

                                <View style={[styles.badgeContainer, actuatorStatus.kipas ? styles.badgeActive : styles.badgeInactive]}>

                                    <Text style={[styles.statusText, actuatorStatus.kipas ? styles.textActive : styles.textInactive]}>

                                        {actuatorStatus.kipas ? 'ON' : 'OFF'}

                                    </Text>

                                </View>

                            </TouchableOpacity>



                            {/* Baris Buzzer */}

                            <TouchableOpacity

                                style={styles.actuatorRow}

                                onPress={() => handleToggleActuator('buzzer', actuatorStatus.buzzer)}

                                activeOpacity={isAutomaticMode ? 1 : 0.7}

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