<?php

namespace App\Validation\Admin\Seminar;

class Proposal
{

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

   private function validasiProgramMBKM(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         if ($data['kampusMerdeka'] === 't' && empty($value)) {
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
            'label' => 'Judul penelitian',
            'rules' => 'required'
         ],
         'jenis_anggota' => [
            'label' => 'Jenis anggota',
            'rules' => 'required'
         ]
      ];
   }
}
