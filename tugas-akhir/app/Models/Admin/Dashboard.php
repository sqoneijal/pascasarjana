<?php

namespace App\Models\Admin;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Dashboard extends Common
{

   public function initPage(array $post): array
   {
      return [
         'status_tesis' => [
            'seminar_proposal' => $this->getStatusTesis($post['id_periode'], [1, 3, 4, 5, 6, 7]),
            'seminar_hasil_penelitian' => $this->getStatusTesis($post['id_periode'], [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]),
            'sidang_munaqasyah' => $this->getStatusTesis($post['id_periode'], [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
         ],
         'kalender' => [
            'tanggal_seminar_proposal' => $this->getTanggalSeminar(),
            'tanggal_seminar_hasil_penelitian' => $this->getTanggalSeminarHasilPenelitian(),
            'tanggal_sidang_munaqasyah' => $this->getTanggalSidangMunaqasyah(),
            'peserta_seminar_proposal' => $this->getPesertaSidangProposal(),
            'peserta_seminar_hasil_penelitian' => $this->getPesertaSidangHasilPenelitian(),
            'peserta_sidang_munaqasyah' => $this->getPesertaSidangMunaqasyah(),
         ]
      ];
   }

   private function getPesertaSidangMunaqasyah(): array
   {
      $table = $this->db->table('tb_jadwal_sidang tjs');
      $table->select('tjs.tanggal, tjs.jam, tsta.nim, tsta.nama, tsta.id_periode');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.id = tjs.id_status_tugas_akhir');
      $table->where(new RawSql('extract(month from tjs.tanggal) = extract(month from now())'));

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

   private function getPesertaSidangHasilPenelitian(): array
   {
      $table = $this->db->table('tb_seminar_penelitian tsp');
      $table->select('tsp.tanggal_seminar, tsp.jam_seminar, tsta.nim, tsta.nama, tsta.id_periode');
      $table->join('tb_penelitian tp', 'tp.id = tsp.id_penelitian');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.id = tp.id_status_tugas_akhir');
      $table->where(new RawSql('extract(month from tsp.tanggal_seminar) = extract(month from now())'));

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

   private function getPesertaSidangProposal(): array
   {
      $table = $this->db->table('tb_jadwal_seminar tjs');
      $table->select('tjs.tanggal_seminar, tjs.jam_seminar, tsta.nim, tsta.nama, tsta.id_periode');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.id = tjs.id_status_tugas_akhir');
      $table->where(new RawSql('extract(month from tjs.tanggal_seminar) = extract(month from now())'));

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

   private function getStatusTesis(int $id_periode, array $id): array
   {
      $table = $this->db->table('tb_status_tesis tst');
      $table->select('tst.short_name, count(*) filter (where tst.id = tsta.status) as jumlah');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.status = tst.id and tsta.id_periode = ' . $id_periode, 'left');
      $table->whereIn('tst.id', $id);
      $table->groupBy('tst.short_name');

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
}
