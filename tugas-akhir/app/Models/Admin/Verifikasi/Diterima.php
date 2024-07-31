<?php

namespace App\Models\Admin\Verifikasi;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Diterima extends Common
{

   public function hapusPembimbing(array $post): array
   {
      try {
         $table = $this->db->table('tb_pembimbing_seminar');
         $table->where('id', $post['id']);
         $table->delete();

         $this->checkPembimbingSeminarProposal($post['id_status_tugas_akhir']);

         return ['status' => true, 'content' => $this->getPembimbingSeminarProposal($post), 'msg_response' => 'Data berhasil dihapus.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submitPembimbing(array $post): array
   {
      try {
         $fields = ['id_status_tugas_akhir', 'pembimbing_ke', 'id_kategori_kegiatan', 'nidn', 'nama_dosen'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];
         $data['apakah_dosen_uin'] = $post['apakah_dosen_uin'] === 't' ? true : false;

         $table = $this->db->table('tb_pembimbing_seminar');
         if ($post['pageType'] === 'insert') {
            $data['uploaded'] = new RawSql('now()');

            $table->ignore(true)->insert($data);

            $this->generateUser($post);
         } elseif ($post['pageType'] === 'update') {
            $data['modified'] = new RawSql('now()');

            $table->where('id', $post['id']);
            $table->update($data);
         }

         $this->checkPembimbingSeminarProposal($post['id_status_tugas_akhir']);

         return ['status' => true, 'content' => $this->getPembimbingSeminarProposal($post), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function checkPembimbingSeminarProposal(int $id_status_tugas_akhir): void
   {
      $table = $this->db->table('tb_pembimbing_seminar');
      $table->where('id_status_tugas_akhir', $id_status_tugas_akhir);

      $found = $table->countAllResults() > 0;

      if ($found) {
         $this->updateStatusTugasAkhir($id_status_tugas_akhir, 7);
      } else {
         $this->updateStatusTugasAkhir($id_status_tugas_akhir, 6);
      }
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

   private function checkExistUsers(string $nidn): bool
   {
      $table = $this->db->table('tb_users');
      $table->where('username', $nidn);

      return $table->countAllResults() > 0;
   }

   public function submitJadwalSeminar(array $post): array
   {
      try {
         $check = $this->checkJadwalSebelumnya($post['id_status_tugas_akhir']);

         $fields = ['id_status_tugas_akhir', 'tanggal_seminar', 'jam_seminar'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];

         $table = $this->db->table('tb_jadwal_seminar');
         if ($check) {
            $data['modified'] = new RawSql('now()');

            $table->where('id_status_tugas_akhir', $post['id_status_tugas_akhir']);
            $table->update($data);
         } else {
            $data['uploaded'] = new RawSql('now()');

            $table->insert($data);
         }

         $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], 6);
         return ['status' => true, 'content' => $this->getJadwalSeminarProposal($post), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function checkJadwalSebelumnya(int $id_status_tugas_akhir): bool
   {
      $table = $this->db->table('tb_jadwal_seminar');
      $table->where('id_status_tugas_akhir', $id_status_tugas_akhir);

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
      $table->join('tb_prodi tp', 'tp.id_feeder = tsta.id_prodi');
      $table->whereIn('tsta.status', [5, 6, 7]);

      $this->dt_where($table, [
         'tsta.id_periode' => $post['id_periode']
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
      $table->select('tsta.id as id_status_tugas_akhir, tsta.nim, tsta.nama, tsta.angkatan, concat(tp.jenjang, \' \', tp.nama) as program_studi, coalesce(tps.jumlah, 0) as jumlah_pembimbing, coalesce(tjs.jumlah, 0) as jumlah_jadwal_seminar, tsta.status, tsta.id_periode, tst.short_name as status_tesis');
      $table->join('tb_prodi tp', 'tp.id_feeder = tsta.id_prodi');
      $table->join('(select id_status_tugas_akhir, count(*) as jumlah from tb_pembimbing_seminar group by id_status_tugas_akhir) tps', 'tps.id_status_tugas_akhir = tsta.id', 'left');
      $table->join('(select id_status_tugas_akhir, count(*) as jumlah from tb_jadwal_seminar group by id_status_tugas_akhir) tjs', 'tjs.id_status_tugas_akhir = tsta.id', 'left');
      $table->join('tb_status_tesis tst', 'tst.id = tsta.status');
      $table->whereIn('tsta.status', [5, 6, 7]);

      $this->dt_where($table, [
         'tsta.id_periode' => $post['id_periode'],
         'tsta.id_prodi' => @$post['id_prodi'],
         'tsta.angkatan' => @$post['angkatan'],
      ]);

      $this->prepareDatatableColumnSearch($table, ['tsta.nim', 'tsta.nama', 'tsta.angkatan', 'tp.nama']);
      $this->prepareDatatableColumnOrder($table, ['nim', 'nama', 'angkatan', 'program_studi']);

      return $table;
   }
}
