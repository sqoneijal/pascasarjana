<?php

namespace App\Models\Dosen;

use CodeIgniter\Database\RawSql;

class Dashboard extends Common
{

   public function initPage(string $nidn): array
   {
      return [
         'kalender' => [
            'tanggal_seminar_proposal' => $this->getTanggalSeminar(),
            'tanggal_seminar_hasil_penelitian' => $this->getTanggalSeminarHasilPenelitian(),
            'tanggal_sidang_munaqasyah' => $this->getTanggalSidangMunaqasyah(),
            'peserta_seminar_proposal' => $this->getPesertaSidangProposal($nidn),
            'peserta_seminar_hasil_penelitian' => $this->getPesertaSidangHasilPenelitian($nidn),
            'peserta_sidang_munaqasyah' => $this->getPesertaSidangMunaqasyah($nidn),
         ]
      ];
   }

   private function getPesertaSidangMunaqasyah(string $nidn): array
   {
      $table = $this->db->table('tb_jadwal_sidang tjs');
      $table->select('tjs.tanggal, tjs.jam, tsta.nim, tsta.nama, tsta.id_periode');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.id = tjs.id_status_tugas_akhir');
      $table->join('tb_penguji_sidang tps', 'tps.id_status_tugas_akhir=tsta.id');
      $table->where(new RawSql('extract(month from tjs.tanggal) = extract(month from now())'));
      $table->where('tps.nidn', $nidn);

      $get = $table->get();
      $result = $get->getResultArray();
      $fieldNames = $get->getFieldNames();
      $get->freeResult();

      $response = [];
      foreach ($result as $key => $val) {
         foreach ($fieldNames as $field) {
            $response[$key][$field] = $val[$field] ? trim($val[$field]) : (string) $val[$field];
         }
      }
      return $response;
   }

   private function getPesertaSidangHasilPenelitian(string $nidn): array
   {
      $table = $this->db->table('tb_seminar_penelitian tsp');
      $table->select('tsp.tanggal_seminar, tsp.jam_seminar, tsta.nim, tsta.nama, tsta.id_periode');
      $table->join('tb_penelitian tp', 'tp.id = tsp.id_penelitian');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.id = tp.id_status_tugas_akhir');
      $table->join('tb_seminar_penelitian_detail tspd', 'tspd.id_seminar_penelitian = tsp.id');
      $table->where(new RawSql('extract(month from tsp.tanggal_seminar) = extract(month from now())'));
      $table->where('tspd.nidn', $nidn);

      $get = $table->get();
      $result = $get->getResultArray();
      $fieldNames = $get->getFieldNames();
      $get->freeResult();

      $response = [];
      foreach ($result as $key => $val) {
         foreach ($fieldNames as $field) {
            $response[$key][$field] = $val[$field] ? trim($val[$field]) : (string) $val[$field];
         }
      }
      return $response;
   }

   private function getPesertaSidangProposal(string $nidn): array
   {
      $table = $this->db->table('tb_jadwal_seminar tjs');
      $table->select('tjs.tanggal_seminar, tjs.jam_seminar, tsta.nim, tsta.nama, tsta.id_periode');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.id = tjs.id_status_tugas_akhir');
      $table->join('tb_pembimbing_seminar tps', 'tps.id_status_tugas_akhir = tsta.id');
      $table->where(new RawSql('extract(month from tjs.tanggal_seminar) = extract(month from now())'));
      $table->where('tps.nidn', $nidn);

      $get = $table->get();
      $result = $get->getResultArray();
      $fieldNames = $get->getFieldNames();
      $get->freeResult();

      $response = [];
      foreach ($result as $key => $val) {
         foreach ($fieldNames as $field) {
            $response[$key][$field] = $val[$field] ? trim($val[$field]) : (string) $val[$field];
         }
      }
      return $response;
   }

   private function getTanggalSidangMunaqasyah(): array
   {
      $table = $this->db->table('tb_jadwal_sidang');
      $table->select('min(tanggal) as tanggal_mulai, max(tanggal) as tanggal_sampai');
      $table->where(new RawSql('extract(month from tanggal) = extract(month from now())'));

      $get = $table->get();
      $data = $get->getRowArray();
      $fieldNames = $get->getFieldNames();
      $get->freeResult();

      $response = [];
      if (isset($data)) {
         foreach ($fieldNames as $field) {
            $response[$field] = ($data[$field] ? trim($data[$field]) : (string) $data[$field]);
         }
      }
      return $response;
   }

   private function getTanggalSeminarHasilPenelitian(): array
   {
      $table = $this->db->table('tb_seminar_penelitian');
      $table->select('min(tanggal_seminar) as tanggal_mulai, max(tanggal_seminar) as tanggal_sampai');
      $table->where(new RawSql('extract(month from tanggal_seminar) = extract(month from now())'));

      $get = $table->get();
      $data = $get->getRowArray();
      $fieldNames = $get->getFieldNames();
      $get->freeResult();

      $response = [];
      if (isset($data)) {
         foreach ($fieldNames as $field) {
            $response[$field] = ($data[$field] ? trim($data[$field]) : (string) $data[$field]);
         }
      }
      return $response;
   }

   private function getTanggalSeminar(): array
   {
      $table = $this->db->table('tb_jadwal_seminar');
      $table->select('min(tanggal_seminar) as tanggal_mulai, max(tanggal_seminar) as tanggal_sampai');
      $table->where(new RawSql('extract(month from tanggal_seminar) = extract(month from now())'));

      $get = $table->get();
      $data = $get->getRowArray();
      $fieldNames = $get->getFieldNames();
      $get->freeResult();

      $response = [];
      if (isset($data)) {
         foreach ($fieldNames as $field) {
            $response[$field] = ($data[$field] ? trim($data[$field]) : (string) $data[$field]);
         }
      }
      return $response;
   }
}
