export type LogbookStatus = 'Disetujui' | 'Belum Diverifikasi' | 'Ditolak';

export interface LogbookStatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
}

export const getLogbookStatus = (status: LogbookStatus): LogbookStatusConfig => {
  const statusMap: Record<LogbookStatus, LogbookStatusConfig> = {
    'Disetujui': {
      label: 'Disetujui',
      bgColor: 'bg-[#cfffe9]',
      textColor: 'text-[#198754]'
    },
    'Belum Diverifikasi': {
      label: 'Belum',
      bgColor: 'bg-[#fff4cc]',
      textColor: 'text-[#ff9800]'
    },
    'Ditolak': {
      label: 'Ditolak',
      bgColor: 'bg-[#ffd5d5]',
      textColor: 'text-[#dc3545]'
    }
  };

  return statusMap[status];
};

// Interface untuk Logbook Data
export interface LogbookData {
  id: number;
  siswaName: string;
  nis: string;
  kelas: string;
  tanggal: string;
  kegiatan: string;
  kendala: string;
  status: LogbookStatus;
  catatanGuru: string;
}

// Dummy Data Logbook Siswa
export const logbookDummyData: LogbookData[] = [
  {
    id: 1,
    siswaName: 'Ahmad Rizki',
    nis: 'NIS 2024001',
    kelas: 'XII RPL 1',
    tanggal: '1 Mar 2024',
    kegiatan: 'Membuat desain UI aplikasi kasir menggunakan Figma. Melakukan analisis user experience dan wireframing untuk meningkatkan user...',
    kendala: 'Kesulitan menentukan skema warna yang tepat dan konsisten untuk seluruh aplikasi',
    status: 'Disetujui',
    catatanGuru: 'Bagus, lanjutkan dengan implementasi'
  },
  {
    id: 2,
    siswaName: 'Ahmad Rizki',
    nis: 'NIS 2024001',
    kelas: 'XII RPL 1',
    tanggal: '2 Mar 2024',
    kegiatan: 'Belajar backend Laravel untuk membangun REST API sistem kasir. Mempelajari konsep MVC dan routing',
    kendala: 'Error saat mengirimkan migration database dan kesulitan memahami relationship antar tabel',
    status: 'Belum Diverifikasi',
    catatanGuru: 'Belum ada catatan'
  },
  {
    id: 3,
    siswaName: 'Siti Nurhaliza',
    nis: 'NIS 2024002',
    kelas: 'XII RPL 1',
    tanggal: '1 Mar 2024',
    kegiatan: 'Setup server Linux Ubuntu untuk deployment aplikasi web. Konfigurasi Apache dan MySQL',
    kendala: 'Belum familiar dengan command line interface dan permission system di linux',
    status: 'Ditolak',
    catatanGuru: 'Perbaiki deskripsi kegiatan, terlalu singkat'
  },
  {
    id: 4,
    siswaName: 'Budi Santoso',
    nis: 'NIS 2024003',
    kelas: 'XII TKJ 1',
    tanggal: '3 Mar 2024',
    kegiatan: 'Melakukan troubleshooting jaringan komputer kantor dan mengkonfigurasi switch managed.',
    kendala: 'Beberapa port switch tidak berfungsi dengan baik',
    status: 'Disetujui',
    catatanGuru: 'Sudah bagus, dokumentasikan solusinya'
  },
  {
    id: 5,
    siswaName: 'Dewi Lestari',
    nis: 'NIS 2024004',
    kelas: 'XII RPL 2',
    tanggal: '4 Mar 2024',
    kegiatan: 'Membuat dokumentasi API dan testing menggunakan Postman untuk endpoint yang sudah dibuat',
    kendala: 'Kesulitan dalam membuat dokumentasi yang comprehensive dan mudah dipahami',
    status: 'Belum Diverifikasi',
    catatanGuru: 'Belum ada catatan'
  },
  {
    id: 6,
    siswaName: 'Rudi Hermawan',
    nis: 'NIS 2024005',
    kelas: 'XII TKJ 2',
    tanggal: '5 Mar 2024',
    kegiatan: 'Instalasi dan konfigurasi CCTV sistem untuk monitoring keamanan kantor',
    kendala: 'Sinyal CCTV kadang terputus-putus',
    status: 'Disetujui',
    catatanGuru: 'Periksa kualitas kabel jaringan'
  },
  {
    id: 7,
    siswaName: 'Maya Sari',
    nis: 'NIS 2024006',
    kelas: 'XII RPL 1',
    tanggal: '6 Mar 2024',
    kegiatan: 'Implementasi fitur authentication dan authorization menggunakan JWT',
    kendala: 'Token expired terlalu cepat',
    status: 'Belum Diverifikasi',
    catatanGuru: 'Belum ada catatan'
  },
  {
    id: 8,
    siswaName: 'Agus Prasetyo',
    nis: 'NIS 2024007',
    kelas: 'XII MM 1',
    tanggal: '7 Mar 2024',
    kegiatan: 'Editing video company profile menggunakan Adobe Premiere Pro',
    kendala: 'Rendering video memakan waktu lama',
    status: 'Disetujui',
    catatanGuru: 'Hasil sudah bagus, pertahankan'
  },
  {
    id: 9,
    siswaName: 'Linda Wijayanti',
    nis: 'NIS 2024008',
    kelas: 'XII RPL 2',
    tanggal: '8 Mar 2024',
    kegiatan: 'Membuat unit testing untuk aplikasi menggunakan Jest dan React Testing Library',
    kendala: 'Kesulitan membuat mock data untuk testing',
    status: 'Ditolak',
    catatanGuru: 'Tambahkan detail coverage testing'
  },
  {
    id: 10,
    siswaName: 'Fajar Nugroho',
    nis: 'NIS 2024009',
    kelas: 'XII TKJ 1',
    tanggal: '9 Mar 2024',
    kegiatan: 'Maintenance server dan backup database rutin',
    kendala: 'Proses backup memakan storage besar',
    status: 'Disetujui',
    catatanGuru: 'Pertimbangkan incremental backup'
  }
];