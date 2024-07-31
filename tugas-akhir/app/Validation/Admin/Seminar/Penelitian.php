<?php

namespace App\Validation\Admin\Seminar;

class Penelitian
{

   public function submitPenguji(): array
   {
      return [
         'nidn' => [
            'label' => 'NIDN/NIK',
            'rules' => 'required|numeric'
         ],
         'nama_dosen' => [
            'label' => 'Nama dosen',
            'rules' => 'required'
         ],
         'penguji_ke' => [
            'label' => 'Penuji ke',
            'rules' => 'required|numeric'
         ],
         'apakah_dosen_uin' => [
            'label' => 'Apakah dosen UIN',
            'rules' => 'required|in_list[t,f]'
         ],
         'id_kategori_kegiatan' => [
            'label' => 'Kategori kegiatan',
            'rules' => 'required|numeric'
         ]
      ];
   }

   public function submitJadwalSeminar(): array
   {
      return [
         'tanggal_seminar' => [
            'rules' => 'required|valid_date[Y-m-d]',
            'label' => 'Tanggal seminar'
         ],
         'jam_seminar' => [
            'rules' => 'required',
            'label' => 'Jam seminar'
         ]
      ];
   }

   public function submitTidakValidLampiran(): array
   {
      return [
         'catatan' => [
            'label' => 'Catatan tidak valid',
            'rules' => 'required'
         ]
      ];
   }
}
