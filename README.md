# Magang - Frontend

Aplikasi ini menampilkan informasi wisata, budaya, kuliner, sejarah, dan UMKM, serta menyediakan login, pemesanan tiket, dan halaman pengelola. Data dan autentikasi menggunakan API dari repository backend Laravel.

## Persyaratan

- Node.js 20.19+ atau 22.12+.
- npm.
- Backend Laravel Magang Contoh sudah disiapkan dan dapat dijalankan. Ikuti README repository backend untuk instalasi PHP, Composer, database, dan seeder.
- Git.

## Setup lokal

1. Clone repository frontend dan masuk ke folder project. Ganti URL berikut dengan URL repository frontend tim:
   ```bash
   git clone https://github.com/naylafitiaarwani/Magang-frontendv2.git
   cd Magang-frontendv2
   ```
2. Pasang dependency frontend:

   ```bash
   npm install
   ```

3. Jalankan backend Laravel di terminal terpisah. Secara default, frontend mengakses backend di `http://127.0.0.1:8000` dan API di `http://127.0.0.1:8000/api`. Jalankan pemeriksaan backend di `http://127.0.0.1:8000/api/health-check`.

   > Saat ini alamat backend ditulis langsung di source frontend. `VITE_API_BASE_URL` belum digunakan; jika backend berjalan di alamat lain, alamat Laravel perlu disesuaikan pada konfigurasi API dan konstanta URL yang digunakan halaman/komponen.

4. (Opsional) Untuk menguji pembayaran Midtrans, buat file `.env.local` di folder frontend:

   ```dotenv
   VITE_MIDTRANS_CLIENT_KEY=isi_client_key_sandbox
   ```

   Isi `MIDTRANS_SERVER_KEY` dan `MIDTRANS_CLIENT_KEY` backend pada `.env` Laravel. Jangan masukkan server key, kredensial database, atau secret lainnya ke frontend. Nilai dengan awalan `VITE_` akan tersedia di bundle browser; gunakan hanya untuk konfigurasi yang memang aman dipublikasikan, seperti Midtrans client key.

5. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   ```
   Buka URL yang ditampilkan Vite, biasanya `http://localhost:5173`. Pastikan backend Laravel tetap berjalan di terminal terpisah. Jika browser melaporkan masalah CORS, periksa konfigurasi CORS backend dan izinkan origin frontend lokal.

## Perintah yang tersedia

```bash
npm run dev      # Menjalankan server pengembangan
npm run build    # Membuat bundle produksi di folder dist
npm run preview  # Meninjau bundle produksi secara lokal
npm run lint     # Menjalankan ESLint
```

## Catatan

- `node_modules/`, hasil build `dist/`, dan file lokal seperti `.env.local` tidak perlu di-commit.
- Seeder akun development dan konfigurasi database berada di repository backend. Gunakan README backend untuk detail akun lokal dan setup database.
- Untuk production, arahkan frontend ke backend production dan batasi origin CORS di backend ke domain frontend yang benar.
