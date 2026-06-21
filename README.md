# E-NDOG - Smart Incubator Mobile Application 🥚📱

**E-NDOG** adalah aplikasi komputasi bergerak (*mobile computing*) berbasis **React Native (Expo)** yang dirancang untuk melakukan pemantauan (*monitoring*) parameter lingkungan serta pengendalian (*controlling*) aktuator pada sistem inkubator penetasan telur cerdas secara *real-time*.

Aplikasi ini menggunakan arsitektur **Global State Management (Context API)** untuk memastikan proses simulasi data dan logika otomatisasi perangkat tetap berjalan konstan di latar belakang (*background streaming*) meskipun pengguna sedang berpindah halaman.

---

## 🚀 Fitur Utama

*   **Autentikasi & Manajemen Sesi Lokal:** Sistem pendaftaran akun dan masuk secara aman melalui Firestore, dilengkapi dengan retensi sesi otomatis (*Auto-Login*) menggunakan `AsyncStorage`.
*   **Global Background Streaming:** Pemantauan data IoT yang abadi di latar belakang menggunakan React Context API, mencegah mesin simulasi terputus saat bernavigasi.
*   **Telemetri Sensor Real-Time:** Monitoring parameter krusial inkubator secara instan melalui *real-time snapshot listener* Firebase Firestore:
    *   Suhu Udara (°C) - Sensor DHT22
    *   Kelembapan (%) - Sensor DHT22
    *   Suhu Air (°C) - Sensor DS18B20
    *   Intensitas Cahaya (LxF) - Sensor LDR
*   **Dual-Mode Kendali Aktuator:** 
    *   *Mode Manual:* Mengontrol status sakelar Lampu Pemanas, Kipas Ventilasi (Servo), dan Buzzer secara mandiri.
    *   *Mode Otomatis:* Otomatisasi berbasis aturan (*rule-based*) yang mengunci kendali manual dan menyesuaikan aktuator secara mandiri berdasarkan ambang batas sensor.
*   **Sistem Log Aktivitas Terpusat:** Pencatatan riwayat aktivitas alat otomatis/manual yang dikelompokkan secara dinamis berdasarkan kombinasi `username_tanggal` menggunakan komponen kustom modular `FullDatePicker`.
*   **Integrasi REST API Eksternal (Axios):**
    *   *Sistem Cuaca:* Sinkronisasi data satelit OpenWeatherMap untuk sistem mitigasi dini kondisi sekitar kandang.
    *   *Watch Market:* Pemantauan tren perkembangan harga telur mingguan disertai kalkulator estimasi omset proyeksi panen.
    *   *Radar Mitra:* Pemetaan jaringan tengkulak terdekat memanfaatkan Algoritma Jarak Haversine dan komponen kustom `RadarMap`.

---

## Spesifikasi Teknologi

| Teknologi / Library | Kegunaan |
| :--- | :--- |
| **React Native (Expo SDK)** | Framework utama pengembangan aplikasi cross-platform |
| **React Navigation** | Manajemen perpindahan antar halaman Stack & Native Screens |
| **Firebase Firestore** | Database NoSQL *real-time* untuk penyimpanan data sensor, aktuator, & log |
| **React Context API** | Manajemen state global dan background processor |
| **Axios** | HTTP Client untuk integrasi REST API eksternal |
| **Async Storage** | Penyimpanan persistensi sesi login dan konfigurasi switch mode |
| **Expo Fonts (Roboto)** | Penataan tipografi antarmuka visual aplikasi |

---

## Struktur Skema Firestore Database

Aplikasi E-NDOG beroperasi di atas 4 rumpun koleksi utama pada Firebase Firestore:

### 1. `users` (Koleksi Data Pengguna)
```json
{
  "name": "Bayu Isnanta",
  "email": "bayu@example.com",
  "password": "plain_text_password",
  "createdAt": "2026-06-21T15:00:00.000Z"
}
