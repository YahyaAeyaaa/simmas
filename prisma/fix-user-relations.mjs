// prisma/fix-user-relations.mjs
// Script untuk memperbaiki relasi user dengan menambahkan entri Siswa/Guru yang hilang

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixUserRelations() {
  console.log('Mulai memperbaiki relasi user...');
  
  try {
    // 1. Ambil semua user dengan role siswa yang belum memiliki entri di tabel Siswa
    const siswaUsers = await prisma.user.findMany({
      where: {
        role: 'siswa',
        siswa: null
      }
    });
    
    console.log(`Ditemukan ${siswaUsers.length} user dengan role siswa tanpa entri di tabel Siswa`);
    
    // 2. Buat entri Siswa untuk setiap user siswa yang belum memiliki entri
    for (const user of siswaUsers) {
      await prisma.siswa.create({
        data: {
          userId: user.id,
          nama: user.name,
          nis: `NIS-${user.id}-${Date.now()}`,
          kelas: 'XI', // Default kelas
          jurusan: 'Umum', // Default jurusan
          alamat: '-',
          telepon: '-'
        }
      });
      console.log(`✅ Berhasil membuat entri Siswa untuk user ${user.name} (ID: ${user.id})`);
    }
    
    // 3. Ambil semua user dengan role guru yang belum memiliki entri di tabel Guru
    const guruUsers = await prisma.user.findMany({
      where: {
        role: 'guru',
        guru: null
      }
    });
    
    console.log(`Ditemukan ${guruUsers.length} user dengan role guru tanpa entri di tabel Guru`);
    
    // 4. Buat entri Guru untuk setiap user guru yang belum memiliki entri
    for (const user of guruUsers) {
      await prisma.guru.create({
        data: {
          userId: user.id,
          nama: user.name,
          nip: `NIP-${user.id}-${Date.now()}`,
          alamat: '-',
          telepon: '-'
        }
      });
      console.log(`✅ Berhasil membuat entri Guru untuk user ${user.name} (ID: ${user.id})`);
    }
    
    console.log('Proses perbaikan relasi user selesai!');
    
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan fungsi
fixUserRelations()
  .then(() => console.log('Script selesai dijalankan'))
  .catch(e => {
    console.error('Error menjalankan script:', e);
    process.exit(1);
  });