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

   public function updateStatusTugasAkhir(int $id, int $value): void
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->where('id', $id);
      $table->update(['status' => $value]);
   }

   public function getDetailStatusTugasAkhir(array $post): array
   {
      return [
         'statusTugasAkhir' => $this->getStatusTugasAkhir($post),
         'lampiranUpload' => $this->getLampiranUpload($post),
         'jadwalSeminarProposal' => $this->getJadwalSeminarProposal($post),
         'pembimbingSeminarProposal' => $this->getPembimbingSeminarProposal($post),
      ];
   }

   public function getPembimbingSeminarProposal(array $post): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tps.*, tkk.nama as kategori_kegiatan');
      $table->join('tb_pembimbing_seminar tps', 'tps.id_status_tugas_akhir = tsta.id');
      $table->join('tb_kategori_kegiatan tkk', 'tkk.id = tps.id_kategori_kegiatan');
      $table->where('tsta.nim', $post['nim']);
      $table->where('tsta.id_periode', $post['id_periode']);
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

   public function getJadwalSeminarProposal(array $post): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tjs.*');
      $table->join('tb_jadwal_seminar tjs', 'tjs.id_status_tugas_akhir = tsta.id');
      $table->where('tsta.nim', $post['nim']);
      $table->where('tsta.id_periode', $post['id_periode']);

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

   public function getLampiranUpload(array $post): array
   {
      $table = $this->db->table('tb_lampiran_upload tlu');
      $table->select('tlu.id, tlu.id_syarat, tlu.lampiran, tlu.valid, tlu.keterangan, tlu.id_google_drive');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.nim = tlu.nim');
      $table->where('tlu.nim', $post['nim']);
      $table->where('tsta.id_periode', $post['id_periode']);

      $get = $table->get();
      $result = $get->getResultArray();
      $get->freeResult();

      $response = [];
      foreach ($result as $row) {
         $response[$row['id_syarat']] = $row;
      }
      return $response;
   }

   private function getStatusTugasAkhir(array $post): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tsta.id, tsta.nim, tsta.id_periode, concat(tp.tahun_ajaran, tp.id_semester) as semester, tsta.kode_prodi, tsta.nama, tsta.angkatan, tsta.nidn_penasehat, tsta.email, tsta.hp, tsta.status, tst.keterangan as keterangan_status, tsta.id_prodi, concat(tp2.jenjang, \' \', tp2.nama) as program_studi, tsta.judul_proposal_1, tsta.judul_proposal_2, tsta.judul_proposal_3, tsta.judul_proposal_final');
      $table->join('tb_periode tp', 'tp.id = tsta.id_periode');
      $table->join('tb_status_tesis tst', 'tst.id = tsta.status', 'left');
      $table->join('tb_prodi tp2', 'tp2.id_feeder = tsta.id_prodi');
      $table->where('tsta.nim', $post['nim']);
      $table->where('tsta.id_periode', $post['id_periode']);

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
      $table->select('id_feeder, concat(jenjang, \' \', nama) as nama');
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
