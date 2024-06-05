<?php

namespace App\Models;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Profile extends Common
{

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

         $data['user_modified'] = $post['user_modified'];
         $data['modified'] = new RawSql('now()');
         if (isset($post['password'])) {
            $data['password'] = password_hash($post['password'], PASSWORD_BCRYPT);
         }

         $table = $this->db->table('tb_users');
         $table->where('username', $post['username']);
         $table->update($data);

         $response['status'] = true;
         $response['msg_response'] = 'Data berhasil disimpan.';
      } catch (\Exception $e) {
         $response['msg_response'] = $e->getMessage();
      }
      return $response;
   }
}
