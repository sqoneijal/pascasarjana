<?php

namespace App\Models\SidangMunaqasyah;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Penguji extends Common
{

   public function submitPerbaikiHasilSidang(array $post): array
   {
      try {
         $table = $this->db->table('tb_penguji_sidang');
         $table->where('id_status_tugas_akhir', $post['id_status_tugas_akhir']);
         $table->where('nidn', $post['nidn']);
         $table->update([
            'modified' => new RawSql('now()'),
            'user_modified' => $post['nidn'],
            'keterangan_perbaikan' => $post['keterangan_perbaikan'],
            'telah_sidang' => false
         ]);

         $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], 27);

         return ['status' => true, 'content' => $this->getPengujiSidangMunaqasyah($post['nim'], $post['id_periode']), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submitSudahMelaksanakanSidang(array $post): array
   {
      try {
         $table = $this->db->table('tb_penguji_sidang');
         $table->where('id_status_tugas_akhir', $post['id_status_tugas_akhir']);
         $table->where('nidn', $post['nidn']);
         $table->update([
            'modified' => new RawSql('now()'),
            'telah_sidang' => true,
            'user_modified' => $post['nidn']
         ]);

         $verifikasi = $this->verifikasiStatusTugasAkhir($post);
         $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], $verifikasi ? 29 : $post['status_tesis']);

         return [
            'status' => true,
            'content' => $this->getPengujiSidangMunaqasyah($post['nim'], $post['id_periode']),
            'status_tesis' => $verifikasi ? 29 : $post['status_tesis'],
            'msg_response' => 'Data berhasil disimpan.'
         ];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function verifikasiStatusTugasAkhir(array $post): bool
   {
      $approvePenguji = $this->checkApprovePengujiSidangMunaqasyah($post['id_status_tugas_akhir']);
      $approvePembimbing = $this->checkApprovePembimbingSidangMunaqasyah($post['id_status_tugas_akhir']);

      return $approvePenguji && $approvePembimbing ? true : false;
   }

   private function checkApprovePembimbingSidangMunaqasyah(int $id_status_tugas_akhir): bool
   {
      $table = $this->db->table('tb_pembimbing_penelitian tpp');
      $table->select('count(*) filter (where tpp.sudah_sidang = true) as sudah, count(*) filter (where tpp.sudah_sidang = false or tpp.sudah_sidang is null) as belum');
      $table->join('tb_penelitian tp', 'tp.id = tpp.id_penelitian');
      $table->where('tp.id_status_tugas_akhir', $id_status_tugas_akhir);

      $get = $table->get();
      $data = $get->getRowArray();
      $get->freeResult();

      $sudah = intval($data['sudah']);
      $belum = intval($data['belum']);

      return $sudah > $belum;
   }

   private function checkApprovePengujiSidangMunaqasyah(int $id_status_tugas_akhir): bool
   {
      $table = $this->db->table('tb_penguji_sidang');
      $table->select('count(*) filter (where telah_sidang = true) as sudah, count(*) filter (where telah_sidang = false or telah_sidang is null) as belum');
      $table->where('id_status_tugas_akhir', $id_status_tugas_akhir);

      $get = $table->get();
      $data = $get->getRowArray();
      $get->freeResult();

      $sudah = intval($data['sudah']);
      $belum = intval($data['belum']);

      return $sudah > $belum;
   }

   public function getDetail(array $post): array
   {
      return [
         'identitas' => $this->getDetailStatusTugasAkhir($post['nim'], $post['id_periode']),
         'syarat' => $this->getMasterSyarat('3'),
         'lampiran_upload' => $this->getLampiranUploadMahasiswa($post['nim']),
         'sk_penelitian' => $this->getSKPenelitian($post['nim'], $post['id_periode']),
         'tim_pembimbing' => $this->getPembimbingPenelitian($post['nim'], $post['id_periode']),
         'tim_penguji' => $this->getPengujiSidangMunaqasyah($post['nim'], $post['id_periode']),
         'jadwal_sidang' => $this->getJadwalSidangMunaqasyah($post['nim'], $post['id_periode'])
      ];
   }

   private function getJadwalSidangMunaqasyah(string $nim, int $id_periode): array
   {
      $table = $this->db->table('tb_jadwal_sidang tjs');
      $table->select('tjs.*');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.id = tjs.id_status_tugas_akhir');
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

   private function getPengujiSidangMunaqasyah(string $nim, int $id_periode): array
   {
      $table = $this->db->table('tb_penguji_sidang tps');
      $table->select('tps.id, tps.id_status_tugas_akhir, tps.penguji_ke, tps.nidn, tps.nama_dosen, tps.id_kategori_kegiatan, tkk.nama as kategori_kegiatan, tps.apakah_dosen_uin, tps.keterangan_perbaikan, tps.telah_sidang');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.id = tps.id_status_tugas_akhir');
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

   private function getPembimbingPenelitian(string $nim, int $id_periode): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tpp.id, tpp.id_penelitian, tpp.apakah_dosen_uin, tpp.pembimbing_ke, tpp.id_kategori_kegiatan, tkk.nama as kategori_kegiatan, tpp.nidn, tpp.nama_dosen, tpp.seminar_penelitian, tpp.boleh_seminar, tpp.boleh_sidang, tpp.sudah_sidang, tpp.catatan');
      $table->join('tb_penelitian tp', 'tp.id_status_tugas_akhir = tsta.id');
      $table->join('tb_pembimbing_penelitian tpp', 'tpp.id_penelitian = tp.id');
      $table->join('tb_kategori_kegiatan tkk', 'tkk.id = tpp.id_kategori_kegiatan');
      $table->where('tsta.nim', $nim);
      $table->where('tsta.id_periode', $id_periode);
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

   private function getSKPenelitian(string $nim, int $id_periode): array
   {
      $table = $this->db->table('tb_penelitian tp');
      $table->select('tp.id, tp.id_status_tugas_akhir, tp.judul, tp.nomor_sk_tugas, tp.tanggal_sk_tugas, tp.id_jenis_aktivitas, tp.keterangan, tp.lokasi, tp.tanggal_mulai, tp.tanggal_akhir, tp.program_mbkm, tp.jenis_anggota, tmja.nama as jenis_aktivitas, tmja.untuk_kampus_merdeka');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.id = tp.id_status_tugas_akhir');
      $table->join('tb_mst_jenis_aktivitas tmja', 'tmja.id = tp.id_jenis_aktivitas');
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
      $table = $this->db->table('tb_penguji_sidang tps');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.id = tps.id_status_tugas_akhir');
      $table->join('tb_prodi tp', 'tp.id_feeder = tsta.id_prodi');
      $table->join('tb_status_tesis tst', 'tst.id = tsta.status');
      $table->where('tsta.status >=', 25);

      $this->dt_where($table, [
         'tps.nidn' => $post['nidn'],
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
      $table = $this->db->table('tb_penguji_sidang tps');
      $table->select('tps.id_status_tugas_akhir, tsta.nim, tsta.nama, tsta.angkatan, concat(tp.jenjang, \' \', tp.nama) as program_studi, tsta.status, tst.short_name as status_tesis, tsta.id_periode');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.id = tps.id_status_tugas_akhir');
      $table->join('tb_prodi tp', 'tp.id_feeder = tsta.id_prodi');
      $table->join('tb_status_tesis tst', 'tst.id = tsta.status');
      $table->where('tsta.status >=', 25);

      $this->dt_where($table, [
         'tps.nidn' => $post['nidn'],
         'tsta.id_periode' => @$post['id_periode'],
         'tsta.angkatan' => @$post['angkatan'],
         'tsta.id_prodi' => @$post['id_prodi'],
      ]);

      $this->datatableColumnSearch($table, ['tsta.nim', 'tsta.nama', 'tsta.angkatan', 'tp.nama', 'tst.short_name']);
      $this->datatableColumnOrder($table, ['nim', 'nama', 'angkatan', 'program_studi', 'status_tesis']);

      return $table;
   }
}
