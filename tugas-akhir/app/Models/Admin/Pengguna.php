<?php

namespace App\Models\Admin;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Pengguna extends Common
{

   public function getIDProdiPasca(): string
   {
      $table = $this->db->table('tb_prodi');
      $table->select('id_feeder');
      $table->where(new RawSql('id_feeder is not null'));

      $get = $table->get();
      $result = $get->getResultArray();
      $get->freeResult();

      $response = [];
      foreach ($result as $row) {
         $response[] = "'" . $row['id_feeder'] . "'";
      }
      return implode(',', $response);
   }

   public function hapus(array $post): array
   {
      try {
         $table = $this->db->table('tb_users');
         $table->where('id', $post['id']);
         $table->delete();
         return ['status' => true, 'msg_response' => 'Data berhasil dihapus.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submit(array $post): array
   {
      try {
         $fields = ['nama', 'email', 'username', 'role'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];
         if (isset($post['password'])) {
            $data['password'] = password_hash($post['password'], PASSWORD_BCRYPT);
         }

         $table = $this->db->table('tb_users');
         if ($post['pageType'] === 'insert') {
            $data['uploaded'] = new RawSql('now()');

            $table->insert($data);

            if ($data['role'] === '4') {
               $this->insertStatusTugasAkhir($post);
            }
         } elseif ($post['pageType'] === 'update') {
            unset($data['username'], $data['role']);
            $data['modified'] = new RawSql('now()');

            $table->where('id', $post['id']);
            $table->update($data);
         }

         return ['status' => true, 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function insertStatusTugasAkhir(array $post): void
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->ignore(true)->insert([
         'nim' => $post['username'],
         'id_prodi' => $post['id_prodi'],
         'uploaded' => new RawSql('now()'),
         'user_modified' => $post['user_modified'],
         'email' => $post['email']
      ]);
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
      $table = $this->db->table('tb_users');
      $table->where('username !=', $post['username']);
      return $table->countAllResults();
   }

   public function filteredData(array $post): int
   {
      $table = $this->queryData($post);
      return $table->countAllResults();
   }

   private function queryData(array $post): object
   {
      $table = $this->db->table('tb_users');
      $table->select('id, avatar, nama, email, username, role');
      $table->where('username !=', $post['username']);

      $this->dt_where($table, [
         'role' => @$post['role']
      ]);

      $this->prepareDatatableColumnSearch($table, ['nama', 'username', 'email']);
      $this->prepareDatatableColumnOrder($table, [null, 'nama', 'username', 'email', 'role']);

      return $table;
   }
}
