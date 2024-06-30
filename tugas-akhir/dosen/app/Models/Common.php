<?php

namespace App\Models;

use CodeIgniter\Model;
use CodeIgniter\Database\RawSql;

class Common extends Model
{

   protected $db;

   public function __construct()
   {
      parent::__construct();

      $this->db = \Config\Database::connect();
   }

   public function getLampiranUploadMahasiswa(string $nim): array
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

   public function getDetailStatusTugasAkhir(string $nim, int $id_periode): array
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tsta.id as id_status_tugas_akhir, tsta.nim, tsta.nama, tsta.id_periode, tsta.nim, tsta.angkatan, tsta.email, tsta.hp, tsta.status, tsta.judul_proposal_1, tsta.judul_proposal_2, tsta.judul_proposal_3, tsta.judul_proposal_final, tsta.keterangan, concat(tp.jenjang, \' \', tp.nama) as program_studi, concat(tp2.tahun_ajaran, tp2.id_semester) as semester');
      $table->join('tb_prodi tp', 'tp.id_feeder = tsta.id_prodi');
      $table->join('tb_periode tp2', 'tp2.id = tsta.id_periode');
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

   public function updateStatusTugasAkhir(int $id, int $value): void
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->where('id', $id);
      $table->update(['status' => $value]);
   }

   public function getDaftarPeriode(): array
   {
      $table = $this->db->table('tb_periode');
      $table->select('id, concat(tahun_ajaran, id_semester) as periode, status');
      $table->orderBy('concat(tahun_ajaran, id_semester)');

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

   public function datatableColumnOrder($table, $column_order = []): void
   {
      $column = @$_POST['order'][0]['column'];
      $dir = @$_POST['order'][0]['dir'];
      $table->orderBy($column_order[$column], $dir);
   }

   public function datatableColumnSearch($table, $column_search = []): void
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
