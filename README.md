# Interactive Quiz App — Tugas Web Pertemuan 6

Aplikasi kuis interaktif untuk tugas Pemrograman Web, materi JavaScript DOM & Event Handling.

## Fitur
- 7 pertanyaan pilihan ganda.
- Skor otomatis ditampilkan pada akhir kuis.
- High score tersimpan menggunakan `localStorage`.
- Soal dan pilihan dirender dengan `createElement()` dan `textContent`.
- Event delegation untuk pilihan jawaban.
- Feedback visual: hijau untuk jawaban benar dan merah untuk jawaban salah.
- Progress bar, penjelasan jawaban, dan tombol restart.
- Kuis berjalan tanpa reload halaman.

## Cara menjalankan
1. Ekstrak folder project.
2. Buka `index.html` menggunakan Chrome, Edge, Firefox, atau browser modern lainnya.
3. Jawab soal sampai selesai dan coba tombol **Ulangi kuis**.

Tidak perlu menginstal package atau menjalankan server.

## Struktur folder
```text
TugasWeb-Pertemuan6-QuizApp/
├── index.html
├── style.css
├── app.js
├── README.md
└── .gitignore
```

## Konsep yang digunakan
- DOM selection: `document.querySelector()`.
- DOM manipulation: `document.createElement()`, `textContent`, `append()`, `replaceChildren()`.
- Event handling: `addEventListener()`.
- Event delegation: `event.target.closest()` pada container pilihan.
- Web Storage: `localStorage.getItem()` dan `localStorage.setItem()`.
- ES6+: `const`, `let`, arrow functions, template literals, dan array methods.

## Pengumpulan ke GitHub
Nama repository yang diminta pada materi:
`TugasWeb-Pertemuan6-QuizApp`

1. Buat repository dengan nama tersebut di GitHub dan pilih **Public**.
2. Unggah semua file dalam folder ini.
3. Tes kembali aplikasi di browser.
4. Salin link repository dan kumpulkan melalui LMS UNIMED sesuai arahan dosen.

## Checklist pengujian
- [ ] Kuis memiliki minimal 5 pertanyaan.
- [ ] Satu soal hanya bisa dijawab sekali.
- [ ] Jawaban benar berwarna hijau dan salah merah.
- [ ] Skor akhir sesuai jawaban yang benar.
- [ ] High score masih ada setelah browser ditutup dan dibuka kembali pada browser yang sama.
- [ ] Tombol restart memulai kuis dari soal pertama tanpa menghapus high score.
