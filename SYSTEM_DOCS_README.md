# 📚 System Documentation — Gitmyart Admin Panel

## Apa Itu?

Saya sudah tambahkan halaman **"System Docs"** di admin panel. Ini adalah **"Living Documentation"** — dokumentasi lengkap tentang:
- 🏗️ Arsitektur project
- 📊 Data flow & cara kerja
- 🔐 Security implementation
- 🔧 Troubleshooting guide

**Tujuan:** Agar kamu dan tim tidak lupa struktur, mudah debug, dan tidak ada error karena miscommunication.

---

## Cara Akses

1. Buka admin panel: `http://localhost:3456/admin.html`
2. Login: `admin` / `rebel2024`
3. Klik tab **"System Docs"** di sidebar (icon ⓘ)
4. Pilih tab dokumentasi:
   - 📋 **Overview** — Arsitektur lengkap, database schema, cron jobs
   - 📊 **Data Flow** — Diagram flow staking, raffle, earning
   - 🔐 **Security** — Auth, rate limiting, vulnerabilities
   - 🔧 **Troubleshooting** — Common issues & debug commands

---

## File yang Ditambahkan

| File | Fungsi |
|------|--------|
| `admin_docs.js` | Konten dokumentasi + rendering (26KB) |
| `admin_docs.css` | Styling untuk docs page (2.3KB) |
| `admin.html` | Updated dengan tab "System Docs" |
| `admin.js` | Updated dengan trigger docs page |

---

## Konten Dokumentasi

### 📋 Overview
- Project overview & status
- Architecture diagram (backend + frontend)
- Database schema (8 tables)
- Security implementation
- Cron jobs (5 background tasks)
- Core features & flow
- Known issues & TODO
- Capacity & limits
- Deployment checklist
- Quick reference (API endpoints, env vars, commands)

### 📊 Data Flow
- User staking journey (5 steps)
- Raffle entry journey (3 steps)
- HP decay & feeding flow
- Visual ASCII diagrams

### 🔐 Security
- Authentication flow (session tokens)
- Rate limiting strategy
- Input validation
- Database security
- Known vulnerabilities & mitigations
- Deployment security checklist

### 🔧 Troubleshooting
- 8 common issues dengan solusi
- Debug commands (SQLite, logs, API testing)
- Performance monitoring

---

## Istilah yang Digunakan

**"Living Documentation"** atau **"System Documentation"** adalah:
- Dokumentasi yang **selalu update** seiring project berkembang
- Bukan static docs yang ketinggalan
- Bisa diakses langsung dari app (bukan file terpisah)
- Membantu team onboarding & debugging

---

## Cara Update Dokumentasi

Kalau ada perubahan di project, update di `admin_docs.js`:

```javascript
const SYSTEM_DOCS = {
  overview: `...`,      // Update di sini
  dataFlow: `...`,      // Update di sini
  security: `...`,      // Update di sini
  troubleshooting: `...` // Update di sini
};
```

Setiap kali server restart, dokumentasi otomatis ter-update.

---

## Next Steps

1. ✅ Dokumentasi sudah ada
2. ⏳ Tambahkan lebih banyak troubleshooting cases seiring project berkembang
3. ⏳ Tambahkan video tutorials (link ke YouTube)
4. ⏳ Tambahkan API documentation (Swagger/OpenAPI)
5. ⏳ Tambahkan deployment guide per platform

---

## Tips Penggunaan

- **Sebelum deploy:** Baca "Deployment Checklist" di Overview
- **Kalau ada error:** Cek "Troubleshooting" tab
- **Kalau lupa struktur:** Buka "Overview" → "Architecture Overview"
- **Kalau mau debug:** Buka "Troubleshooting" → "Debug Commands"
- **Kalau mau understand flow:** Buka "Data Flow" tab

---

**Dibuat:** 2 May 2026
**Status:** ✅ Live di admin panel
**Akses:** http://localhost:3456/admin.html → System Docs tab
