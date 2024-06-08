<?php

namespace App\Validation\Verifikasi;

class Diterima
{

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

   public function hapusPembimbing(): array
   {
      return [
         'id' => [
            'label' => 'ID bimbingan',
            'rules' => 'required|is_not_unique[tb_pembimbing_seminar.id,id]'
         ]
      ];
   }

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

   public function submitTimPembimbing(): array
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
            'rules' => [$validasiNIDN, 'numeric']
         ],
         'nama_dosen' => [
            'label' => 'Nama lengkap',
            'rules' => [$validasiNamaDosen]
         ],
         'id_kategori_kegiatan' => [
            'label' => 'Kategori kegiatan',
            'rules' => 'required|numeric'
         ],
         'pembimbing_ke' => [
            'label' => 'Pembimbing ke',
            'rules' => 'required|numeric|greater_than[0]'
         ]
      ];
   }
}
