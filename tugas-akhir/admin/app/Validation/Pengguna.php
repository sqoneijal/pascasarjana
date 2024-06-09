<?php

namespace App\Validation;

class Pengguna
{

   public function hapus(): array
   {
      return [
         'id' => [
            'label' => 'ID users',
            'rules' => 'required|numeric'
         ]
      ];
   }

   private function validasiPassword(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         $status = true;
         if ($data['pageType'] === 'insert') {
            if (strlen($value) < 1) {
               $error = 'Password tidak boleh kosong.';
               $status = false;
            }

            if ($value !== @$data['confirm_password']) {
               $error = 'Password tidak sesuai dengan konfirmasi password.';
               $status = false;
            }
         }

         if ($data['pageType'] === 'update' && strlen($value) > 0 && $value !== @$data['confirm_password']) {
            $error = 'Password tidak sesuai dengan konfirmasi password.';
            $status = false;
         }
         return $status;
      };
   }

   private function validasiKonfirmasiPassword(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         $status = true;
         if ($data['pageType'] === 'insert') {
            if (strlen($value) < 1) {
               $error = 'Konfirmasi password tidak boleh kosong.';
               $status = false;
            }

            if ($value !== @$data['password']) {
               $error = 'Konfirmasi password tidak sesuai dengan password.';
               $status = false;
            }
         }

         if ($data['pageType'] === 'update' && strlen($value) > 0 && $value !== @$data['password']) {
            $error = 'Konfirmasi password tidak sesuai dengan password.';
            $status = false;
         }
         return $status;
      };
   }

   private function validasiUsername(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         if ($data['pageType'] === 'insert') {
            $db = \Config\Database::connect();
            $table = $db->table('tb_users');
            $table->where('trim(lower(username))', strtolower($value));
            if ($table->countAllResults() > 0) {
               $error = 'Username sudah digunakan.';
               return false;
            }
         }
         return true;
      };
   }

   private function validasiEmail(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         if ($value !== @$data['old_email']) {
            $db = \Config\Database::connect();
            $table = $db->table('tb_users');
            $table->where('trim(lower(email))', strtolower($value));
            if ($table->countAllResults() > 0) {
               $error = 'Email sudah digunakan.';
               return false;
            }
         }
         return true;
      };
   }

   private function validasiDosen(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         if (@$data['role'] === '3' && strlen($value) < 1) {
            $error = 'Dosen tidak boleh kosong.';
            return false;
         }
         return true;
      };
   }

   private function validasiMahasiswa(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         if (@$data['role'] === '4' && strlen($value) < 1) {
            $error = 'Mahasiswa tidak boleh kosong.';
            return false;
         }
         return true;
      };
   }

   public function submit(): array
   {
      $validasiPassword = $this->validasiPassword();
      $validasiKonfirmasiPassword = $this->validasiKonfirmasiPassword();
      $validasiUsername = $this->validasiUsername();
      $validasiEmail = $this->validasiEmail();
      $validasiDosen = $this->validasiDosen();
      $validasiMahasiswa = $this->validasiMahasiswa();

      return [
         'role' => [
            'label' => 'Role',
            'rules' => 'required|numeric'
         ],
         'nama' => [
            'label' => 'Nama Lengkap',
            'rules' => 'required'
         ],
         'email' => [
            'label' => 'Email',
            'rules' => ['required', 'valid_email', $validasiEmail]
         ],
         'username' => [
            'label' => 'Username',
            'rules' => ['required', $validasiUsername]
         ],
         'password' => [
            'label' => 'Password',
            'rules' => [$validasiPassword]
         ],
         'confirm_password' => [
            'label' => 'Konfirmasi password',
            'rules' => [$validasiKonfirmasiPassword]
         ],
         'dosen' => [
            'label' => 'Dosen',
            'rules' => [$validasiDosen]
         ],
         'mahasiswa' => [
            'label' => 'Mahasiswa',
            'rules' => [$validasiMahasiswa]
         ]
      ];
   }
}
