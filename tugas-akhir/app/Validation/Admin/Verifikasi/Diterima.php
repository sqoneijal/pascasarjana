<?php

namespace App\Validation\Admin\Verifikasi;

class Diterima
{

   public function hapusPembimbing(): array
   {
      return [
         'id' => [
            'label' => 'ID pembimbing',
            'rules' => 'required|numeric'
         ],
      ];
   }

   private function validasiNIDN(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         $status = true;
         if (strlen($value) < 1) {
            if (@$data['apakah_dosen_uin'] === 't') {
               $error = 'Dosen tidak boleh kosong.';
               $status = false;
            }

            if (@$data['apakah_dosen_uin'] === 'f') {
               $error = 'NIK tidak boleh kosong.';
               $status = false;
            }
         }
         return $status;
      };
   }

   private function validasiNamaDosen(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         $status = true;
         if (strlen($value) < 1) {
            if (@$data['apakah_dosen_uin'] === 't') {
               $error = 'Dosen tidak boleh kosong.';
               $status = false;
            }

            if (@$data['apakah_dosen_uin'] === 'f') {
               $error = 'Nama lengkap tidak boleh kosong.';
               $status = false;
            }
         }
         return $status;
      };
   }

   public function submitPembimbing(): array
   {
      $validasiNIDN = $this->validasiNIDN();
      $validasiNamaDosen = $this->validasiNamaDosen();

      return [
         'pembimbing_ke' => [
            'label' => 'Pembimbing ke',
            'rules' => 'required|numeric|greater_than[0]'
         ],
         'id_kategori_kegiatan' => [
            'label' => 'Kategori kegiatan',
            'rules' => 'required|numeric'
         ],
         'apakah_dosen_uin' => [
            'label' => 'Apakah dosen uin',
            'rules' => 'required'
         ],
         'nidn' => [
            'rules' => [$validasiNIDN]
         ],
         'nama_dosen' => [
            'rules' => [$validasiNamaDosen]
         ],
      ];
   }

   public function submitJadwalSeminar(): array
   {
      return [
         'tanggal_seminar' => [
            'label' => 'Tanggal seminar',
            'rules' => 'required|valid_date[Y-m-d]'
         ],
         'jam_seminar' => [
            'label' => 'Jam seminar',
            'rules' => 'required'
         ]
      ];
   }
}
