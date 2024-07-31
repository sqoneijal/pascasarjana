<?php

namespace App\Validation\Admin;

class Sidang
{

   public function submitPenguji(): array
   {
      return [
         'apakah_dosen_uin' => [
            'rules' => 'required|in_list[t,f]',
            'label' => 'Apakah dosen UIN ar raniry'
         ],
         'nidn' => [
            'rules' => 'required',
            'label' => 'NIDN/NIK'
         ],
         'nama_dosen' => [
            'rules' => 'required',
            'label' => 'Nama'
         ],
         'id_kategori_kegiatan' => [
            'rules' => 'required|numeric',
            'label' => 'Kategori kegiatan'
         ],
         'penguji_ke' => [
            'rules' => 'required|numeric|greater_than[0]',
            'label' => 'Penguji ke'
         ]
      ];
   }

   public function submitJadwalSidang(): array
   {
      return [
         'jam' => [
            'label' => 'Jam sidang',
            'rules' => 'required'
         ],
         'tanggal' => [
            'label' => 'Tanggal sidang',
            'rules' => 'required|valid_date[Y-m-d]'
         ]
      ];
   }

   public function submitNotValidLampiran(): array
   {
      return [
         'keterangan' => [
            'label' => 'Catatan',
            'rules' => 'required'
         ]
      ];
   }
}
