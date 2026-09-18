# JS Sprint — Interactive Quiz App

Tugas Rutin 6 — Mata Kuliah Pemrograman Web
Program Studi Ilmu Komputer, Universitas Negeri Medan

## Deskripsi

JS Sprint adalah kuis interaktif seputar dasar JavaScript, DOM & Event, serta
Asynchronous JavaScript. Setiap sesi menampilkan 10 soal yang dipilih dan
diacak secara random dari bank soal, masing-masing dengan batas waktu 20 detik.

## Fitur

- **ES6+**: `const`/`let`, arrow function, template literal di seluruh kode.
- **Render soal via `createElement` & `textContent`** — tidak menggunakan `innerHTML`.
- **Event delegation** — satu `addEventListener` pada container jawaban menangani seluruh tombol.
- **Skor otomatis** dan **high score** tersimpan di `localStorage`.
- **Navigasi SPA** antar layar (start → quiz → result) tanpa reload halaman.
- **Feedback visual**: jawaban benar berwarna hijau, salah berwarna merah.
- **Tombol Restart** untuk mengulang dari awal.
- **Bonus**:
  - Timer melingkar per soal (20 detik, berubah warna saat waktu hampir habis).
  - Progress bar di atas soal.
  - Kategori soal diacak/dipilih random dari bank soal (bukan urutan tetap).
  - Animasi transisi masuk pada tiap soal dan jawaban.
  - Dark mode / light mode toggle (tersimpan di `localStorage`, mengikuti preferensi sistem sebagai default).

## Struktur Berkas

```
├── index.html   # Struktur halaman & tiga "screen" SPA (start, quiz, result)
├── style.css    # Desain visual, dark/light theme, animasi
├── script.js    # Logika kuis, state, timer, localStorage, event delegation
└── README.md
```

## Cara Menjalankan

Tidak memerlukan build tool maupun server khusus:

1. Clone / unduh repo ini.
2. Buka `index.html` langsung di browser (double click, atau gunakan ekstensi
   Live Server pada VS Code untuk reload otomatis saat development).

## Cara Bermain

1. Klik **Mulai Kuis** dari halaman awal.
2. Pilih salah satu dari empat opsi jawaban sebelum waktu 20 detik habis.
3. Jawaban benar akan berubah hijau, jawaban salah (jika dipilih) berubah merah.
4. Setelah 10 soal selesai, skor akhir dan skor tertinggi akan ditampilkan.
5. Klik **Coba Lagi** untuk mengulang dengan set soal yang baru diacak.

## Catatan Pengembangan

Bank soal berjumlah 15 butir dari 3 kategori; setiap sesi kuis mengacak
urutan bank lalu mengambil 10 soal pertama, sehingga kombinasi dan urutan
soal yang muncul akan berbeda pada tiap sesi bermain.
