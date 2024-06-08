<?php

namespace App\Models\Pengaturan;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Periode extends Common
{

   public function hapus(array $post): void
   {
      try {
         $table = $this->db->table('tb_periode');
         $table->where('id', $post['id']);
         $table->delete();
      } catch (\Exception $e) {
         die(json_encode(['status' => false, 'msg_response' => $e->getMessage(), 'errors' => []]));
      }
   }

   public function submit(array $post): array
   {
      $response = ['status' => false, 'msg_response' => 'Terjadi sesuatu kesalahan.', 'errors' => []];
      try {
         $fields = ['tahun_ajaran', 'id_semester'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];

         $table = $this->db->table('tb_periode');
         if ($post['pageType'] === 'insert') {
            $data['uploaded'] = new RawSql('now()');
            $data['status'] = true;

            $table->insert($data);

            $this->tutupPeriodeLainnya($post);
         } elseif ($post['pageType'] === 'update') {
            $data['modified'] = new RawSql('now()');

            $table->where('id', $post['id']);
            $table->update($data);
         }

         $response['status'] = true;
         $response['msg_response'] = 'Data berhasil disimpan.';
      } catch (\Exception $e) {
         $response['msg_response'] = $e->getMessage();
      }
      return $response;
   }

   private function tutupPeriodeLainnya(array $post): void
   {
      $table = $this->db->table('tb_periode');
      $table->where('concat(tahun_ajaran, id_semester) !=', $post['tahun_ajaran'] . $post['id_semester']);
      $table->update(['status' => false]);
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

   public function countData(): int
   {
      $table = $this->db->table('tb_periode');
      return $table->countAllResults();
   }

   public function filteredData(array $post): int
   {
      $table = $this->queryData($post);
      return $table->countAllResults();
   }

   private function queryData(): object
   {
      $table = $this->db->table('tb_periode');
      $table->select('*, concat(tahun_ajaran, id_semester) as periode');

      $this->prepareDatatableColumnOrder($table, ['periode', 'status']);

      return $table;
   }
}
