<?php

namespace App\Models;

use CodeIgniter\Database\RawSql;
use CodeIgniter\Model;
use App\Models\Seminar\Penelitian;

class Common extends Model
{

   protected $db;
   protected $curl;

   public function __construct()
   {
      parent::__construct();

      $this->db = \Config\Database::connect();
      $this->curl = \Config\Services::curlrequest();
   }

   public function feederAction(string $token, string $act, array $data): array
   {
      try {
         $req = $this->curl->request('POST', FEEDER_PATHNAME, [
            'json' => array_merge([
               'act' => $act,
               'token' => $token,
            ], $data)
         ]);

         $res = json_decode($req->getBody(), true);

         if ($res['error_code'] === 0) {
            return ['status' => true, 'content' => $res['data']];
         } else {
            return ['status' => false, 'msg_response' => $res['error_desc']];
         }
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function getTokenFeeder(): array
   {
      try {
         $req = $this->curl->request('POST', FEEDER_PATHNAME, [
            'json' => [
               'act' => 'GetToken',
               'username' => FEEDER_USERNAME,
               'password' => FEEDER_PASSWORD
            ]
         ]);

         $res = json_decode($req->getBody(), true);

         if ($res['error_code'] === 0 && $res['data']['token']) {
            return ['status' => true, 'token' => $res['data']['token']];
         } else {
            return ['status' => false, 'msg_response' => $res['error_desc']];
         }
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function getDaftarAngkatan(): array
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->select('angkatan');
      $table->groupBy('angkatan');
      $table->orderBy('angkatan', 'desc');

      $get = $table->get();
      $result = $get->getResultArray();
      $get->freeResult();

      $response = [];
      foreach ($result as $row) {
         $response[] = $row['angkatan'];
      }
      return $response;
   }

   public function getDetailVerifikasiProposal(int $id_status_tugas_akhir): array
   {
      $penelitian = new Penelitian();
      $lampiran = $this->getDetailLampiranTugasAkhir($id_status_tugas_akhir);

      return [
         'statusTugasAkhir' => $this->getDetailStatusTugasAkhir($id_status_tugas_akhir),
         'lampiran' => $lampiran,
         'statusApproveLampiran' => $this->getDetailStatusApproveLampiran($lampiran['id']),
         'keteranganApproveLampiran' => $this->getDetailKeteranganApproveLampiran($lampiran['id']),
         'jadwalSeminar' => $this->getDetailJadwalSeminar($id_status_tugas_akhir),
         'pembimbing' => $this->getDaftarPembimbing($id_status_tugas_akhir),
         'penelitian' => $this->getDetailPenelitian($id_status_tugas_akhir),
         'pembimbingPenelitian' => $this->getDaftarPembimbingPenelitian($id_status_tugas_akhir),
         'jadwalSeminarPenelitian' => $penelitian->getDetailJadwalSeminarPenelitian($id_status_tugas_akhir),
         'pengujiPenelitian' => $penelitian->getDetailPengujiPenelitian($id_status_tugas_akhir)
      ];
   }

   public function getDaftarPembimbingPenelitian(int $id_status_tugas_akhir): array
   {
      $table = $this->db->table('tb_penelitian tp');
      $table->select('tpp.*, tkk.nama as kategori_kegiatan');
      $table->join('tb_pembimbing_penelitian tpp', 'tpp.id_penelitian = tp.id');
      $table->join('tb_kategori_kegiatan tkk', 'tkk.id = tpp.id_kategori_kegiatan', 'left');
      $table->where('tp.id_status_tugas_akhir', $id_status_tugas_akhir);
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

   public function getDetailPenelitian(int $id_status_tugas_akhir): array
   {
      $table = $this->db->table('tb_penelitian tp');
      $table->select('tp.*, concat(tp2.tahun_ajaran, tp2.id_semester) as semester, tmja.nama as jenis_aktivitas, tmja.untuk_kampus_merdeka, tsp.id as id_seminar_penelitian');
      $table->join('tb_periode tp2', 'tp2.id = tp.id_periode');
      $table->join('tb_mst_jenis_aktivitas tmja', 'tmja.id = tp.id_jenis_aktivitas', 'left');
      $table->join('tb_seminar_penelitian tsp', 'tsp.id_penelitian = tp.id', 'left');
      $table->where('tp.id_status_tugas_akhir', $id_status_tugas_akhir);

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

   public function getDetailKeteranganApproveLampiran(int $id_lampiran): array
   {
      $table = $this->db->table('tb_keterangan_approve_lampiran');
      $table->where('id_lampiran', $id_lampiran);

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

   public function getDetailStatusApproveLampiran(int $id_lampiran): array
   {
      $table = $this->db->table('tb_status_approve_lampiran');
      $table->where('id_lampiran', $id_lampiran);

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

   public function getDetailLampiranTugasAkhir(int $id_status_tugas_akhir): array
   {
      $table = $this->db->table('tb_lampiran');
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

   public function getDetailStatusTugasAkhir(int $id_status_tugas_akhir): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tsta.id, tsta.nim, tsta.status, tsta.id_periode, tsta.kode_prodi, tsta.nama, tsta.angkatan, tsta.nidn_penasehat, tsta.email, tsta.hp, concat(tp.tahun_ajaran, tp.id_semester) as periode, concat(tp2.jenjang, \' \', tp2.nama) as program_studi');
      $table->join('tb_periode tp', 'tp.id = tsta.id_periode');
      $table->join('tb_prodi tp2', 'tp2.kode = tsta.kode_prodi');
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

   public function prepareDatatableColumnOrder($table, $column_order = []): void
   {
      $column = @$_POST['order'][0]['column'];
      $dir = @$_POST['order'][0]['dir'];
      $table->orderBy($column_order[$column], $dir);
   }

   public function prepareDatatableColumnSearch($table, $column_search = []): void
   {
      $i = 0;
      foreach ($column_search as $item) {
         if (@$_POST['search']['value']) {
            if ($i === 0) {
               $table->groupStart();
               $table->like('trim(lower(cast(' . $item . ' as varchar)))', trim(strtolower($_POST['search']['value'])));
            } else {
               $table->orLike('trim(lower(cast(' . $item . ' as varchar)))', trim(strtolower($_POST['search']['value'])));
            }

            if (count($column_search) - 1 === $i) {
               $table->groupEnd();
            }
         }
         $i++;
      }
   }

   public function dt_where($table, array $columns): void
   {
      foreach ($columns as $key => $value) {
         if ($value) {
            $table->where(new RawSql("trim(lower(cast(" . $key . " as varchar))) = '" . trim(strtolower($value)) . "'"));
         }
      }
   }
}
