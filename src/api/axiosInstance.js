// File: src/api/axiosInstance.js
import axios from 'axios';

// Membuat instance axios global
const axiosInstance = axios.create({
  // Tetapkan setelan Base URL (Ganti dengan URL API utama aplikasi Anda)
  baseURL: 'https://api.domain-utama-aplikasi.com',
  
  // Batas waktu tunggu permintaan (Timeout) dalam milidetik (misal: 10.000 ms = 10 detik)
  timeout: 10000,
  
  // Enkapsulasi Headers global agar seragam di setiap layar
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Tambahkan header lain jika perlu (misalnya token autentikasi)
    // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
});

export default axiosInstance;