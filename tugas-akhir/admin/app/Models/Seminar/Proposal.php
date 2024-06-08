<?php

namespace App\Models\Seminar;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Proposal extends Common
{

   public function submitPembimbingPenelitian(array $post): array
   {
      try {
         $fields = ['id_penelitian', 'apakah_dosen_uin', 'pembimbing_ke', 'id_kategori_kegiatan', 'nidn', 'nama_dosen'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];

         $table = $this->db->table('tb_pembimbing_penelitian');
         if ($post['pageType'] === 'insert') {
            $data['uploaded'] = new RawSql('now()');

            $table->insert($data);

            $this->insertUsers($post);
         } elseif ($post['pageType'] === 'update') {
            $data['modified'] = new RawSql('now()');

            $table->where('id', $post['id']);
            $table->update($data);
         }

         $content = [
            'status' => $this->updateStatusTugasAkhir($post['id_status_tugas_akhir']),
            'pembimbingPenelitian' => $this->getDaftarPembimbingPenelitian($post['id_status_tugas_akhir']),
         ];

         return ['status' => true, 'content' => $content, 'msg_response' => 'Data berhasil disimpan.'];
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

   public function hapusPembimbingPenelitian(array $post): array
   {
      try {
         $table = $this->db->table('tb_pembimbing_penelitian');
         $table->where('id', $post['id']);
         $table->delete();

         $content = [
            'status' => $this->updateStatusTugasAkhir($post['id_status_tugas_akhir']),
            'pembimbingPenelitian' => $this->getDaftarPembimbingPenelitian($post['id_status_tugas_akhir']),
         ];

         return ['status' => true, 'content' => $content, 'msg_response' => 'Data berhasil dihapus.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submitPenetapanSK(array $post): array
   {
      try {
         $fields = ['id_status_tugas_akhir', 'id_periode', 'judul', 'nomor_sk_tugas', 'tanggal_sk_tugas', 'id_jenis_aktivitas', 'keterangan', 'lokasi', 'tanggal_mulai', 'tanggal_akhir', 'program_mbkm'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];

         $checkSKSebelumnya = $this->checkSKSebelumnya($post['id_status_tugas_akhir']);

         $table = $this->db->table('tb_penelitian');
         if ($checkSKSebelumnya) {
            $data['modified'] = new RawSql('now()');

            $table->where('id', $post['id']);
            $table->update($data);
         } else {
            $data['uploaded'] = new RawSql('now()');

            $table->insert($data);
         }

         $content = [
            'status' => $this->updateStatusTugasAkhir($post['id_status_tugas_akhir']),
            'penelitian' => $this->getDetailPenelitian($post['id_status_tugas_akhir']),
         ];

         return ['status' => true, 'content' => $content, 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function updateStatusTugasAkhir(int $id_status_tugas_akhir): string
   {
      $check = $this->checkPembimbingPenelitian($id_status_tugas_akhir);
      $status = $check ? 13 : 12;

      $table = $this->db->table('tb_status_tugas_akhir');
      $table->where('id', $id_status_tugas_akhir);
      $table->update(['status' => $status]);
      return $status;
   }

   private function checkPembimbingPenelitian(int $id_status_tugas_akhir): bool
   {
      $table = $this->db->table('tb_penelitian tp');
      $table->join('tb_pembimbing_penelitian tpp', 'tpp.id_penelitian = tp.id');
      $table->where('tp.id_status_tugas_akhir', $id_status_tugas_akhir);

      return $table->countAllResults() > 0;
   }

   private function checkSKSebelumnya(int $id_status_tugas_akhir): bool
   {
      $table = $this->db->table('tb_penelitian');
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
      $table->join('tb_prodi tp', 'tp.kode = tsta.kode_prodi');
      $table->whereIn('tsta.status', [7, 8, 9, 10, 11, 12, 13]);

      $this->dt_where($table, ['tsta.id_periode' => @$post['id_periode']]);
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
      $table->whereIn('tsta.status', [7, 8, 9, 10, 11, 12, 13]);

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
