<?php

namespace App\Validation\Seminar;

class Proposal
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

   public function submitPembimbingPenelitian(): array
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
         'pembimbing_ke' => [
            'label' => 'Pembimbing ke',
            'rules' => 'required|numeric|greater_than[0]'
         ]
      ];
   }

   public function hapusPembimbingPenelitian(): array
   {
      return [
         'id' => [
            'label' => 'ID pembimbing',
            'rules' => 'required|numeric'
         ]
      ];
   }

   private function validasiProgramMBKM(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         if ($data['kampusMerdeka'] === 'true' && empty($value)) {
            $error = 'Program MBKM tidak boleh kosong.';
            return false;
         }
         return true;
      };
   }

   public function submitPenetapanSK(): array
   {
      $validasiProgramMBKM = $this->validasiProgramMBKM();

      return [
         'id_periode' => [
            'label' => 'Semester',
            'rules' => 'required|numeric'
         ],
         'id_jenis_aktivitas' => [
            'label' => 'Jenis aktivitas',
            'rules' => 'required|numeric'
         ],
         'program_mbkm' => [
            'label' => 'Program MBKM',
            'rules' => [$validasiProgramMBKM]
         ],
         'nomor_sk_tugas' => [
            'label' => 'Nomor SK tugas',
            'rules' => 'required'
         ],
         'tanggal_sk_tugas' => [
            'label' => 'Tanggal SK tugas',
            'rules' => 'required|valid_date[Y-m-d]'
         ],
         'judul' => [
            'label' => 'Judul',
            'rules' => 'required'
         ]
      ];
   }
}
