<?php

namespace App\Validation;

class Profile
{

   private function validasiEmail(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         $db = \Config\Database::connect();

         if ($data['old_email'] !== $value) {
            $table = $db->table('tb_users');
            $table->where('email', $value);

            $count = $table->countAllResults();

            if ($count > 0) {
               $error = 'Email sudah terdaftar, silahkan gunakan yang lain.';
               return false;
            }
         }

         return true;
      };
   }

   public function submit(): array
   {
      $validasiEmail = $this->validasiEmail();

      return [
         'nama' => [
            'label' => 'Nama lengkap',
            'rules' => 'required'
         ],
         'email' => [
            'label' => 'Email',
            'rules' => ['required', 'valid_email', $validasiEmail]
         ],
      ];
   }
}
