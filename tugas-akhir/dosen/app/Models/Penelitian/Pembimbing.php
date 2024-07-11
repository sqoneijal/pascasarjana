<?php

namespace App\Models\Penelitian;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Pembimbing extends Common
{

   public function submit(array $post): array
   {
      try {
         $table = $this->db->table('tb_pembimbing_penelitian');
         $table->where('nidn', $post['nidn']);
         $table->where('id_penelitian', $post['id_penelitian']);
         $table->update([
            'boleh_seminar' => true,
            'modified' => new RawSql('now()'),
            'user_modified' => $post['nidn']
         ]);

         $this->handleUpdateStatusTugasAkhir($post);

         return ['status' => true, 'content' => $this->getDetail($post), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function handleUpdateStatusTugasAkhir(array $post): void
   {
      $jumlahApprove = $this->checkJumlahApprove($post['id_penelitian']);
      $disetujui = intval($jumlahApprove['disetujui']);
      $belum_disetujui = intval($jumlahApprove['belum_disetujui']);

      if ($disetujui > $belum_disetujui) {
         $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], 15);
      }
   }

   private function checkJumlahApprove(int $id_penelitian): array
   {
      $table = $this->db->table('tb_pembimbing_penelitian');
      $table->select(new RawSql('count(*) filter (where boleh_seminar = true) as disetujui, count(*) filter (where boleh_seminar = false or boleh_seminar is null) as belum_disetujui'));
      $table->where('id_penelitian', $id_penelitian);

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

   public function getDetail(array $post): array
   {
      return [
         'identitas' => $this->getDetailStatusTugasAkhir($post['nim'], $post['id_periode']),
         'syarat' => $this->getSyarat(),
         'lampiran_upload' => $this->getLampiranUploadMahasiswa($post['nim']),
         'pembimbing' => $this->getPembimbing($post['nim'], $post['id_periode']),
         'sk_penelitian' => $this->getSKPenelitian($post['nim'], $post['id_periode']),
         'jadwal_seminar' => $this->getJadwalSeminarHasilPenelitian($post['nim'], $post['id_periode']),
         'penguji' => $this->getPengujiHasilSeminarPenelitian($post['nim'], $post['id_periode'])
      ];
   }

   private function getPengujiHasilSeminarPenelitian(string $nim, int $id_periode): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tspd.*, tkk.nama as kategori_kegiatan');
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

   private function getJadwalSeminarHasilPenelitian(string $nim, int $id_periode): array
   {
      $table = $this->db->table('tb_jadwal_seminar tjs');
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

   private function getPembimbing(string $nim, int $id_periode): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tpp.id, tpp.id_penelitian, tpp.apakah_dosen_uin, tpp.pembimbing_ke, tpp.id_kategori_kegiatan, tkk.nama as kategori_kegiatan, tpp.nidn, tpp.nama_dosen, tpp.seminar_penelitian, tpp.boleh_seminar, tpp.boleh_sidang');
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
      $table->join('tb_penelitian tp', 'tp.id_status_tugas_akhir = tsta.id');
      $table->join('tb_pembimbing_penelitian tpp', 'tpp.id_penelitian = tp.id');
      $table->join('tb_prodi tp2', 'tp2.id_feeder = tsta.id_prodi');
      $table->join('tb_status_tesis tst', 'tst.id = tsta.status');
      $table->where('tsta.status >=', 14);

      $this->dt_where($table, [
         'tpp.nidn' => $post['nidn']
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
      $table->select('tsta.id as id_status_tugas_akhir, tsta.nim, tsta.nama, tsta.id_periode, tsta.angkatan, concat(tp2.jenjang, \' \', tp2.nama) as program_studi, tst.short_name as status_tesis, tp.id as id_penelitian, tsta.status');
      $table->join('tb_penelitian tp', 'tp.id_status_tugas_akhir = tsta.id');
      $table->join('tb_pembimbing_penelitian tpp', 'tpp.id_penelitian = tp.id');
      $table->join('tb_prodi tp2', 'tp2.id_feeder = tsta.id_prodi');
      $table->join('tb_status_tesis tst', 'tst.id = tsta.status');
      $table->where('tsta.status >=', 14);

      $this->dt_where($table, [
         'tpp.nidn' => $post['nidn']
      ]);

      $this->datatableColumnSearch($table, ['tsta.nim', 'tsta.nama', 'tsta.angkatan', 'tp2.jenjang', 'tp2.nama', 'tst.short_name']);
      $this->datatableColumnOrder($table, ['nim', 'nama', 'angkatan', 'program_studi', 'status_tesis']);

      return $table;
   }
}
