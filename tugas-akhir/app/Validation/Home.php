<?php

namespace App\Validation;

class Home
{

   public function submitDaftar(): array
   {
      return [
         'id_prodi' => [
            'label' => 'Program studi',
            'rules' => 'required',
         ],
         'nim' => [
            'label' => 'NIM',
            'rules' => 'required'
         ],
         'nama' => [
            'label' => 'Nama',
            'rules' => 'required'
         ],
         'username' => [
            'label' => 'Username',
            'rules' => 'required|is_unique[tb_users.username]',
            'errors' => [
               'is_unique' => 'Username sudah digunakan oleh orang lain.'
            ]
         ],
         'email' => [
            'label' => 'Email',
            'rules' => 'required|valid_email|is_unique[tb_users.email]',
            'errors' => [
               'is_unique' => 'Email sudah digunakan oleh mahasiswa lain. Silahkan gunakan email lain.'
            ]
         ],
         'password' => [
            'label' => 'Password',
            'rules' => 'required|matches[confirm_password]'
         ],
         'confirm_password' => [
            'label' => 'Konfirmasi password',
            'rules' => 'required|matches[password]'
         ]
      ];
   }

   public function cariMahasiswa(): array
   {
      return [
         'id_prodi' => [
            'label' => 'Program studi',
            'rules' => 'required',
         ],
         'nim' => [
            'label' => 'NIM',
            'rules' => 'required'
         ],
      ];
   }

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
