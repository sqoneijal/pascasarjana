<?php

namespace App\Models\Verifikasi;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Diterima extends Common
{

   private function validasiJadwalDanPembimbing(int $id_status_tugas_akhir): bool
   {
      $jadwal = $this->db->table('tb_jadwal_seminar');
      $jadwal->where('id_status_tugas_akhir', $id_status_tugas_akhir);

      $jumlahJadwal = $jadwal->countAllResults();

      $pembimbing = $this->db->table('tb_pembimbing_seminar');
      $pembimbing->where('id_status_tugas_akhir', $id_status_tugas_akhir);

      $jumlahPembimbing = $pembimbing->countAllResults();

      $response = false;
      $status = 6;
      if ($jumlahJadwal > 0 && $jumlahPembimbing > 0) {
         $status = 7;
         $response = true;
      }
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->where('id', $id_status_tugas_akhir);
      $table->update(['status' => $status]);
      return $response;
   }

   public function submitJadwalSeminar(array $post): array
   {
      try {
         $checkJadwalSebelumnya = $this->checkJadwalSebelumnya($post['id_status_tugas_akhir']);

         $fields = ['tanggal_seminar', 'jam_seminar'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];

         $table = $this->db->table('tb_jadwal_seminar');
         if ($checkJadwalSebelumnya) {
            $data['modified'] = new RawSql('now()');

            $table->where('id_status_tugas_akhir', $post['id_status_tugas_akhir']);
            $table->update($data);
         } else {
            $data['uploaded'] = new RawSql('now()');
            $data['id_status_tugas_akhir'] = $post['id_status_tugas_akhir'];

            $table->insert($data);
         }

         $this->validasiJadwalDanPembimbing($post['id_status_tugas_akhir']);

         return ['status' => true, 'content' => $this->getDetailJadwalSeminar($post['id_status_tugas_akhir']), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function checkJadwalSebelumnya(int $id_status_tugas_akhir): bool
   {
      $table = $this->db->table('tb_jadwal_seminar');
      $table->where('id_status_tugas_akhir', $id_status_tugas_akhir);

      $count = $table->countAllResults();

      return $count > 0 ? true : false;
   }

   public function hapusPembimbing(array $post): array
   {
      try {
         $table = $this->db->table('tb_pembimbing_seminar');
         $table->where('id', $post['id']);
         $table->delete();
         return ['status' => true, 'content' => $this->getDaftarPembimbing($post['id_status_tugas_akhir']), 'msg_response' => 'Data berhasil dihapus.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submitTimPembimbing(array $post): array
   {
      try {
         $fields = ['id_status_tugas_akhir', 'pembimbing_ke', 'id_kategori_kegiatan', 'nidn', 'nama_dosen', 'apakah_dosen_uin'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];

         $table = $this->db->table('tb_pembimbing_seminar');
         if ($post['pageType'] === 'insert') {
            $data['uploaded'] = new RawSql('now()');

            $table->ignore(true)->insert($data);

            $this->insertUsers($post);
         } elseif ($post['pageType'] === 'update') {
            $data['modified'] = new RawSql('now()');

            $table->where('id', $post['id']);
            $table->update($data);
         }

         $this->validasiJadwalDanPembimbing($post['id_status_tugas_akhir']);

         return ['status' => true, 'content' => $this->getDaftarPembimbing($post['id_status_tugas_akhir']), 'msg_response' => 'Data berhasil disimpan.'];
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
      $table->select('tsta.id, tsta.nim, tsta.nama, tsta.angkatan, concat(tp.jenjang, \' \', tp.nama) as program_studi, coalesce(tps.jumlah, 0) as jumlah_pembimbing, coalesce(tjs.jumlah, 0) as jumlah_jadwal_seminar, tsta.status');
      $table->join('tb_prodi tp', 'tp.kode = tsta.kode_prodi');
      $table->join('(select id_status_tugas_akhir, count(*) as jumlah from tb_pembimbing_seminar group by id_status_tugas_akhir) tps', 'tps.id_status_tugas_akhir = tsta.id', 'left');
      $table->join('(select id_status_tugas_akhir, count(*) as jumlah from tb_jadwal_seminar group by id_status_tugas_akhir) tjs', 'tjs.id_status_tugas_akhir = tsta.id', 'left');
      $table->whereIn('tsta.status', [5, 6, 7]);

      $this->dt_where($table, [
         'tsta.id_periode' => $post['id_periode'],
         'tsta.kode_prodi' => @$post['kode_prodi'],
         'tsta.angkatan' => @$post['angkatan'],
      ]);

      $this->prepareDatatableColumnSearch($table, ['tsta.nim', 'tsta.nama', 'tsta.angkatan', 'tp.nama']);
      $this->prepareDatatableColumnOrder($table, ['nim', 'nama', 'angkatan', 'program_studi']);

      return $table;
   }
}
