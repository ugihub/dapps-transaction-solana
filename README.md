# **Solana Token Transfer DApp**

Aplikasi ini adalah Decentralized Application (DApp) berbasis Solana blockchain yang memungkinkan pengguna mentransfer token SOL atau SPL (misalnya USDC) ke alamat dompet lain. Aplikasi ini menggunakan Phantom Wallet sebagai dompet kripto dan dirancang dengan antarmuka yang responsif serta tema biru-hitam yang modern.

## **Fitur Utama**
- **Transfer Token**: Pengguna dapat mentransfer token SOL atau SPL (contoh: USDC) ke alamat dompet lain.
- **Simpan ID Transaksi**: ID transaksi disimpan di Local Storage sehingga tetap tersedia bahkan setelah halaman direfresh.
- **Desimal Jumlah Transfer**: Mendukung jumlah transfer dalam format desimal (misalnya 0.5 SOL atau 1.25 USDC).
- **Tampilan Pop-Up Dompet**: Saat memilih dompet, tampilan modal akan menutupi seluruh layar dengan efek overlay untuk pengalaman yang lebih baik.
- **Saldo Real-Time**: Saldo token ditampilkan secara real-time berdasarkan dompet yang terhubung.

---

## **Teknologi yang Digunakan**

### **Bahasa Pemrograman**
- **JavaScript/TypeScript**: Aplikasi ini dibangun menggunakan JavaScript dengan beberapa fitur TypeScript untuk type-checking.
- **CSS**: Styling custom dengan tema biru-hitam.

### **Library dan Framework**
- **React.js**: Framework frontend untuk membangun antarmuka pengguna.
- **Solana Web3.js**: Library resmi Solana untuk berinteraksi dengan blockchain Solana.
- **Solana SPL Token**: Library untuk berinteraksi dengan token SPL (Standard Program Library) di Solana.
- **Phantom Wallet Adapter**: Library untuk mengintegrasikan Phantom Wallet ke dalam aplikasi.
- **Buffer**: Polyfill untuk mendukung Buffer di browser karena library tertentu seperti `@solana/spl-token` membutuhkannya.
- **Local Storage**: Untuk menyimpan ID transaksi secara lokal di browser.

---

## **Cara Instalasi**

### **Prasyarat**
1. Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) dan npm/yarn di komputer Anda.
2. Unduh atau clone repository ini:
   ```bash
   git clone https://github.com/[username]/solana-token-transfer-dapp.git
   cd solana-token-transfer-dapp
   ```

### **Langkah-Langkah Instalasi**
1. Install dependensi menggunakan npm atau yarn:
   ```bash
   npm install
   ```
   Atau:
   ```bash
   yarn install
   ```

2. Jalankan aplikasi di lingkungan lokal:
   ```bash
   npm start
   ```
   Atau:
   ```bash
   yarn start
   ```

3. Buka browser dan akses aplikasi di:
   ```
   http://localhost:3000
   ```

---

## **Prompt Terminal yang Digunakan**

Berikut adalah daftar prompt terminal yang mungkin Anda gunakan selama proses instalasi dan pengembangan:

### **1. Clone Repository**
```bash
git clone https://github.com/ugihub/solana-token-transfer-dapp.git
cd solana-token-transfer-dapp
```

### **2. Install Dependensi**
```bash
npm install
```
Atau jika Anda menggunakan Yarn:
```bash
yarn install
```

### **3. Jalankan Aplikasi**
```bash
npm start
```
Atau:
```bash
yarn start
```

### **4. Bersihkan Build Cache**
Jika Anda mengalami masalah saat membangun proyek, jalankan perintah berikut untuk membersihkan cache:
```bash
npm run clean
```
Atau:
```bash
rm -rf node_modules && npm install
```

### **5. Testnet Faucet**
Untuk mendapatkan airdrop SOL di Testnet, gunakan salah satu faucet berikut:
- [Solana Faucet](https://solfaucet.com/)
- [QuickNode Faucet](https://quicknode.com/solana-faucet/)

Contoh perintah untuk meminta airdrop menggunakan CLI Solana:
```bash
solana airdrop 2 <YOUR_WALLET_ADDRESS> --url https://api.testnet.solana.com
```

---

## **Informasi Testnet Solana**

### **Apa itu Testnet?**
Testnet adalah jaringan pengujian Solana yang digunakan untuk mengembangkan dan menguji aplikasi tanpa menggunakan aset nyata. Semua transaksi di Testnet tidak memiliki nilai moneter.

### **Mengapa Menggunakan Testnet?**
- **Pengujian Gratis**: Anda dapat melakukan transaksi tanpa khawatir kehilangan uang sungguhan.
- **Simulasi Dunia Nyata**: Testnet memungkinkan Anda mensimulasikan transaksi seolah-olah berada di Mainnet.
- **Token SPL**: Anda dapat menggunakan token SPL seperti USDC di Testnet untuk menguji fungsionalitas aplikasi.

### **Cara Menghubungkan ke Testnet**
1. Pastikan dompet Phantom Anda terhubung ke jaringan Testnet:
   - Buka Phantom Wallet.
   - Klik ikon pengaturan (⚙️) di pojok kanan atas.
   - Pilih **"Change Network"** dan pilih **"Testnet"**.

2. Minta airdrop SOL melalui faucet berikut:
   - [Solana Faucet](https://solfaucet.com/)
   - [QuickNode Faucet](https://quicknode.com/solana-faucet/)

3. Gunakan alamat dompet Anda untuk mendapatkan airdrop:
   ```bash
   solana airdrop 2 <YOUR_WALLET_ADDRESS> --url https://api.testnet.solana.com
   ```

---

## **Catatan Penting**
1. **Testnet Only**: Aplikasi ini hanya berjalan di jaringan Testnet Solana. Pastikan dompet Anda terhubung ke Testnet.
2. **Token SPL**: Untuk menggunakan token SPL seperti USDC, pastikan Anda memiliki saldo token tersebut di dompet Anda.
3. **Local Storage**: ID transaksi disimpan di Local Storage browser Anda. Jika Anda membersihkan cache browser, data ini akan hilang.