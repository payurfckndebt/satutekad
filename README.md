# SatuTekad

Try out sertifikasi PCAM 9 & MLE 2026 — penerus dari aplikasi AALKADA, dibangun ulang dari nol
(React + Vite, siap deploy statis ke Vercel). Palet warna merah + putih, dominan putih.

## Lima Mode

- **FullTek** — simulasi ujian bertimer, campuran seluruh 206 soal, pilih 20/40/60 soal, KKM 75.
- **JWARA** — mode game ringan ala Duolingo: 5 nyawa, streak/combo, progress bar, dan 5 jenis micro-interaction (Rapid Elimination, Tap-to-Fill, True/False Swipe, Match Pairs, Drag-and-Sort/susun urutan). Salah di ronde pertama mengurangi nyawa dan soal itu masuk antrian "Ulangi" di akhir level.
- **Latihan Harian** — materi dikelompokkan per 4 hari pelatihan; pilih hari → pilih materi (atau sekaligus semua materi hari itu).
- **YDBBA** — latihan fokus ke subset soal tertentu (lihat catatan data di bawah), per kategori atau semua sekaligus.
- **Bank Soal** — daftar semua 206 soal yang bisa dicari & difilter per kategori, tiap soal bisa di-expand untuk lihat jawaban benar + pembahasan singkat.

Aplikasi tidak menampilkan ke user soal mana yang berasal dari file asli vs yang dibuatkan — itu murni detail data internal (lihat bawah), bukan sesuatu yang tampil di UI.

## Data Soal — 206 total, 15 kategori

`src/data/questions.json` dan `src/data/categories.json`. Tiap soal punya field `source` (dipakai untuk logika internal YDBBA, tidak ditampilkan di UI):

- `"existing"` (91 soal) — diekstrak otomatis dari file Kahoot/Quizizz/Latihan Soal kalian (kunci jawaban dibaca dari format **bold** di dokumen asli, sudah diverifikasi manual). Ini yang jadi isi mode YDBBA.
- `"generated"` (115 soal) — dibuat dari 9 topik yang belum ada bank soalnya, dengan membaca penuh materi PDF-nya. Termasuk kategori "Siklus Pengawasan Bidang Pasar Modal" yang menggantikan file sumber `Kahoot & Kisi - Pengawasan SRO Lembaga Penunjang (PMDK).docx` — file itu kosong teks soalnya (cuma opsi A/B/C/D tanpa pertanyaan).

`src/data/sequences.json` berisi 10 urutan tahapan (dipakai khusus untuk template Drag-and-Sort di JWARA), disusun manual dari fakta yang sama dengan materi.

**Catatan jujur soal kualitas data:** field `pembahasan` di tiap soal (dipakai di Bank Soal dan bottom-sheet JWARA) dibangun otomatis dari stem+opsi jawaban — bukan penjelasan konseptual yang ditulis manual per soal. Sudah ditangani kasus khusus soal "kecuali" biar kalimatnya tidak salah nalar. Kalau mau pembahasan yang lebih kaya/mendalam, itu pekerjaan lanjutan yang perlu ditulis manual per soal.

## Menjalankan di lokal

```bash
npm install
npm run dev
```

## Deploy ke Vercel via GitHub

1. Push folder ini ke repo GitHub (root repo = folder ini, bukan subfolder).
2. Di Vercel: **Add New Project** → import repo tsb. Vercel otomatis mendeteksi Vite (`vercel.json` sudah menyertakan `buildCommand`/`outputDirectory` untuk jaga-jaga). Tidak ada environment variable yang dibutuhkan.
3. **Kalau mengganti koneksi repo di project Vercel yang sudah ada** (bukan bikin project baru): ganti koneksi itu sendiri TIDAK otomatis memicu build baru. Push satu commit baru (atau klik "Redeploy" manual di tab Deployments) supaya domain-nya benar-benar menyajikan kode yang baru.

## Struktur Proyek

```
src/
  data/            questions.json (+ pembahasan), categories.json, sequences.json
  lib/utils.js     shuffle, KKM, dsb
  components/      komponen shared (ProgressBar, LivesBar, McqRunner, ResultCard, dst)
  screens/
    HomeScreen.jsx
    TryOutScreen.jsx     (mode FullTek)
    YdbbaScreen.jsx
    HarianScreen.jsx     (mode Latihan Harian — grouping per Day 1-4)
    BankSoalScreen.jsx   (mode Bank Soal — searchable, expandable Q&A+pembahasan)
    jwara/
      JwaraMap.jsx       peta unit (per kategori, dikelompokkan per Day 1-4)
      JwaraSession.jsx   state machine: forward pass, retry-at-end, nyawa, streak
      levelBuilder.js    generator 1 level (6 langkah) dari pool soal kategori
      steps/             5 komponen micro-interaction
```

## Yang belum/bisa dikembangkan lagi

- Progress JWARA (level mana yang sudah selesai) belum persisten — reset tiap reload.
- Pembahasan masih auto-generated dari data soal (lihat catatan di atas).
- Day 5 materi belum tersedia dari OJK saat ini — belum ada kategori untuk itu.
