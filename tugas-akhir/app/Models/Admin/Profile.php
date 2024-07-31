<?php

namespace App\Models\Admin;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Profile extends Common
{

   public function getAksesLogs(int $id_user): array
   {
      $table = $this->db->table('tb_akses_logs');
      $table->where(new RawSql("time >= CURRENT_TIMESTAMP - INTERVAL '1 hour'"));
      $table->where('id_users', $id_user);
      $table->orderBy('time', 'desc');

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

   public function getLoginSession(int $id_user): array
   {
      $table = $this->db->table('tb_login_logs');
      $table->where('id_users', $id_user);
      $table->limit(10);
      $table->orderBy('last_login', 'desc');

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

   public function gantiAvatar(array $post): void
   {
      $table = $this->db->table('tb_users');
      $table->where('id', $post['id']);
      $table->update([
         'avatar' => $post['avatar'],
      ]);
   }

   public function submit(array $post): array
   {
      $response = ['status' => false, 'msg_response' => 'Terjadi sesuatu kesalahan.', 'errors' => []];
      try {
         $fields = ['nama', 'email'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['modified'] = new RawSql('now()');
         if (isset($post['password']) && $post['password']) {
            $data['password'] = password_hash($post['password'], PASSWORD_BCRYPT);
         }

         $table = $this->db->table('tb_users');
         $table->where('id', $post['id']);
         $table->update($data);

         $response['status'] = true;
         $response['msg_response'] = 'Data berhasil disimpan.';
         $response['content'] = $this->initUsers($post['id']);
      } catch (\Exception $e) {
         $response['msg_response'] = $e->getMessage();
      }
      return $response;
   }

   public function initUsers(int $id): array
   {
      $table = $this->db->table('tb_users');
      $table->where('id', $id);

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

      unset($response['password']);
      return $response;
   }
}
