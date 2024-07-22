<?php

namespace App\Models;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Home extends Common
{

   public function updateJudulProposal(array $post): void
   {
      $data[$post['field']] = $post['judul'];

      $table = $this->db->table('tb_status_tugas_akhir');
      $table->where('nim', $post['nim']);
      $table->where('id_periode', function ($table) {
         return $table->select('id')->from('tb_periode')->where('status', true);
      });
      $table->update($data);
   }

   public function getDetailMunaqasyah(string $nim): array
   {
      return [
         'judulProposal' => $this->getJudulProposal($nim),
         'statusTugasAkhir' => $this->getStatusTugasAkhir($nim),
         'lampiranSidang' => $this->getLampiranSidang($nim),
         'pembimbing' => $this->getPembimbingSeminarPenelitian($nim),
         'penguji' => $this->getPengujiSidang($nim),
         'lampiranUpload' => $this->getLampiranUpload($nim),
         'jadwalSidang' => $this->getJadwalSidang($nim)
      ];
   }

   private function getJadwalSidang(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tjs.*');
      $table->join('tb_jadwal_sidang tjs', 'tjs.id_status_tugas_akhir = tsta.id');
      $table->where('tsta.nim', $nim);
      $table->where('tsta.id_periode', function ($table) {
         return $table->select('id')->from('tb_periode')->where('status', true);
      });

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

   private function getPengujiSidang(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tps.*, tkk.nama as kategori_kegiatan');
      $table->join('tb_penguji_sidang tps', 'tps.id_status_tugas_akhir = tsta.id');
      $table->join('tb_kategori_kegiatan tkk', 'tkk.id = tps.id_kategori_kegiatan');
      $table->where('tsta.nim', $nim);
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

   public function getDetailSeminarPenelitian(string $nim): array
   {
      return [
         'judulProposal' => $this->getJudulProposal($nim),
         'statusTugasAkhir' => $this->getStatusTugasAkhir($nim),
         'lampiranSeminarPenelitian' => $this->getLampiranSeminarPenelitian($nim),
         'pembimbingSeminarPenelitian' => $this->getPembimbingSeminarPenelitian($nim),
         'timPembahasHasilPenelitian' => $this->getTimPembahasHasilPenelitian($nim),
         'jadwalSeminarPenelitian' => $this->getJadwalSeminarPenelitian($nim),
         'lampiranUpload' => $this->getLampiranUpload($nim)
      ];
   }

   private function getJadwalSeminarPenelitian(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tsp.id, tsp.id_penelitian, tsp.tanggal_seminar, tsp.jam_seminar');
      $table->join('tb_penelitian tp', 'tp.id_status_tugas_akhir = tsta.id');
      $table->join('tb_seminar_penelitian tsp', 'tsp.id_penelitian = tp.id');
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

   private function getTimPembahasHasilPenelitian(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tspd.id, tspd.id_seminar_penelitian, tspd.penguji_ke, tspd.nidn, tspd.nama_dosen, tspd.id_kategori_kegiatan, tkk.nama as kategori_kegiatan, tspd.apakah_dosen_uin, tspd.lanjut_sidang, tspd.keterangan_perbaikan');
      $table->join('tb_penelitian tp', 'tp.id_status_tugas_akhir = tsta.id');
      $table->join('tb_seminar_penelitian tsp', 'tsp.id_penelitian = tp.id');
      $table->join('tb_seminar_penelitian_detail tspd', 'tspd.id_seminar_penelitian = tsp.id');
      $table->join('tb_kategori_kegiatan tkk', 'tkk.id = tspd.id_kategori_kegiatan');
      $table->where('tsta.nim', $nim);
      $table->where('tsta.id_periode', function ($table) {
         return $table->select('id')->from('tb_periode')->where('status', true);
      });
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

   private function getPembimbingSeminarPenelitian(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tpp.id, tpp.id_penelitian, tpp.apakah_dosen_uin, tpp.pembimbing_ke, tpp.id_kategori_kegiatan, tkk.nama as kategori_kegiatan, tpp.nidn, tpp.nama_dosen, tpp.seminar_penelitian, tpp.boleh_seminar, tpp.boleh_sidang, tpp.sudah_sidang, tpp.catatan');
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

   private function getLampiranSeminarPenelitian(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tlsp.*');
      $table->join('tb_lampiran_seminar_penelitian tlsp', 'tlsp.id_status_tugas_akhir = tsta.id');
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

   public function updateStatusTugasAkhir(array $post): array
   {
      try {
         $table = $this->db->table('tb_status_tugas_akhir');
         $table->where('id', $post['id_status_tugas_akhir']);
         $table->update(['status' => $post['status']]);
         return ['status' => true, 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submitDaftarSeminarProposal(array $post): array
   {
      try {
         if ($post['status'] === '3') {
            $data['status'] = 4;
         } else {
            $data['status'] = 1;
         }

         $data['judul_proposal_1'] = $post['judul_proposal_1'];
         $data['judul_proposal_2'] = $post['judul_proposal_2'];
         $data['judul_proposal_3'] = $post['judul_proposal_3'];

         $table = $this->db->table('tb_status_tugas_akhir');
         $table->where('id', $post['id_status_tugas_akhir']);
         $table->update($data);
         return ['status' => true, 'msg_response' => 'Pendaftaran berhasil dilakukan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function getDetailSeminarProposal(string $nim): array
   {
      return [
         'judulProposal' => $this->getJudulProposal($nim),
         'statusTugasAkhir' => $this->getStatusTugasAkhir($nim),
         'lampiranSeminarProposal' => $this->getLampiranSeminarProposal($nim),
         'catatanLapiranSeminarProposal' => $this->getCatatanLapiranSeminarProposal($nim),
         'jadwalSeminarProposal' => $this->getJadwalSeminarProposal($nim),
         'pembimbingSeminarProposal' => $this->getPembimbingSeminarProposal($nim),
         'lampiranUpload' => $this->getLampiranUpload($nim)
      ];
   }

   private function getJudulProposal(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->select('judul_proposal_1, judul_proposal_2, judul_proposal_3, judul_proposal_final');
      $table->where('nim', $nim);
      $table->where('id_periode', function ($table) {
         return $table->select('id')->from('tb_periode')->where('status', true);
      });

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

   private function getLampiranUpload(string $nim): array
   {
      $table = $this->db->table('tb_lampiran_upload');
      $table->where('nim', $nim);

      $get = $table->get();
      $result = $get->getResultArray();
      $get->freeResult();

      $response = [];
      foreach ($result as $row) {
         $response[$row['id_syarat']] = $row;
      }
      return $response;
   }

   private function getPembimbingSeminarProposal(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tps.id, tps.id_status_tugas_akhir, tps.pembimbing_ke, tps.id_kategori_kegiatan, tkk.nama as kategori_kegiatan, tps.nidn, tps.nama_dosen, tps.sudah_seminar, tps.keterangan_perbaikan, tps.apakah_dosen_uin');
      $table->join('tb_pembimbing_seminar tps', 'tps.id_status_tugas_akhir = tsta.id');
      $table->join('tb_kategori_kegiatan tkk', 'tkk.id = tps.id_kategori_kegiatan');
      $table->where('tsta.nim', $nim);

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

   private function getJadwalSeminarProposal(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tjs.id, tjs.id_status_tugas_akhir, tjs.tanggal_seminar, tjs.jam_seminar');
      $table->join('tb_jadwal_seminar tjs', 'tjs.id_status_tugas_akhir = tsta.id');
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

   private function getCatatanLapiranSeminarProposal(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tkal.*');
      $table->join('tb_lampiran tl', 'tl.id_status_tugas_akhir = tsta.id');
      $table->join('tb_keterangan_approve_lampiran tkal', 'tkal.id_lampiran = tl.id');
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

   private function getLampiranSeminarProposal(string $nim): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tl.id, tl.permohonan_proposal, tsal.permohonan_proposal as approve_permohonan_proposal, tl.slip_spp, tsal.slip_spp as approve_slip_spp, tl.slip_seminar, tsal.slip_seminar as approve_slip_seminar, tl.sinopsis_disertasi, tsal.sinopsis_disertasi as approve_sinopsis_disertasi, tl.persetujuan_penasehat, tsal.persetujuan_penasehat as approve_persetujuan_penasehat, tl.transkrip_nilai, tsal.transkrip_nilai as approve_transkrip_nilai, tl.buku_kegiatan_akademik, tsal.buku_kegiatan_akademik as approve_buku_kegiatan_akademik, tl.review_jurnal, tsal.review_jurnal as approve_review_jurnal');
      $table->join('tb_lampiran tl', 'tl.id_status_tugas_akhir = tsta.id');
      $table->join('tb_status_approve_lampiran tsal', 'tsal.id_lampiran = tl.id');
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
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->where('nim', $nim);

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

   public function submitPenentuanSK(array $post): array
   {
      try {
         $table = $this->db->table('tb_status_tugas_akhir');
         $table->where('id', $post['id']);
         $table->update(['status' => '7']);
         return ['status' => true, 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submitTelahSeminar(array $post): array
   {
      try {
         $table = $this->db->table('tb_status_tugas_akhir');
         $table->where('id', $post['id']);
         $table->update(['status' => '6']);
         return ['status' => true, 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submitDaftarUlangProposal(array $post): array
   {
      try {
         $table = $this->db->table('tb_status_tugas_akhir');
         $table->where('id', $post['id']);
         $table->update([
            'status' => '3',
            'modified' => new RawSql('now()'),
         ]);
         return ['status' => true, 'msg_response' => 'Pendaftaran proposal berhasil dilakukan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submitDaftarProposal(array $post): array
   {
      try {
         $table = $this->db->table('tb_status_tugas_akhir');
         $table->where('id', $post['id']);
         $table->update([
            'status' => '1',
            'modified' => new RawSql('now()'),
         ]);
         return ['status' => true, 'msg_response' => 'Pendaftaran proposal berhasil dilakukan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function updateLampiran(array $post): void
   {
      $data['lampiran'] = $post['lampiran'];
      $data['nim'] = $post['nim'];
      $data['id_syarat'] = $post['id_syarat'];
      $data['id_google_drive'] = $post['id_google_drive'];

      $check = $this->checkLampiranUploadSebelumnya($post);

      $table = $this->db->table('tb_lampiran_upload');
      if ($check) {
         $data['modified'] = new RawSql('now()');

         $table->where('nim', $post['nim']);
         $table->where('id_syarat', $post['id_syarat']);
         $table->update($data);
      } else {
         $data['uploaded'] = new RawSql('now()');

         $table->ignore(true)->insert($data);
      }
   }

   private function checkLampiranUploadSebelumnya(array $post): bool
   {
      $table = $this->db->table('tb_lampiran_upload');
      $table->where('nim', $post['nim']);
      $table->where('id_syarat', $post['id_syarat']);

      return $table->countAllResults() > 0;
   }

   public function getDaftarLampiran(array $post): array
   {
      $prepareDaftarLampiran = $this->prepareDaftarLampiran($post);

      return [
         'lampiran' => $prepareDaftarLampiran,
         'statusApproveLampiran' => $this->prepareStatusApproveLampiran($prepareDaftarLampiran),
         'keteranganApproveLampiran' => $this->prepareKeteranganApproveLampiran($prepareDaftarLampiran),
         'jadwalSeminar' => $this->getDetailJadwalSeminar($prepareDaftarLampiran['id']),
         'pembimbing' => $this->getDaftarPembimbing($prepareDaftarLampiran['id'])
      ];
   }

   public function getDaftarPembimbing(int $id_status_tugas_akhir): array
   {
      $table = $this->db->table('tb_pembimbing_seminar tps');
      $table->select('tps.*, tkk.nama as kategori_kegiatan');
      $table->join('tb_kategori_kegiatan tkk', 'tkk.id = tps.id_kategori_kegiatan');
      $table->where('tps.id_status_tugas_akhir', $id_status_tugas_akhir);
      $table->orderBy('tps.pembimbing_ke');

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

   public function getDetailJadwalSeminar(int $id_status_tugas_akhir): array
   {
      $table = $this->db->table('tb_jadwal_seminar');
      $table->where('id_status_tugas_akhir', $id_status_tugas_akhir);

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

   private function prepareKeteranganApproveLampiran(array $post): array
   {
      $table = $this->db->table('tb_keterangan_approve_lampiran');
      $table->where('id_lampiran', $post['id']);

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

   private function prepareStatusApproveLampiran(array $post): array
   {
      $table = $this->db->table('tb_status_approve_lampiran');
      $table->where('id_lampiran', $post['id']);

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

   private function prepareDaftarLampiran(array $post): array
   {
      $table = $this->db->table('tb_lampiran');
      $table->where('id_status_tugas_akhir', $post['id_tugas_akhir']);

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
}
