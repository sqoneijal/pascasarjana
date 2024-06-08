<?php

namespace App\Models;

use CodeIgniter\Database\RawSql;
use CodeIgniter\Model;

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

   public function getDataPengaturan(): array
   {
      $table = $this->db->table('tb_pengaturan');
      $table->select('*');

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

   public function getDaftarJenisAktivitas(): array
   {
      $table = $this->db->table('tb_mst_jenis_aktivitas');
      $table->orderBy('id');

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

   public function getDaftarKategoriKegiatan(): array
   {
      $table = $this->db->table('tb_kategori_kegiatan');

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

   public function getDaftarStatusTesis(): array
   {
      $table = $this->db->table('tb_status_tesis');
      $table->where(new RawSql('short_name is not null'));

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

   public function getDaftarPeriode(): array
   {
      $table = $this->db->table('tb_periode');
      $table->select('id, concat(tahun_ajaran, id_semester) as periode, status');
      $table->orderBy('periode', 'desc');

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

   public function getDaftarProdi(): array
   {
      $table = $this->db->table('tb_prodi');
      $table->select('kode, concat(jenjang, \' \', nama) as nama');
      $table->orderBy('nama');

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
