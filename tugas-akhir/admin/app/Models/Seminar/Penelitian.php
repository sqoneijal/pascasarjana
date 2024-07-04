<?php

namespace App\Models\Seminar;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Penelitian extends Common
{

   public function hapusPenguji(array $post): array
   {
      try {
         $table = $this->db->table('tb_penguji_sidang');
         $table->where('id', $post['id']);
         $table->delete();

         $this->handleUpdateStatusTesis($post);

         return ['status' => true, 'content' => $this->getDaftarPenguji($post['nim'], $post['id_periode']), 'msg_response' => 'Data berhasil dihapus.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function handleUpdateStatusTesis(array $post): void
   {
      $table = $this->db->table('tb_penguji_sidang');
      $table->where('id_status_tugas_akhir', $post['id_status_tugas_akhir']);

      $found = $table->countAllResults() > 0;

      if (!$found) {
         $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], 16);
      }
   }

   public function submitPenguji(array $post): array
   {
      try {
         $fields = ['nidn', 'nama_dosen', 'id_kategori_kegiatan', 'id_status_tugas_akhir', 'penguji_ke'];
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
         $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], 17);

         return ['status' => true, 'content' => $this->getDaftarPenguji($post['nim'], $post['id_periode']), 'msg_response' => 'Data berhasil disimpan.'];
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

   public function submitJadwalSeminar(array $post): array
   {
      try {
         $fields = ['id_penelitian', 'tanggal_seminar', 'jam_seminar'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];

         $check = $this->checkJadwalHasilPenelitianSebelumnya($post['id_penelitian']);

         $table = $this->db->table('tb_seminar_penelitian');
         if ($check) {
            $data['modified'] = new RawSql('now()');

            $table->where('id_penelitian', $post['id_penelitian']);
            $table->update($data);
         } else {
            $data['uploaded'] = new RawSql('now()');

            $table->insert($data);
         }

         $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], 16);
         return ['status' => true, 'content' => $this->getJadwalSeminar($post['nim'], $post['id_periode']), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function checkJadwalHasilPenelitianSebelumnya(int $id_penelitian): bool
   {
      $table = $this->db->table('tb_seminar_penelitian');
      $table->where('id_penelitian', $id_penelitian);

      return $table->countAllResults() > 0;
   }

   public function submitTidakValidLampiran(array $post): array
   {
      try {
         $table = $this->db->table('tb_lampiran_upload');
         $table->where('id', $post['id']);
         $table->update([
            'keterangan' => $post['catatan'],
            'valid' => false,
            'modified' => new RawSql('now()'),
            'user_modified' => $post['user_modified']
         ]);
         return ['status' => true, 'content' => $this->getLampiranUpload($post), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submitValidLampiran(array $post): array
   {
      try {
         $table = $this->db->table('tb_lampiran_upload');
         $table->where('id', $post['id']);
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
         'syarat' => $this->getSyarat(),
         'lampiran' => $this->getLampiranUpload($post),
         'sk_penelitian' => $this->getSKPenelitian($post),
         'pembimbing' => $this->getPembimbingPenelitian($post),
         'penguji' => $this->getDaftarPenguji($post['nim'], $post['id_periode']),
         'jadwal_seminar' => $this->getJadwalSeminar($post['nim'], $post['id_periode'])
      ];
   }

   private function getDaftarPenguji(string $nim, int $id_periode): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tps.*, tkk.nama as kategori_kegiatan');
      $table->join('tb_penguji_sidang tps', 'tps.id_status_tugas_akhir = tsta.id');
      $table->join('tb_kategori_kegiatan tkk', 'tkk.id = tps.id_kategori_kegiatan');
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

   private function getJadwalSeminar(string $nim, int $id_periode): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tsp.*');
      $table->join('tb_penelitian tp', 'tp.id_status_tugas_akhir = tsta.id');
      $table->join('tb_seminar_penelitian tsp', 'tsp.id_penelitian = tp.id');
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

   private function getSyarat(): array
   {
      $table = $this->db->table('tb_mst_syarat');
      $table->where('syarat', '2');

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

   public function getData(array $post): array
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

   public function countData(array $post): int
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->join('tb_prodi tp', 'tp.id_feeder = tsta.id_prodi');
      $table->join('tb_status_tesis tst', 'tst.id = tsta.status');
      $table->whereIn('tsta.status', [13, 14, 15, 16, 17, 18, 19, 20, 21]);

      $this->dt_where($table, [
         'tsta.id_periode' => @$post['id_periode'],
      ]);
      return $table->countAllResults();
   }

   public function filteredData(array $post): int
   {
      $table = $this->queryData($post);
      return $table->countAllResults();
   }

   private function queryData(array $post): object
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tsta.id as id_status_tugas_akhir, tsta.nim, tsta.nama, tsta.angkatan, concat(tp.jenjang, \' \', tp.nama) as program_studi, tsta.status, tst.short_name as status_tesis, tsta.id_periode');
      $table->join('tb_prodi tp', 'tp.id_feeder = tsta.id_prodi');
      $table->join('tb_status_tesis tst', 'tst.id = tsta.status');
      $table->whereIn('tsta.status', [13, 14, 15, 16, 17, 18, 19, 20, 21]);

      $this->dt_where($table, [
         'tsta.id_periode' => @$post['id_periode'],
         'tsta.id_prodi' => @$post['id_prodi'],
         'tsta.angkatan' => @$post['angkatan'],
      ]);

      $this->prepareDatatableColumnSearch($table, ['tsta.nim', 'tsta.nama', 'tsta.angkatan', 'tp.nama']);
      $this->prepareDatatableColumnOrder($table, ['nim', 'nama', 'angkatan', 'program_studi', 'status']);

      return $table;
   }
}
