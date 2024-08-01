<?php

namespace App\Models\Dosen\SidangMunaqasyah;

use App\Models\Dosen\Common;
use CodeIgniter\Database\RawSql;

class Pembimbing extends Common
{

   public function submitSudahSidang(array $post): array
   {
      try {
         $table = $this->db->table('tb_pembimbing_penelitian');
         $table->where('id_penelitian', function ($table) use ($post) {
            return $table->select('id')->from('tb_penelitian')->where('id_status_tugas_akhir', $post['id_status_tugas_akhir']);
         });
         $table->where('nidn', $post['nidn']);
         $table->update([
            'modified' => new RawSql('now()'),
            'user_modified' => $post['nidn'],
            'sudah_sidang' => true
         ]);

         return [
            'status' => true,
            'msg_response' => 'Data berhasil disimpan.',
            'content' => $this->getPembimbingPenelitian($post['nim'], $post['id_periode']),
            'status_tesis' => $this->handleUpdateStatusTugasAkhir($post)
         ];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function handleUpdateStatusTugasAkhir(array $post): int
   {
      $checkApprovePembimbing = $this->checkApproveSudahSidangPembimbing($post['id_status_tugas_akhir']);
      $checkApprovePenguji = $this->checkApproveSudahSidangPenguji($post['id_status_tugas_akhir']);

      $status = 26;
      if ($checkApprovePembimbing && $checkApprovePenguji) {
         $status = 29;
      }

      $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], $status);

      return $status;
   }

   private function checkApproveSudahSidangPenguji(int $id_status_tugas_akhir): bool
   {
      $table = $this->db->table('tb_penguji_sidang');
      $table->select('count(*) filter (where telah_sidang = true) as disetujui, count(*) filter (where telah_sidang = false or telah_sidang is null) as belum_disetujui');
      $table->where('id_status_tugas_akhir', $id_status_tugas_akhir);

      $get = $table->get();
      $data = $get->getRowArray();
      $get->freeResult();

      $disetujui = intval($data['disetujui']);
      $belum_disetujui = intval($data['belum_disetujui']);

      return $disetujui > $belum_disetujui;
   }

   private function checkApproveSudahSidangPembimbing(int $id_status_tugas_akhir): bool
   {
      $table = $this->db->table('tb_pembimbing_penelitian tpp');
      $table->select('count(*) filter (where tpp.sudah_sidang = true) as disetujui, count(*) filter (where tpp.sudah_sidang = false or tpp.sudah_sidang is null) as belum_disetujui');
      $table->join('tb_penelitian tp', 'tp.id = tpp.id_penelitian');
      $table->where('tp.id_status_tugas_akhir', $id_status_tugas_akhir);

      $get = $table->get();
      $data = $get->getRowArray();
      $get->freeResult();

      $disetujui = intval($data['disetujui']);
      $belum_disetujui = intval($data['belum_disetujui']);

      return $disetujui > $belum_disetujui;
   }

   public function submitPerbaikiSidang(array $post): array
   {
      try {
         $table = $this->db->table('tb_pembimbing_penelitian');
         $table->where('id_penelitian', function ($table) use ($post) {
            return $table->select('id')->from('tb_penelitian')->where('id_status_tugas_akhir', $post['id_status_tugas_akhir']);
         });
         $table->where('nidn', $post['nidn']);
         $table->update([
            'user_modified' => $post['nidn'],
            'modified' => new RawSql('now()'),
            'catatan' => $post['catatan'],
            'sudah_sidang' => false
         ]);

         $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], 27);

         return ['status' => true, 'content' => $this->getPembimbingPenelitian($post['nim'], $post['id_periode']), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submitLanjutSidang(array $post): array
   {
      try {
         $table = $this->db->table('tb_pembimbing_penelitian');
         $table->where('nidn', $post['nidn']);
         $table->where('id_penelitian', function ($table) use ($post) {
            return $table->select('id')->from('tb_penelitian')->where('id_status_tugas_akhir', $post['id_status_tugas_akhir']);
         });
         $table->update([
            'boleh_sidang' => true,
            'modified' => new RawSql('now()'),
            'user_modified' => $post['nidn']
         ]);

         return [
            'status' => true,
            'status_tesis' => $this->handleUpdateStatusTesis($post),
            'content' => $this->getPembimbingPenelitian($post['nim'], $post['id_periode']),
            'msg_response' => 'Data berhasil disimpan.'
         ];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function handleUpdateStatusTesis(array $post): int
   {
      $table = $this->db->table('tb_pembimbing_penelitian');
      $table->select('count(*) filter(where boleh_sidang = true) as disetujui, count(*) filter(where boleh_sidang = false or boleh_sidang is null) as belum_disetujui');
      $table->where('id_penelitian', function ($table) use ($post) {
         return $table->select('id')->from('tb_penelitian')->where('id_status_tugas_akhir', $post['id_status_tugas_akhir']);
      });

      $get = $table->get();
      $data = $get->getRowArray();
      $get->freeResult();

      $disetujui = intval($data['disetujui']);
      $belum_disetujui = intval($data['belum_disetujui']);

      $status = $post['status'];
      if ($disetujui > $belum_disetujui) {
         $this->updateStatusTugasAkhir($post['id_status_tugas_akhir'], 23);
         $status = 23;
      }
      return $status;
   }

   public function getDetail(array $post): array
   {
      return [
         'identitas' => $this->getDetailStatusTugasAkhir($post['nim'], $post['id_periode']),
         'syarat' => $this->getSyarat(),
         'lampiran_upload' => $this->getLampiranUploadMahasiswa($post['nim']),
         'pembimbing' => $this->getPembimbingPenelitian($post['nim'], $post['id_periode']),
         'penguji' => $this->getPengujiHasilSeminarPenelitian($post['nim'], $post['id_periode']),
         'sk_penelitian' => $this->getSKPenelitian($post['nim'], $post['id_periode'])
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

   private function getSyarat(): array
   {
      $table = $this->db->table('tb_mst_syarat');
      $table->where('syarat', '3');

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
      $table = $this->db->table('tb_pembimbing_penelitian tpp');
      $table->join('tb_penelitian tp', 'tp.id = tpp.id_penelitian');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.id = tp.id_status_tugas_akhir');
      $table->join('tb_prodi tp2', 'tp2.id_feeder = tsta.id_prodi');
      $table->join('tb_status_tesis tst', 'tst.id = tsta.status');
      $table->where('tsta.status >=', 22);

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
      $table = $this->db->table('tb_pembimbing_penelitian tpp');
      $table->select('tp.id_status_tugas_akhir, tsta.nim, tsta.nama, tsta.angkatan, concat(tp2.jenjang, \' \', tp2.nama) as program_studi, tsta.status, tst.short_name as status_tesis, tsta.id_periode');
      $table->join('tb_penelitian tp', 'tp.id = tpp.id_penelitian');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.id = tp.id_status_tugas_akhir');
      $table->join('tb_prodi tp2', 'tp2.id_feeder = tsta.id_prodi');
      $table->join('tb_status_tesis tst', 'tst.id = tsta.status');
      $table->where('tsta.status >=', 22);

      $this->dt_where($table, [
         'tpp.nidn' => $post['nidn'],
         'tsta.id_periode' => @$post['id_periode']
      ]);

      $this->datatableColumnSearch($table, ['tsta.nim', 'tsta.nama', 'tsta.angkatan', 'tp2.nama', 'tst.short_name']);
      $this->datatableColumnOrder($table, ['nim', 'nama', 'angkatan', 'program_studi', 'status']);

      return $table;
   }
}
