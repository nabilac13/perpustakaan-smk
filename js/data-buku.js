/**
 * DataBuku — modul data buku yang dipakai bersama oleh beberapa halaman
 * (tambah_buku.html, katalog_buku.html, dan halaman lain yang perlu baca/tulis
 * data buku).
 *
 * PENTING: key localStorage di sini ('daftar_buku') SENGAJA dibuat sama
 * persis dengan yang dipakai di katalog_buku.html, supaya buku yang
 * ditambahkan lewat Tambah Buku langsung kebaca di halaman Katalog Buku
 * (dan halaman lain yang nantinya baca key yang sama) tanpa perlu server/DB.
 */
(function (global) {
  const BOOKS_KEY = 'daftar_buku';

  // SENGAJA disamakan persis dengan DEFAULT_BOOKS di katalog_buku.html.
  // Ini cuma dipakai SEKALI, kalau localStorage 'daftar_buku' masih kosong
  // sama sekali (misalnya admin buka Tambah Buku duluan sebelum pernah
  // membuka Katalog Buku sama sekali) — supaya katalog awal tidak hilang.
  const DEFAULT_BOOKS = [
    { id: 1, title: "Laut Bercerita", author: "Leila S. Chudori", genre: "Fiksi", format: "E-Book", avail: 12, total: 15, year: 2017, eyebrow: "NOVEL", image: "img/Laut Bercerita _ Leila S_ Chudori.jpg", grad: ["#105843", "#0c3f2e"] },
    { id: 2, title: "Bumi", author: "Tereliye", genre: "Fiksi", format: "E-Book", avail: 8, total: 10, year: 2014, eyebrow: "LEGEND", image: "img/bumi_tereliye.jpg", grad: ["#146b52", "#105843"] },
    { id: 3, title: "Matilda", author: "Roald Dahl", genre: "Nonfiksi", format: "E-Book Digital", avail: 5, total: 8, year: 2005, eyebrow: "SELF IMPROVEMENT", image: "img/mtld.jpg", pdf: "pdf/matilda-by-roald-dahl.pdf", grad: ["#1c8264", "#146b52"] },
    { id: 4, title: "Harry Potter", author: "J.K. Rowling", genre: "Fantasi", format: "E-Book & Fisik", avail: 7, total: 10, year: 2018, eyebrow: "SELF IMPROVEMENT", image: "img/harry potter.jpg", pdf: "pdf/harrypotter.pdf", grad: ["#1c8264", "#146b52"] },
    { id: 5, title: "Matematika", author: "Bornok Sinaga", genre: "Matematika", format: "Buku Fisik", avail: 7, total: 10, year: 2017, eyebrow: "Kurikulum 2013", image: "img/matematika_x.jpg", grad: ["#1c8264", "#146b52"] },
    { id: 6, title: "Informatika Kelas XI", author: "Auzi Asfarian", genre: "Pendidikan", format: "Buku Fisik", avail: 7, total: 10, year: 2021, eyebrow: "Kurikulum Merdeka", image: "img/informatika_xi.jpg", grad: ["#1c8264", "#146b52"] },
    { id: 7, title: "Rekayasa Perangkat Lunak", author: "Feri Hari Utama & Asnawati", genre: "Teknologi", format: "E-Book & Fisik", avail: 6, total: 10, year: 2022, eyebrow: "Kurikulum Merdeka", image: "img/rpl.jpg", grad: ["#1c8264", "#146b52"] },
    { id: 8, title: "Laskar Pelangi", author: "Andrea Hirata", genre: "Fiksi", format: "E-Book & Fisik", avail: 6, total: 10, year: 2005, eyebrow: "SELF IMPROVEMENT", image: "img/laskar_pelangi.jpg", grad: ["#1c8264", "#146b52"] },
    { id: 9, title: "Seporsi Mie Ayam Sebelum Mati", author: "Brian Khrisna", genre: "Fiksi", format: "E-Book & Fisik", avail: 6, total: 10, year: 2005, eyebrow: "SELF IMPROVEMENT", image: "img/seporsi_mie_ayam.jpg", grad: ["#1c8264", "#146b52"] }
  ];

  function loadBooks() {
    try {
      const raw = localStorage.getItem(BOOKS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      // localStorage rusak/tidak valid, abaikan dan pakai default di bawah
    }
    // Belum ada data sama sekali -> seed pakai katalog awal, biar konsisten
    // dengan katalog_buku.html walau dibuka duluan dari halaman ini.
    localStorage.setItem(BOOKS_KEY, JSON.stringify(DEFAULT_BOOKS));
    return DEFAULT_BOOKS;
  }

  function saveBooks(list) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(list));
  }

  function nextId(list) {
    let max = 0;
    list.forEach((b) => {
      const id = Number(b.id);
      if (!Number.isNaN(id) && id > max) max = id;
    });
    return max + 1;
  }

  /**
   * Menambahkan buku baru. `data` boleh berisi field apa saja (title, author,
   * genre, format, avail, total, year, image, dst — sesuai yang dikumpulkan
   * form Tambah Buku). id & grad diisi otomatis kalau belum ada.
   * Mengembalikan objek buku yang baru saja disimpan (lengkap dengan id-nya).
   */
  function addBook(data) {
    const list = loadBooks();
    const newBook = Object.assign(
      {
        id: nextId(list),
        grad: ['#1c8264', '#146b52'], // fallback warna kalau suatu saat cover tidak ada
      },
      data
    );
    list.push(newBook);
    saveBooks(list);
    return newBook;
  }

  function getBooks() {
    return loadBooks();
  }

  function getBookById(id) {
    return loadBooks().find((b) => String(b.id) === String(id)) || null;
  }

  function updateBook(id, changes) {
    const list = loadBooks();
    const idx = list.findIndex((b) => String(b.id) === String(id));
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], changes);
    saveBooks(list);
    return list[idx];
  }

  function deleteBook(id) {
    const list = loadBooks();
    const next = list.filter((b) => String(b.id) !== String(id));
    saveBooks(next);
    return next.length !== list.length; // true kalau ada yang kehapus
  }

  global.DataBuku = {
    BOOKS_KEY,
    addBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
  };
})(window);
