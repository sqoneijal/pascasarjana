<?php

namespace App\Models;

use CodeIgniter\Database\RawSql;

class Proposal extends Common
{

   public function updateStatusTesis(array $post): array
   {
      try {
         $this->updateStatusSudahSeminar($post);
         $this->handleUpdateStatusTugasAkhir($post);
         return ['status' => true, 'content' => $this->getStatusTugasAkhir($post), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submitSudahSeminar(array $post): array
   {
      try {
         $table = $this->db->table('tb_status_tugas_akhir');
         $table->where('id', $post['id_status_tugas_akhir']);
         $table->update([
            'judul_proposal_final' => $post['judul_proposal_final'],
            'modified' => new RawSql('now()')
         ]);

         $this->updateStatusSudahSeminar($post);
         $this->handleUpdateStatusTugasAkhir($post);

         return ['status' => true, 'content' => $this->getStatusTugasAkhir($post), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function updateStatusSudahSeminar(array $post): void
   {
      $table = $this->db->table('tb_pembimbing_seminar');
      $table->where('id_status_tugas_akhir', $post['id_status_tugas_akhir']);
      $table->where('nidn', $post['nidn']);
      $table->update([
         'sudah_seminar' => true,
         'modified' => new RawSql('now()'),
         'user_modified' => $post['nidn']
      ]);
   }

   private function handleUpdateStatusTugasAkhir(array $post): void
   {
      $check = $this->checkStatusSudahSeminar($post['id_status_tugas_akhir']);
      $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], ($check ? 11 : $post['status_tesis']));
   }

   private function checkStatusSudahSeminar(int $id_status_tugas_akhir): bool
   {
      $table = $this->db->table('tb_pembimbing_seminar');
      $table->select('count(*) filter (where sudah_seminar = true) as sudah_seminar, count(*) filter (where sudah_seminar != true) as belum_seminar');
      $table->where('id_status_tugas_akhir', $id_status_tugas_akhir);

      $get = $table->get();
      $data = $get->getRowArray();
      $get->freeResult();

      $sudah_seminar = (int) $data['sudah_seminar'];
      $belum_seminar = (int) $data['belum_seminar'];

      return $sudah_seminar > $belum_seminar;
   }

   public function submitPerbaiki(array $post): array
   {
      try {
         $table = $this->db->table('tb_pembimbing_seminar');
         $table->where('nidn', $post['nidn']);
         $table->where('id_status_tugas_akhir', $post['id_status_tugas_akhir']);
         $table->update([
            'keterangan_perbaikan' => $post['keterangan'],
            'modified' => new RawSql('now()'),
            'sudah_seminar' => false
         ]);

         $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], 9);
         return ['status' => true, 'content' => $this->getDaftarPembimbing($post), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function getDetail(array $post): array
   {
      return [
         'status_tugas_akhir' => $this->getStatusTugasAkhir($post),
         'syarat' => $this->getDaftarSyaratSeminarProposal(1),
         'lampiran_upload' => $this->getDaftarLampiranUpload($post['nim']),
         'jadwal_seminar' => $this->getJadwalSeminarProposal($post),
         'pembimbing' => $this->getDaftarPembimbing($post)
      ];
   }

   public function getDaftarPembimbing(array $post): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tps.id_status_tugas_akhir, tps.pembimbing_ke, tps.id_kategori_kegiatan, tkk.nama as kategori_kegiatan, tps.nidn, tps.nama_dosen, tps.sudah_seminar, tps.keterangan_perbaikan, tps.apakah_dosen_uin');
      $table->join('tb_pembimbing_seminar tps', 'tps.id_status_tugas_akhir = tsta.id');
      $table->join('tb_kategori_kegiatan tkk', 'tkk.id = tps.id_kategori_kegiatan');
      $table->where('tsta.nim', $post['nim']);
      $table->where('tsta.id_periode', $post['id_periode']);
      $table->orderBy('tps.pembimbing_ke');

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

   public function getJadwalSeminarProposal(array $post): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tjs.tanggal_seminar, tjs.jam_seminar');
      $table->join('tb_jadwal_seminar tjs', 'tjs.id_status_tugas_akhir = tsta.id');
      $table->where('tsta.nim', $post['nim']);
      $table->where('tsta.id_periode', $post['id_periode']);

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

   public function getDaftarLampiranUpload(string $nim): array
   {
      $table = $this->db->table('tb_lampiran_upload');
      $table->select('id_syarat, lampiran, id_google_drive');
      $table->where('nim', $nim);

      $get = $table->get();
      $result = $get->getResultArray();
      $get->freeResult();

      $response = [];
      foreach ($result as $row) {
         $response[$row['id_syarat']] = $row;
      }
      return $response;
   }

   public function getDaftarSyaratSeminarProposal(string $syarat): array
   {
      $table = $this->db->table('tb_mst_syarat');
      $table->where('syarat', $syarat);

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

   public function getStatusTugasAkhir(array $post): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tsta.id as id_status_tugas_akhir, tsta.nim, tsta.id_periode, concat(tp.tahun_ajaran, tp.id_semester) as periode, tsta.nama, tsta.angkatan, tsta.email, tsta.hp, tsta.status, tsta.id_prodi, concat(tp2.jenjang, \' \', tp2.nama) as program_studi, tsta.judul_proposal_1, tsta.judul_proposal_2, tsta.judul_proposal_3, tsta.judul_proposal_final, tsta.keterangan');
      $table->join('tb_periode tp', 'tp.id = tsta.id_periode');
      $table->join('tb_prodi tp2', 'tp2.id_feeder = tsta.id_prodi');
      $table->where('tsta.nim', $post['nim']);
      $table->where('tsta.id_periode', $post['id_periode']);

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

   public function getData($post = [])
   {
      try {
         $table = $this->queryData($post);
         $table->limit((int) $post['length'], (int) $post['start']);

         $get = $table->get();
         $result = $get->getResultArray();
         $fieldNames = $get->getFieldNames();

         $get->freeResult();

         $response = [];
         foreach ($result as $key => $val) {
            foreach ($fieldNames as $field) {
               $response[$key][$field] = ($val[$field] ? trim($val[$field]) : '');
            }
         }
         return $response;
      } catch (\Exception $e) {
         die($e->getMessage());
      }
   }

   public function countData($post = [])
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->join('tb_pembimbing_seminar tps', 'tps.id_status_tugas_akhir = tsta.id');
      $table->join('tb_prodi tp', 'tp.id_feeder = tsta.id_prodi');
      $table->join('tb_jadwal_seminar tjs', 'tjs.id_status_tugas_akhir = tsta.id');
      $table->whereIn('tsta.status', [7, 8, 9, 10]);

      $this->dt_where($table, [
         'tsta.id_periode' => $post['id_periode'],
         'tps.nidn' => $post['nidn']
      ]);

      return $table->countAllResults();
   }

   public function filteredData($post = [])
   {
      $table = $this->queryData($post);
      return $table->countAllResults();
   }

   private function queryData($post = [])
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tsta.id as id_status_tugas_akhir, tsta.nim, tsta.nama, tsta.angkatan, concat(tp.jenjang, \' \', tp.nama) as program_studi, tjs.tanggal_seminar, tjs.jam_seminar, tsta.status, tsta.id_periode, tst.short_name as status_tesis');
      $table->join('tb_pembimbing_seminar tps', 'tps.id_status_tugas_akhir = tsta.id');
      $table->join('tb_prodi tp', 'tp.id_feeder = tsta.id_prodi');
      $table->join('tb_jadwal_seminar tjs', 'tjs.id_status_tugas_akhir = tsta.id');
      $table->join('tb_status_tesis tst', 'tst.id = tsta.status', 'left');
      $table->whereIn('tsta.status', [7, 8, 9, 10]);

      $this->dt_where($table, [
         'tsta.id_periode' => $post['id_periode'],
         'tps.nidn' => $post['nidn']
      ]);

      $this->datatableColumnSearch($table, ['tsta.nim', 'tsta.nama', 'tsta.angkatan', 'tp.nama']);
      $this->datatableColumnOrder($table, ['nim', 'nama', 'angkatan', 'program_studi', 'tanggal_seminar', 'status']);

      return $table;
   }
}
