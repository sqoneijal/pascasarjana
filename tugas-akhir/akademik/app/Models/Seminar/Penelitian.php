<?php

namespace App\Models\Seminar;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Penelitian extends Common
{

   public function hapusPenguji(array $post): array
   {
      try {
         $table = $this->db->table('tb_seminar_penelitian_detail');
         $table->where('id', $post['id']);
         $table->delete();

         return ['status' => true, 'content' => $this->getDetailPengujiPenelitian($post['id_status_tugas_akhir']), 'msg_response' => 'Data berhasil dihapus.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function getDetailPengujiPenelitian(int $id_status_tugas_akhir): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tspd.*, tkk.nama as kategori_kegiatan, tsta.id as id_status_tugas_akhir');
      $table->join('tb_penelitian tp', 'tp.id_status_tugas_akhir = tsta.id');
      $table->join('tb_seminar_penelitian tsp', 'tsp.id_penelitian = tp.id');
      $table->join('tb_seminar_penelitian_detail tspd', 'tspd.id_seminar_penelitian = tsp.id');
      $table->join('tb_kategori_kegiatan tkk', 'tkk.id = tspd.id_kategori_kegiatan');
      $table->where('tsta.id', $id_status_tugas_akhir);

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

   public function submitPenguji(array $post): array
   {
      try {
         $fields = ['id_seminar_penelitian', 'penguji_ke', 'nidn', 'nama_dosen', 'id_kategori_kegiatan', 'apakah_dosen_uin'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];

         $table = $this->db->table('tb_seminar_penelitian_detail');
         if ($post['pageType'] === 'insert') {
            $data['uploaded'] = new RawSql('now()');

            $table->insert($data);

            $this->insertUsers($post);
         } elseif ($post['pageType'] === 'update') {
            $data['modified'] = new RawSql('now()');

            $table->where('id', $post['id']);
            $table->update($data);
         }

         $this->updateStatusTesis($post['id_status_tugas_akhir'], 17);

         return ['status' => true, 'content' => $this->getDetailPengujiPenelitian($post['id_status_tugas_akhir']), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function insertUsers(array $post): void
   {
      $table = $this->db->table('tb_users');
      $table->ignore(true)->insert([
         'nama' => $post['nama_dosen'],
         'username' => $post['nidn'],
         'role' => '3',
         'password' => password_hash($post['nidn'], PASSWORD_BCRYPT),
         'uploaded' => new RawSql('now()'),
         'user_modified' => $post['user_modified']
      ]);
   }

   public function submitJadwalSeminar(array $post): array
   {
      $response = ['status' => false, 'msg_response' => 'Terjadi sesuatu kesalahan.', 'errors' => []];
      try {
         $fields = ['id_penelitian', 'tanggal_seminar', 'jam_seminar'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $check = $this->checkJadwalSeminarPenelitian($data['id_penelitian']);

         $data['user_modified'] = $post['user_modified'];

         $table = $this->db->table('tb_seminar_penelitian');
         if ($check) {
            $data['modified'] = new RawSql('now()');

            $table->where('id', $post['id']);
            $table->update($data);
         } else {
            $data['uploaded'] = new RawSql('now()');

            $table->insert($data);
         }

         $this->updateStatusTesis($post['id_status_tugas_akhir'], 16);

         $response['status'] = true;
         $response['msg_response'] = 'Data berhasil disimpan.';
         $response['content'] = $this->getDetailJadwalSeminarPenelitian($post['id_status_tugas_akhir']);
      } catch (\Exception $e) {
         $response['msg_response'] = $e->getMessage();
      }
      return $response;
   }

   public function getDetailJadwalSeminarPenelitian(int $id_status_tugas_akhir): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tsp.*');
      $table->join('tb_penelitian tp', 'tp.id_status_tugas_akhir = tsta.id');
      $table->join('tb_seminar_penelitian tsp', 'tsp.id_penelitian = tp.id');
      $table->where('tsta.id', $id_status_tugas_akhir);

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

   private function updateStatusTesis(int $id_status_tugas_akhir, string $status): void
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->where('id', $id_status_tugas_akhir);
      $table->update(['status' => $status]);
   }

   private function checkJadwalSeminarPenelitian(int $id_penelitian): bool
   {
      $table = $this->db->table('tb_seminar_penelitian');
      $table->where('id_penelitian', $id_penelitian);

      return $table->countAllResults() > 0;
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
      $table->join('tb_prodi tp', 'tp.kode = tsta.kode_prodi');
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
      $table->select('tsta.id, tsta.nim, tsta.nama, tsta.angkatan, concat(tp.jenjang, \' \', tp.nama) as program_studi, tsta.status');
      $table->join('tb_prodi tp', 'tp.kode = tsta.kode_prodi');
      $table->whereIn('tsta.status', [13, 14, 15, 16, 17, 18, 19, 20, 21]);

      $this->dt_where($table, [
         'tsta.id_periode' => @$post['id_periode'],
         'tsta.kode_prodi' => @$post['kode_prodi'],
         'tsta.angkatan' => @$post['angkatan'],
      ]);

      $this->prepareDatatableColumnSearch($table, ['tsta.nim', 'tsta.nama', 'tsta.angkatan', 'tp.nama']);
      $this->prepareDatatableColumnOrder($table, ['nim', 'nama', 'angkatan', 'program_studi', 'status']);

      return $table;
   }
}
