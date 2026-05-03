# 🚀 DEPLOY KE VERCEL - STEP BY STEP GUIDE

**Seperti anak 5 tahun!** 😄

---

## 📋 YANG ANDA BUTUHKAN

1. ✅ GitHub account (sudah ada)
2. ✅ Vercel account (sudah ada)
3. ✅ Code di GitHub (belum ada - kita buat sekarang)

---

## 🎯 STEP 1: BUAT REPO DI GITHUB

### 1.1 Buka GitHub
- Buka browser
- Pergi ke: **https://github.com/new**

### 1.2 Isi Form
- **Repository name:** `dropstudio-fun`
- **Description:** `NFT Staking & Raffle Platform` (opsional)
- **Public** (pilih ini!)
- **Jangan** centang "Initialize this repository with a README"

### 1.3 Click "Create repository"

### 1.4 Copy URL
Setelah repo dibuat, Anda akan lihat halaman dengan kode. Di bagian atas, ada URL seperti:
```
https://github.com/YOUR_USERNAME/dropstudio-fun.git
```

**COPY URL INI!** (Ganti YOUR_USERNAME dengan username GitHub Anda)

---

## 🎯 STEP 2: PUSH CODE KE GITHUB

Saya akan jalankan command ini untuk push code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/dropstudio-fun.git
git branch -M main
git push -u origin main
```

**Anda hanya perlu:**
1. Kasih saya URL GitHub Anda
2. Saya push code

---

## 🎯 STEP 3: CONNECT VERCEL KE GITHUB

### 3.1 Buka Vercel
- Buka browser
- Pergi ke: **https://vercel.com/new**

### 3.2 Click "Import Git Repository"

### 3.3 Paste GitHub URL
- Paste URL GitHub Anda:
  ```
  https://github.com/YOUR_USERNAME/dropstudio-fun
  ```
- Click **"Continue"**

### 3.4 Konfigurasi Project
Vercel akan tanya konfigurasi. Isi seperti ini:

| Field | Value |
|-------|-------|
| **Project Name** | `dropstudio-fun` |
| **Framework** | `Vite` |
| **Root Directory** | `./` (biarkan default) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 3.5 Environment Variables (PENTING!)
Scroll ke bawah, ada section "Environment Variables". Isi:

```
VITE_OPENSEA_API_KEY=your_opensea_api_key
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key
```

(Kalau belum punya API keys, bisa skip dulu, nanti di-update)

### 3.6 Click "Deploy"
- Tunggu... (biasanya 2-3 menit)
- Vercel akan build dan deploy otomatis

### 3.7 SELESAI!
Vercel akan kasih URL seperti:
```
https://dropstudio-fun.vercel.app
```

**APP SUDAH LIVE!** 🎉

---

## 📝 RINGKASAN LANGKAH

1. ✅ Buka https://github.com/new
2. ✅ Buat repo `dropstudio-fun` (Public)
3. ✅ **COPY URL** yang GitHub kasih
4. ✅ **KASIH URL KE SAYA**
5. ✅ Saya push code ke GitHub
6. ✅ Anda buka https://vercel.com/new
7. ✅ Anda paste URL GitHub
8. ✅ Anda isi konfigurasi (Vite, dist, dll)
9. ✅ Anda click "Deploy"
10. ✅ **SELESAI! APP LIVE!**

---

## ⚠️ PENTING!

### API Keys
Untuk NFT reading dan balance reading, Anda perlu:
- **OpenSea API Key**: https://docs.opensea.io/reference/api-overview
- **Etherscan API Key**: https://etherscan.io/apis

Tapi bisa di-setup nanti di Vercel dashboard.

### Backend
Backend masih running di localhost:3456. Untuk production, Anda perlu:
- Deploy backend ke server (Contabo, Heroku, Railway, dll)
- Update API URL di frontend

---

## 🎯 SEKARANG ANDA SIAP?

**Langkah pertama:**
1. Buka https://github.com/new
2. Buat repo `dropstudio-fun`
3. **COPY URL**
4. **KASIH URL KE SAYA**

Saya tunggu! 🚀

---

## 📞 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Build failed | Check console output, biasanya ada error message |
| Deployment stuck | Refresh page, atau coba deploy ulang |
| App blank | Check browser console (F12) untuk errors |
| API not working | Backend masih di localhost, perlu di-deploy |

---

**Ready?** Mulai dari Step 1! 🎉
