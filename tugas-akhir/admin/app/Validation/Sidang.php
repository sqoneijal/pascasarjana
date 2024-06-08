<?php

namespace App\Validation;

class Sidang
{

   private function validasiDosen(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         if (empty($value) && @$data['apakah_dosen_uin'] === 'true') {
            $error = 'Dosen tidak boleh kosong.';
            return false;
         }
         return true;
      };
   }

   private function validasiNIDN(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         if ($data['apakah_dosen_uin'] === 'false' && empty($value)) {
            $error = 'NIK tidak boleh kosong.';
            return false;
         }
         return true;
      };
   }

   private function validasiNamaDosen(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         if (empty($value) && @$data['apakah_dosen_uin'] === 'false') {
            $error = 'Nama lengkap tidak boleh kosong.';
            return false;
         }
         return true;
      };
   }

   public function submitTimPenguji(): array
   {
      $validasiDosen = $this->validasiDosen();
      $validasiNIDN = $this->validasiNIDN();
      $validasiNamaDosen = $this->validasiNamaDosen();

      return [
         'dosen' => [
            'label' => 'Dosen',
            'rules' => [$validasiDosen]
         ],
         'nidn' => [
            'label' => 'NIK',
            'rules' => [$validasiNIDN]
         ],
         'nama_dosen' => [
            'label' => 'Nama lengkap',
            'rules' => [$validasiNamaDosen]
         ],
         'id_kategori_kegiatan' => [
            'label' => 'Kategori kegiatan',
            'rules' => 'required|numeric'
         ],
         'penguji_ke' => [
            'label' => 'Penguji ke',
            'rules' => 'required|numeric|greater_than[0]'
         ]
      ];
   }

   public function submitJadwalSidang(): array
   {
      return [
         'tanggal' => [
            'label' => 'Tanggal sidang',
            'rules' => 'required|valid_date[Y-m-d]'
         ],
         'jam' => [
            'label' => 'Jam sidang',
            'rules' => 'required'
         ]
      ];
   }
}
