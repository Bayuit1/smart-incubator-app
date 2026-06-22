# E-NDOG - Smart Incubator Mobile Application 

**E-NDOG** adalah aplikasi komputasi bergerak (*mobile computing*) berbasis **React Native (Expo)** yang dirancang khusus untuk memantau (*monitoring*) parameter telemetri dan mengendalikan (*controlling*) perangkat aktuator pada inkubator penetasan telur pintar secara *real-time*. Berkas dokumentasi ini disusun untuk memenuhi luaran Ujian Praktikum Mobile Computing Semester Genap 2025-2026.

---

## Kelompok & Tabel Pembagian Tugas

Berikut adalah detail pembagian peran dan tanggung jawab pengerjaan proyek, yang dibuktikan melalui riwayat komit (*commit history*) pada repositori Git ini:

| Nama Anggota Tim | Peran / Jobdesk | Tanggapan & Tanggung Jawab Kode|
| :--- | :--- | :--- |
| **Bayu Isnanta Trisna** | **0923040052**: UI/UX & State Specialist| Merancang seluruh layout aplikasi, memastikan kelancaran navigasi, serta mengelola aliran data telemetri menggunakan arsitektur Global State Management Context API. |
| **Galang Eka Dharma** | **0923040049**: API & Network Specialist| Mengintegrasikan layanan pihak ketiga menggunakan Axios, melakukan parsing data JSON, dan mengelola penanganan kesalahan (*error handling*) jaringan. |
| **Fahrul Bentar Margi Santoso** | **0923040037**: Cloud Database & Auth Specialist| Melakukan konfigurasi SDK Firebase, mengimplementasikan sistem Autentikasi/Sesi login, serta merancang arsitektur NoSQL Cloud Firestore. |

---

## 🛠️ Daftar API & Layanan Backend-as-a-Service

Sesuai ketentuan teknis, aplikasi ini mengintegrasikan tiga pilar arsitektur data eksternal:
1.  **Layanan Firebase (Backend-as-a-Service):** Menggunakan *Cloud Firestore* untuk sinkronisasi telemetri sensor, manajemen status aktuator, dan pencatatan riwayat sistem.
2.  **Layanan REST API Eksternal (Axios HTTP Client):** Menggunakan *OpenWeatherMap API* untuk melacak parameter cuaca makro di sekitar lokasi fisik kandang secara *real-time*.
3.  **Custom REST API Server (Node.js):** API buatan sendiri yang berjalan di server Node.js lokal (Port 3000) untuk menyediakan data dinamis komoditas pangan via endpoint `/api/harga` dan lokasi koordinat pengepul via endpoint `/api/tengkulak-sekitar`.

---

## 🎯 3 Fitur Utama untuk Pendemokan Ujian

Berikut adalah 3 fitur utama pilihan yang akan didemokan alur kodenya oleh masing-masing saat penilaian individuaL:

### 1. Fitur 1: Dasbor Monitoring & Controlling Berbasis State Global (Demo: Anggota 1)
*   **Deskripsi:** Antarmuka utama untuk memantau data sensor (Suhu Udara, Kelembapan, Suhu Air, Cahaya) dan mengontrol 3 aktuator (Lampu Pemanas, Kipas Ventilasi, Buzzer).
*   **Alur Kode yang Dijelaskan:** Mekanisme penayangan data visual komponen kustom, alur perpindahan navigasi *Bottom Navbar*, dan arsitektur pengaliran data tanpa putus di latar belakang (*background streaming*) menggunakan **React Context API**.
*   **Kompleksitas UX:** Menyediakan fitur interaktif di mana tombol kendali manual akan otomatis mengunci ketika sistem dialihkan ke Mode Kerja Otomatis untuk mencegah bentrok perintah pada hardware.

### 2. Fitur 2: Sistem Pantauan Cuaca Luar Ruangan & Mitigasi Dini (Demo: Anggota 2)
*   **Deskripsi:** Layangan informasi cuaca eksternal yang terintegrasi secara modular untuk memberikan saran mitigasi suhu inkubator kepada peternak.
*   **Alur Kode yang Dijelaskan:** Mekanisme penembakan HTTP Request asinkronus menggunakan **Axios**, teknik ekstraksi objek properti (*parsing data JSON*), serta manajemen proteksi *error handling* jika jaringan terputus atau mengalami *timeout*.

### 3. Fitur 3: Logging Aktivitas Cerdas Terisolasi Multi-User (Demo: Anggota 3)
*   **Deskripsi:** Sistem perekaman jejak performa alat otomatis/manual yang terintegrasi dengan penyeleksi tanggal kustom `FullDatePicker`.
*   **Alur Kode yang Dijelaskan:** Inisialisasi konfigurasi SDK Firebase, manajemen retensi sesi login aktif (*Auto-Login*) berbasis penanda token di **AsyncStorage**, serta penerapan aturan keamanan (*security rules*) Firestore lewat skema pemisahan ID dokumen unik `username_tanggal` agar data log antar peternak tidak saling bercampur.

---

## 💻 Langkah Instalasi Lokal

1.  **Clone Repositori:**
```bash
    git clone [https://github.com/username/repository-kamu.git](https://github.com/username/repository-kamu.git)
    cd nama-folder-proyek
    ```
2.  **Instalasi Dependensi Paket:**
```bash
    npm install
    ```
3.  **Jalankan Project via Expo Go:**
```bash
    npx expo start
    ```
