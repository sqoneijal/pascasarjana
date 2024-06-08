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

         $this->checkPengujiSidangSetelahHapus($post['nim']);

         return ['status' => true, 'content' => $this->getPengujiSidang($post['nim']), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function checkPengujiSidangSetelahHapus(string $nim): void
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->join('tb_penguji_sidang tps', 'tps.id_status_tugas_akhir = tsta.id');
      $table->where('tsta.nim', $nim);

      if ($table->countAllResults() < 1) {
         $this->updateStatusTugasAkhir($nim, 24);
      }
   }

   public function submitTimPenguji(array $post): array
   {
      try {
         $fields = ['id_status_tugas_akhir', 'penguji_ke', 'nidn', 'nama_dosen', 'id_kategori_kegiatan', 'apakah_dosen_uin'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];

         $table = $this->db->table('tb_penguji_sidang');
         if ($post['pageType'] === 'insert') {
            $data['uploaded'] = new RawSql('now()');

            $table->insert($data);

            $this->insertUsers($post);
         } elseif ($post['pageType'] === 'update') {
            $data['modified'] = new RawSql('now()');

            $table->where('id', $post['id']);
            $table->update($data);
         }

         $this->updateStatusTugasAkhir($post['nim'], 25);

         return ['status' => true, 'content' => $this->getPengujiSidang($post['nim']), 'msg_response' => 'Data berhasil disimpan.'];
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

   public function submitJadwalSidang(array $post): array
   {
      try {
         $check = $this->checkJadwalSidangSebelumnya($post['id_status_tugas_akhir']);

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

            $table->where('id', $post['id']);
            $table->update($data);
         } else {
            $data['uploaded'] = new RawSql('now()');
            $table->insert($data);
         }

         $checkApakahSudahAdaPenguji = $this->checkApakahSudahAdaPenguji($post['nim']);

         $this->updateStatusTugasAkhir($post['nim'], $checkApakahSudahAdaPenguji ? 25 : 24);
         return ['status' => true, 'content' => $this->getJadwalSidang($post['nim']), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function checkApakahSudahAdaPenguji(string $nim): bool
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->join('tb_penguji_sidang tps', 'tps.id_status_tugas_akhir = tsta.id');
      $table->where('tsta.nim', $nim);

      return $table->countAllResults() > 0;
   }

   private function updateStatusTugasAkhir(string $nim, int $value): void
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->where('nim', $nim);
      $table->where('id_periode', function ($table) {
         return $table->select('id')->from('tb_periode')->where('status', true);
      });
      $table->update(['status' => $value]);
   }

   private function checkJadwalSidangSebelumnya(int $id_status_tugas_akhir): bool
   {
      $table = $this->db->table('tb_jadwal_sidang');
      $table->where('id_status_tugas_akhir', $id_status_tugas_akhir);

      return $table->countAllResults() > 0;
   }

   public function getDetailSidang(string $nim): array
   {
      return [
         'statusTugasAkhir' => $this->getStatusTugasAkhir($nim),
         'lampiranSidang' => $this->getLampiranSidang($nim),
         'pembimbing' => $this->getPembimbingSeminarPenelitian($nim),
         'jadwalSidang' => $this->getJadwalSidang($nim),
         'penguji' => $this->getPengujiSidang($nim)
      ];
   }

   private function getPengujiSidang(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tps.id, tps.id_status_tugas_akhir, tps.penguji_ke, tps.nidn, tps.nama_dosen, tps.id_kategori_kegiatan, tkk.nama as kategori_kegiatan, tps.apakah_dosen_uin, tps.keterangan_perbaikan, tps.telah_sidang');
      $table->join('tb_penguji_sidang tps', 'tps.id_status_tugas_akhir = tsta.id');
      $table->join('tb_kategori_kegiatan tkk', 'tkk.id = tps.id_kategori_kegiatan');
      $table->where('tsta.nim', $nim);
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

   private function getJadwalSidang(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tjs.id, tjs.id_status_tugas_akhir, tjs.tanggal, tjs.jam');
      $table->join('tb_jadwal_sidang tjs', 'tjs.id_status_tugas_akhir = tsta.id');
      $table->where('tsta.nim', $nim);

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

   private function getPembimbingSeminarPenelitian(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tpp.id, tpp.id_penelitian, tpp.apakah_dosen_uin, tpp.pembimbing_ke, tpp.id_kategori_kegiatan, tkk.nama as kategori_kegiatan, tpp.nidn, tpp.nama_dosen, tpp.seminar_penelitian, tpp.boleh_seminar, tpp.boleh_sidang');
      $table->join('tb_penelitian tp', 'tp.id_status_tugas_akhir = tsta.id');
      $table->join('tb_pembimbing_penelitian tpp', 'tpp.id_penelitian = tp.id');
      $table->join('tb_kategori_kegiatan tkk', 'tkk.id = tpp.id_kategori_kegiatan');
      $table->where('tsta.nim', $nim);
      $table->orderBy('tpp.pembimbing_ke');

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

   private function getLampiranSidang(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tm.*');
      $table->join('tb_munaqasyah tm', 'tm.id_status_tugas_akhir = tsta.id');
      $table->where('tsta.nim', $nim);

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

   private function getStatusTugasAkhir(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tsta.id, tsta.nim, tsta.status, tsta.id_periode, tsta.kode_prodi, tsta.nama, tsta.angkatan, tsta.nidn_penasehat, tsta.email, tsta.hp, concat(tp.tahun_ajaran, tp.id_semester) as periode, concat(tp2.jenjang, \' \', tp2.nama) as program_studi');
      $table->join('tb_periode tp', 'tp.id = tsta.id_periode');
      $table->join('tb_prodi tp2', 'tp2.kode = tsta.kode_prodi');
      $table->where('tsta.nim', $nim);

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
      $table->join('tb_prodi tp', 'tp.kode = tsta.kode_prodi');
      $table->whereIn('tsta.status', [22, 23, 24, 25, 26, 27, 28, 29]);
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
      $table->whereIn('tsta.status', [22, 23, 24, 25, 26, 27, 28, 29]);

      $this->dt_where($table, [
         'tsta.id_periode' => @$post['id_periode'],
         'tsta.kode_prodi' => @$post['kode_prodi'],
         'tsta.angkatan' => @$post['angkatan'],
      ]);

      $this->prepareDatatableColumnSearch($table, ['tsta.nim', 'tsta.nama', 'tsta.angkatan', 'tp.jenjang', 'tp.nama']);
      $this->prepareDatatableColumnOrder($table, ['nim', 'nama', 'angkatan', 'program_studi', 'status']);

      return $table;
   }
}
