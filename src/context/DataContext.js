import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebaseConfig';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState('Peternak');
    const [loadingData, setLoadingData] = useState(true);
    const [isSimulationMode, setIsSimulationMode] = useState(false);
    const [isAutomaticMode, setIsAutomaticMode] = useState(false);

    const [sensorData, setSensorData] = useState({ suhuUdara: 0, kelembapan: 0, suhuAir: 0, cahaya: 0 });
    const [actuatorStatus, setActuatorStatus] = useState({ lampu: false, kipas: false, buzzer: false });

    const latestSensorData = useRef({ suhuUdara: 0, kelembapan: 0, suhuAir: 0, cahaya: 0 });
    const prevActuatorStatus = useRef({ lampu: false, kipas: false, buzzer: false });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const storedName = await AsyncStorage.getItem('userName');
                const savedSim = await AsyncStorage.getItem('isSimulationMode');
                const savedAuto = await AsyncStorage.getItem('isAutomaticMode');

                if (storedName) setUserEmail(storedName);
                if (savedSim !== null) setIsSimulationMode(savedSim === 'true');
                if (savedAuto !== null) setIsAutomaticMode(savedAuto === 'true');
            } catch (error) {
                console.log("Error memuat storage di DataContext:", error);
            }
        };
        loadInitialData();
    }, []);

    const handleToggleSimulation = async (value) => {
        setIsSimulationMode(value);
        await AsyncStorage.setItem('isSimulationMode', value.toString());
    };

    const handleToggleAutomatic = async (value) => {
        setIsAutomaticMode(value);
        await AsyncStorage.setItem('isAutomaticMode', value.toString());
    };

    // --- FIX FITUR LOGOUT TERPUSAT: MEMATIKAN STREAMING BACKGROUND SECARA PAKSA ---
    const handleLogoutContext = async () => {
        try {
            // 1. Matikan semua mode simulasi & otomatis agar loop interval berhenti seketika
            setIsSimulationMode(false);
            setIsAutomaticMode(false);

            // 2. Reset semua data state kembali ke posisi kosongan awal
            setUserEmail('Peternak');
            setSensorData({ suhuUdara: 0, kelembapan: 0, suhuAir: 0, cahaya: 0 });
            setActuatorStatus({ lampu: false, kipas: false, buzzer: false });
            prevActuatorStatus.current = { lampu: false, kipas: false, buzzer: false };

            // 3. Bersihkan sisa sesi penyimpanan lokal HP
            await AsyncStorage.clear();
            console.log("[CONTEXT LOGOUT] Sesi dihapus & background streaming dihentikan.");
        } catch (error) {
            console.log("Gagal melakukan pembersihan data context logout:", error);
        }
    };

    const writeLogHistory = async (field, value, isAutoTriggered = false, currentSensor) => {
        try {
            const sekarang = new Date();
            const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            const tanggalStr = `${sekarang.getDate()}_${namaBulan[sekarang.getMonth()]}_${sekarang.getFullYear()}`;

            const cleanUserName = userEmail.replace(/\s+/g, '').toLowerCase();
            const idDokumenLog = `${cleanUserName}_${tanggalStr}`;

            let judulLog = '';
            let tipeLog = value ? 'warning' : 'neutral';

            if (field === 'lampu') judulLog = `Lampu Pemanas ${value ? 'ON' : 'OFF'}`;
            if (field === 'kipas') judulLog = `Kipas Ventilasi ${value ? 'ON' : 'OFF'}`;
            if (field === 'buzzer') {
                judulLog = `Buzzer Alarm ${value ? 'ON' : 'OFF'}`;
                tipeLog = value ? 'danger' : 'neutral';
            }

            const pembuatAksi = isAutoTriggered ? "Sistem Otomatis" : `Manual oleh ${userEmail}`;
            const sUdara = currentSensor?.suhuUdara ?? 0;
            const sAir = currentSensor?.suhuAir ?? 0;

            const logBaru = {
                id: Date.now(),
                waktu: sekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                tipe: tipeLog,
                judul: judulLog,
                pesan: `Perangkat diubah [${pembuatAksi}]. Parameter saat ini -> Udara: ${sUdara}°C, Air: ${sAir}°C`,
                fieldTarget: field
            };

            await setDoc(doc(db, 'log_system', idDokumenLog), {
                data_riwayat: arrayUnion(logBaru),
                user: userEmail,
                tanggal: tanggalStr
            }, { merge: true });
        } catch (err) {
            console.log("Gagal menulis log_system:", err);
        }
    };

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

                const currentSimulatedSensor = {
                    suhuUdara: randSuhuUdara,
                    kelembapan: randKelembapan,
                    suhuAir: randSuhuAir,
                    cahaya: randCahaya
                };

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

                        if (nextLampu !== prevActuatorStatus.current.lampu) {
                            await writeLogHistory('lampu', nextLampu, true, currentSimulatedSensor);
                        }
                        if (nextKipas !== prevActuatorStatus.current.kipas) {
                            await writeLogHistory('kipas', nextKipas, true, currentSimulatedSensor);
                        }
                        if (nextBuzzer !== prevActuatorStatus.current.buzzer) {
                            await writeLogHistory('buzzer', nextBuzzer, true, currentSimulatedSensor);
                        }

                        prevActuatorStatus.current = { lampu: nextLampu, kipas: nextKipas, buzzer: nextBuzzer };
                        await setDoc(actuatorDocRef, prevActuatorStatus.current, { merge: true });
                    }
                } catch (error) {
                    console.log("Error mesin simulasi loop:", error);
                }
            }, 3000);
        }

        const unsubscribeSensor = onSnapshot(sensorDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                const currentSuhu = data.suhu_udara || 0;
                const newSensorState = {
                    suhuUdara: currentSuhu,
                    kelembapan: data.kelembapan || 0,
                    suhuAir: data.suhu_air || 0,
                    cahaya: data.cahaya || 0,
                };

                setSensorData(newSensorState);
                latestSensorData.current = newSensorState;

                if (isAutomaticMode && !isSimulationMode) {
                    const nextLampu = currentSuhu < 37.0;
                    const nextKipas = currentSuhu >= 37.0;
                    const nextBuzzer = currentSuhu > 37.8;

                    if (nextLampu !== prevActuatorStatus.current.lampu) {
                        writeLogHistory('lampu', nextLampu, true, newSensorState);
                    }
                    if (nextKipas !== prevActuatorStatus.current.kipas) {
                        writeLogHistory('kipas', nextKipas, true, newSensorState);
                    }
                    if (nextBuzzer !== prevActuatorStatus.current.buzzer) {
                        writeLogHistory('buzzer', nextBuzzer, true, newSensorState);
                    }

                    prevActuatorStatus.current = { lampu: nextLampu, kipas: nextKipas, buzzer: nextBuzzer };
                    updateDoc(actuatorDocRef, prevActuatorStatus.current).catch(e => console.log(e));
                }
            }
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
                prevActuatorStatus.current = currentStatus;
                setActuatorStatus(currentStatus);
            }
        });

        return () => {
            if (simulationInterval) clearInterval(simulationInterval);
            unsubscribeSensor();
            unsubscribeActuator();
        };
    }, [isSimulationMode, isAutomaticMode, userEmail]);

    const handleToggleActuator = async (type, currentStatus) => {
        if (isAutomaticMode) return;
        const targetStatus = !currentStatus;
        try {
            prevActuatorStatus.current = { ...prevActuatorStatus.current, [type]: targetStatus };
            await updateDoc(doc(db, 'status_aktuator', 'inkubator_01'), { [type]: targetStatus });
            await writeLogHistory(type, targetStatus, false, latestSensorData.current);
        } catch (error) {
            console.log("Gagal mengubah aktuator:", error);
        }
    };

    return (
        <DataContext.Provider value={{
            sensorData, actuatorStatus, isSimulationMode, isAutomaticMode, userEmail, setUserEmail, loadingData,
            handleToggleSimulation, handleToggleAutomatic, handleToggleActuator, handleLogoutContext // <--- Ekspor fungsi ini
        }}>
            {children}
        </DataContext.Provider>
    );
};