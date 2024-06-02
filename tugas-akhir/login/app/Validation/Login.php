<?php

namespace App\Validation;

class Login
{

   private function validasiUsername($db): callable
   {
      return static function ($value, array $data, ?string &$error = null) use ($db): bool {
         $table = $db->table('tb_users');
         $table->groupStart();
         $table->where('username', $value);
         $table->orWhere('email', $value);
         $table->groupEnd();

         $count = $table->countAllResults();

         if ($count > 0) {
            return true;
         }

         $error = 'Email/Username salah.';
         return false;
      };
   }

   private function validasiPassword($db): callable
   {
      return static function ($value, array $data, ?string &$error = null) use ($db): bool {
         $table = $db->table('tb_users');
         $table->select('password');
         $table->groupStart();
         $table->where('username', $data['username']);
         $table->orWhere('email', $data['username']);
         $table->groupEnd();

         $get = $table->get();
         $data = $get->getRowArray();
         $get->freeResult();

         if (isset($data) && (password_verify($value, $data['password']))) {
            return true;
         }

         $error = 'Password salah.';
         return false;
      };
   }

   public function submit(): array
   {
      $db = \Config\Database::connect();
      $validasiUsername = $this->validasiUsername($db);
      $validasiPassword = $this->validasiPassword($db);

      return [
         'username' => [
            'label' => 'Email/Username',
            'rules' => ['required', $validasiUsername]
         ],
         'password' => [
            'label' => 'Password',
            'rules' => ['required', $validasiPassword]
         ]
      ];
   }
}
