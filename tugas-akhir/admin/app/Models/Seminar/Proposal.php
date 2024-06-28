<?php

namespace App\Models\Seminar;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Proposal extends Common
{

   public function hapusPembimbing(array $post): array
   {
      try {
         $table = $this->db->table('tb_pembimbing_penelitian');
         $table->where('id', $post['id']);
         $table->delete();

         return ['status' => true, 'content' => $this->getPembimbingPenelitian($post), 'msg_response' => 'Data berhasil dihapus.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submitPembimbing(array $post): array
   {
      try {
         $fields = ['id_penelitian', 'pembimbing_ke', 'id_kategori_kegiatan', 'nidn', 'nama_dosen'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];
         $data['apakah_dosen_uin'] = $post['apakah_dosen_uin'] === 't' ? true : false;

         $table = $this->db->table('tb_pembimbing_penelitian');
         if ($post['pageType'] === 'insert') {
            $data['uploaded'] = new RawSql('now()');

            $table->ignore(true)->insert($data);

            $this->generateUser($post);
         } elseif ($post['pageType'] === 'update') {
            $data['modified'] = new RawSql('now()');

            $table->where('id', $post['id']);
            $table->update($data);
         }

         return ['status' => true, 'content' => $this->getPembimbingPenelitian($post), 'msg_response' => 'Data berhasil disimpan.'];
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

   public function submitPenetapanSK(array $post): array
   {
      try {
         $check = $this->checkSKPenelitianSebelumnya($post);

         $fields = ['id_status_tugas_akhir', 'id_periode', 'judul', 'nomor_sk_tugas', 'tanggal_sk_tugas', 'id_jenis_aktivitas', 'keterangan', 'lokasi', 'tanggal_mulai', 'tanggal_akhir', 'program_mbkm', 'jenis_anggota'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];

         $id_penelitian = null;

         $table = $this->db->table('tb_penelitian');
         if ($check) {
            $data['modified'] = new RawSql('now()');

            $table->where('id_status_tugas_akhir', $post['id_status_tugas_akhir']);
            $table->where('id_periode', $post['id_periode']);
            $table->update($data);

            $id_penelitian = $post['id'];
         } else {
            $data['uploaded'] = new RawSql('now()');

            $table->insert($data);
            $id_penelitian = $this->db->insertID('tb_penelitian_id_seq');
         }

         $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], 13);
         $this->generateDefaultPembimbingPenelitian($post, $id_penelitian);

         $content = [
            'skPenelitian' => $this->getSKPenelitian($post),
            'pembimbing' => $this->getPembimbingPenelitian($post)
         ];

         return ['status' => true, 'content' => $content, 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function generateDefaultPembimbingPenelitian(array $post, int $id_penelitian): void
   {
      $check = $this->checkPembimbingPenelitian($id_penelitian);

      if (!$check) {
         $pembimbing = $this->getPembimbingSeminarProposal($post);

         $data = [];
         foreach ($pembimbing as $row) {
            array_push($data, [
               'id_penelitian' => $id_penelitian,
               'apakah_dosen_uin' => $row['apakah_dosen_uin'],
               'pembimbing_ke' => $row['pembimbing_ke'],
               'id_kategori_kegiatan' => $row['id_kategori_kegiatan'],
               'nidn' => $row['nidn'],
               'nama_dosen' => $row['nama_dosen'],
               'uploaded' => new RawSql('now()'),
               'user_modified' => $post['user_modified']
            ]);
         }

         $table = $this->db->table('tb_pembimbing_penelitian');
         $table->insertBatch($data);
      }
   }

   private function checkPembimbingPenelitian(int $id_penelitian): bool
   {
      $table = $this->db->table('tb_pembimbing_penelitian');
      $table->where('id_penelitian', $id_penelitian);

      return $table->countAllResults() > 0;
   }

   private function checkSKPenelitianSebelumnya(array $post): bool
   {
      $table = $this->db->table('tb_penelitian');
      $table->where('id_status_tugas_akhir', $post['id_status_tugas_akhir']);
      $table->where('id_periode', $post['id_periode']);

      return $table->countAllResults() > 0;
   }

   public function getDetail(array $post): array
   {
      return [
         'status_tugas_akhir' => $this->getStatusTugasAkhir($post),
         'syarat' => $this->getDaftarSyarat(),
         'lampiranUpload' => $this->getLampiranUpload($post),
         'skPenelitian' => $this->getSKPenelitian($post),
         'pembimbing' => $this->getPembimbingPenelitian($post)
      ];
   }

   private function getDaftarSyarat(): array
   {
      $table = $this->db->table('tb_mst_syarat');
      $table->where('syarat', '1');

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
      $table->select('tsta.id as id_status_tugas_akhir, tsta.nim, tsta.nama, tsta.angkatan, concat(tp.jenjang, \' \', tp.nama) as program_studi, tsta.status, tsta.id_periode, tss.short_name as status_tesis');
      $table->join('tb_prodi tp', 'tp.id_feeder = tsta.id_prodi');
      $table->join('tb_status_tesis tss', 'tss.id = tsta.status', 'left');
      $table->whereIn('tsta.status', [7, 8, 9, 10, 11, 12, 13]);

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
