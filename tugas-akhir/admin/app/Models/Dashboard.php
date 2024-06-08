<?php

namespace App\Models;

use App\Models\Common;

class Dashboard extends Common
{

   public function initPage(): array
   {
      return [
         'verifikasi' => [
            'totalMenuVerifikasi' => $this->hitungTotalMenuVerifikasi(),
            'jumlahProposal' => $this->hitungVerifikasiJumlahProposal(),
            'jumlahPerbaikan' => $this->hitungVerifikasiJumlahPerbaikan(),
            'jumlahDiterima' => $this->hitungVerifikasiJumlahDiterima()
         ],
         'seminar' => [
            'totalMenuSeminar' => $this->hitungTotalMenuSeminar(),
            'jumlahProposal' => $this->hitungSeminarJumlahProposal(),
            'jumlahPenelitian' => $this->hitungSeminarJumlahPenelitian(),
         ],
         'daftarMahasiswaSidang' => $this->getDaftarMahasiswaSidang(),
         'jumlahMahasiswaSidang' => $this->hitungJumlahMahasiswaSidang(),
      ];
   }

   private function hitungSeminarJumlahPenelitian(): int
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->whereIn('status', [13, 14, 15, 16, 17, 18, 19, 20, 21]);

      return $table->countAllResults();
   }

   private function hitungSeminarJumlahProposal(): int
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->whereIn('status', [7, 8, 9, 10, 11, 12, 13]);

      return $table->countAllResults();
   }

   private function hitungTotalMenuSeminar(): int
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->whereIn('status', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);

      return $table->countAllResults();
   }

   private function hitungJumlahMahasiswaSidang(): int
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->join('tb_jadwal_sidang tjs', 'tjs.id_status_tugas_akhir = tsta.id');
      $table->whereIn('tjs.tanggal', $this->mengambilTanggalMingguSekarang());

      return $table->countAllResults();
   }

   private function getDaftarMahasiswaSidang(): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tjs.jam, tjs.tanggal, tsta.nim, tsta.nama, concat(tp.jenjang, \' \', tp.nama) as program_studi, tsta.angkatan, tsta.hp, tsta.email, tp2.judul');
      $table->join('tb_jadwal_sidang tjs', 'tjs.id_status_tugas_akhir = tsta.id');
      $table->join('tb_prodi tp', 'tp.kode = tsta.kode_prodi');
      $table->join('tb_penelitian tp2', 'tp2.id_status_tugas_akhir = tsta.id');
      $table->whereIn('tjs.tanggal', $this->mengambilTanggalMingguSekarang());

      $get = $table->get();
      $result = $get->getResultArray();
      $get->freeResult();

      $response = [];
      foreach ($result as $row) {
         $response[date('d', strtotime($row['tanggal']))][] = $row;
      }
      return $response;
   }

   private function mengambilTanggalMingguSekarang(): array
   {
      $today = new \DateTime();

      // Cari hari Senin dari minggu ini (days to subtract to get to Monday)
      $startOfWeek = clone $today;
      $startOfWeek->modify('last monday');

      // Cari hari Minggu dari minggu ini (days to add to get to Sunday)
      $endOfWeek = clone $today;
      $endOfWeek->modify('next monday');

      // Array untuk menyimpan tanggal-tanggal minggu ini
      $datesOfWeek = [];

      // Loop melalui setiap hari dalam minggu ini
      $currentDay = clone $startOfWeek;
      while ($currentDay <= $endOfWeek) {
         $datesOfWeek[] = $currentDay->format('Y-m-d');
         $currentDay->modify('+1 day');
      }

      // Output hasil
      return $datesOfWeek;
   }

   private function hitungVerifikasiJumlahDiterima(): int
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->whereIn('status', [5, 6, 7]);

      return $table->countAllResults();
   }

   private function hitungVerifikasiJumlahPerbaikan(): int
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->whereIn('status', [3, 4]);

      return $table->countAllResults();
   }

   private function hitungVerifikasiJumlahProposal(): int
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->whereIn('status', [1]);

      return $table->countAllResults();
   }

   private function hitungTotalMenuVerifikasi(): int
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->whereIn('status', [1, 2, 3, 4, 5, 6, 7]);

      return $table->countAllResults();
   }
}
