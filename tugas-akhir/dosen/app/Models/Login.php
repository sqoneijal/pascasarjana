<?php

namespace App\Models;

class Login extends Common
{

   public function getDataUser(array $post): array
   {
      $table = $this->db->table('tb_users');
      $table->where('id', $post['id']);

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
