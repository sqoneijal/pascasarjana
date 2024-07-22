<?php

namespace App\Models;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Sidang extends Common
{

   public function hapusPenguji(array $post): array
   {
      try {
         $table = $this->db->table('tb_penguji_sidang');
         $table->where('id', $post['id']);
         $table->delete();

         $this->handleUpdateStatusTugasAkhir($post['id_status_tugas_akhir']);

         return ['status' => true, 'content' => $this->getPengujiSidangMunaqasyah($post['nim'], $post['id_periode']), 'msg_response' => 'Data berhasil dihapus.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function handleUpdateStatusTugasAkhir(int $id_status_tugas_akhir): void
   {
      $table = $this->db->table('tb_penguji_sidang');
      $table->where('id_status_tugas_akhir', $id_status_tugas_akhir);

      $count = $table->countAllResults();
      if ($count === 0) {
         $this->updateStatusTugasAkhir($id_status_tugas_akhir, 24);
      }
   }

   public function submitPenguji(array $post): array
   {
      try {
         $fields = ['id_status_tugas_akhir', 'penguji_ke', 'nidn', 'nama_dosen', 'id_kategori_kegiatan'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];
         $data['apakah_dosen_uin'] = $post['apakah_dosen_uin'] === 't';

         $table = $this->db->table('tb_penguji_sidang');
         if ($post['pageType'] === 'insert') {
            $data['uploaded'] = new RawSql('now()');

            $table->insert($data);
         } elseif ($post['pageType'] === 'update') {
            $data['modified'] = new RawSql('now()');

            $table->where('id', $post['id']);
            $table->update($data);
         }

         $this->generateUser($post);
         $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], 25);

         return ['status' => true, 'content' => $this->getPengujiSidangMunaqasyah($post['nim'], $post['id_periode']), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function checkExistUsers(string $nidn): bool
   {
      $table = $this->db->table('tb_users');
      $table->where('username', $nidn);

      return $table->countAllResults() > 0;
   }

   private function generateUser(array $post): void
   {
      $check = $this->checkExistUsers($post['nidn']);
      if (!$check) {
         $table = $this->db->table('tb_users');
         $table->insert([
            'nama' => $post['nama_dosen'],
            'username' => $post['nidn'],
            'role' => '3',
            'password' => password_hash($post['nidn'], PASSWORD_BCRYPT),
            'uploaded' => new RawSql('now()'),
            'user_modified' => $post['user_modified']
         ]);
      }
   }

   public function submitJadwalSidang(array $post): array
   {
      try {
         $check = $this->checkJadwalSebelumnya($post['id_status_tugas_akhir']);

         $fields = ['id_status_tugas_akhir', 'tanggal', 'jam'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];

         $table = $this->db->table('tb_jadwal_sidang');
         if ($check) {
            $data['modified'] = new RawSql('now()');

            $table->where('id_status_tugas_akhir', $post['id_status_tugas_akhir']);
            $table->update($data);
         } else {
            $data['uploaded'] = new RawSql('now()');

            $table->insert($data);
         }

         $this->handleUpdateStatusTugasAkhirJadwalSidang($post);

         return ['status' => true, 'content' => $post, 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function handleUpdateStatusTugasAkhirJadwalSidang(array $post): void
   {
      $status = $this->hitungJumlahPengujiSidangMunaqasyah($post['id_status_tugas_akhir']);
      $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], $status ? 25 : 24);
   }

   private function hitungJumlahPengujiSidangMunaqasyah(int $id_status_tugas_akhir): bool
   {
      $table = $this->db->table('tb_penguji_sidang');
      $table->where('id_status_tugas_akhir', $id_status_tugas_akhir);

      return $table->countAllResults() > 0;
   }

   private function checkJadwalSebelumnya(int $id_status_tugas_akhir): bool
   {
      $table = $this->db->table('tb_jadwal_sidang');
      $table->where('id_status_tugas_akhir', $id_status_tugas_akhir);

      return $table->countAllResults() > 0;
   }

   public function submitNotValidLampiran(array $post): array
   {
      try {
         $table = $this->db->table('tb_lampiran_upload');
         $table->where('nim', $post['nim']);
         $table->where('id_syarat', $post['id_syarat']);
         $table->update([
            'valid' => false,
            'keterangan' => $post['keterangan'],
            'modified' => new RawSql('now()'),
            'user_modified' => $post['user_modified']
         ]);

         $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], 30);

         return ['status' => true, 'content' => $this->getLampiranUpload($post), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submitValidLampiran(array $post): array
   {
      try {
         $table = $this->db->table('tb_lampiran_upload');
         $table->where('nim', $post['nim']);
         $table->where('id_syarat', $post['id_syarat']);
         $table->update([
            'valid' => true,
            'modified' => new RawSql('now()'),
            'user_modified' => $post['user_modified']
         ]);
         return ['status' => true, 'content' => $this->getLampiranUpload($post), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function getDetail(array $post): array
   {
      return [
         'identitas' => $this->getIdentitas($post['nim'], $post['id_periode']),
         'syarat' => $this->getSyarat('3'),
         'lampiran_upload' => $this->getLampiranUpload($post),
         'sk_penelitian' => $this->getSKPenelitian($post),
         'tim_pembimbing' => $this->getPembimbingPenelitian($post),
         'tim_penguji_hasil_sidang' => $this->getPengujiHasilPenelitian($post['nim'], $post['id_periode']),
         'jadwal_sidang' => $this->getJadwalSidang($post['nim'], $post['id_periode']),
         'tim_penguji_sidang' => $this->getPengujiSidangMunaqasyah($post['nim'], $post['id_periode'])
      ];
   }

   private function getPengujiSidangMunaqasyah(string $nim, int $id_periode): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tps.*, tkk.nama as kategori_kegiatan');
      $table->join('tb_penguji_sidang tps', 'tps.id_status_tugas_akhir = tsta.id');
      $table->join('tb_kategori_kegiatan tkk', 'tkk.id = tps.id_kategori_kegiatan');
      $table->where('tsta.nim', $nim);
      $table->where('tsta.id_periode', $id_periode);
      $table->orderBy('tps.penguji_ke');

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

   private function getJadwalSidang(string $nim, int $id_periode): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tjs.*');
      $table->join('tb_jadwal_sidang tjs', 'tjs.id_status_tugas_akhir = tsta.id');
      $table->where('tsta.nim', $nim);
      $table->where('tsta.id_periode', $id_periode);

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

   private function getPengujiHasilPenelitian(string $nim, int $id_periode): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tspd.id, tspd.id_seminar_penelitian, tspd.penguji_ke, tspd.nidn, tspd.nama_dosen, tspd.id_kategori_kegiatan, tkk.nama as kategori_kegiatan, tspd.apakah_dosen_uin, tspd.lanjut_sidang, tspd.keterangan_perbaikan');
      $table->join('tb_penelitian tp', 'tp.id_status_tugas_akhir = tsta.id');
      $table->join('tb_seminar_penelitian tsp', 'tsp.id_penelitian = tp.id');
      $table->join('tb_seminar_penelitian_detail tspd', 'tspd.id_seminar_penelitian = tsp.id');
      $table->join('tb_kategori_kegiatan tkk', 'tkk.id = tspd.id_kategori_kegiatan');
      $table->where('tsta.nim', $nim);
      $table->where('tsta.id_periode', $id_periode);
      $table->orderBy('penguji_ke');

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

   private function getIdentitas(string $nim, string $id_periode): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tsta.id as id_status_tugas_akhir, tsta.nim, tsta.nama, tsta.angkatan, tsta.email, tsta.hp, tsta.status, tp.judul as judul_penelitian, concat(tp2.tahun_ajaran, tp2.id_semester) as periode, concat(tp3.jenjang, \' \', tp3.nama) as program_studi');
      $table->join('tb_penelitian tp', 'tp.id_status_tugas_akhir = tsta.id');
      $table->join('tb_periode tp2', 'tp2.id = tsta.id_periode');
      $table->join('tb_prodi tp3', 'tp3.id_feeder = tsta.id_prodi');
      $table->where('tsta.nim', $nim);
      $table->where('tsta.id_periode', $id_periode);

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
      $table->join('tb_prodi tp', 'tp.id_feeder = tsta.id_prodi');
      $table->join('tb_status_tesis tst', 'tst.id = tsta.status');
      $table->where(new RawSql('tsta.status >= 22'));

      $this->dt_where($table, [
         'tsta.id_periode' => @$post['id_periode']
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
      $table->select('tsta.id as id_status_tugas_akhir, tsta.nim, tsta.nama, tsta.angkatan, concat(tp.jenjang, \' \', tp.nama) as program_studi, tsta.status, tst.short_name as status_tesis, tsta.id_periode');
      $table->join('tb_prodi tp', 'tp.id_feeder = tsta.id_prodi');
      $table->join('tb_status_tesis tst', 'tst.id = tsta.status');
      $table->where(new RawSql('tsta.status >= 22'));

      $this->dt_where($table, [
         'tsta.id_periode' => @$post['id_periode'],
         'tsta.id_prodi' => @$post['id_prodi'],
         'tsta.angkatan' => @$post['angkatan'],
      ]);

      $this->prepareDatatableColumnOrder($table, ['tsta.nim', 'tsta.nama', 'tsta.angkatan', 'tp.nama', 'tst.short_name']);
      $this->prepareDatatableColumnSearch($table, ['nim', 'nama', 'angkatan', 'program_studi', 'status']);

      return $table;
   }
}
