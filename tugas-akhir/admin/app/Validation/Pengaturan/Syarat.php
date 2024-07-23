<?php

namespace App\Validation\Pengaturan;

class Syarat
{

   public function submit(): array
   {
      return [
         'nama' => [
            'label' => 'Keterangan lampiran',
            'rules' => 'required'
         ],
         'wajib' => [
            'label' => 'Apakah wajib',
            'rules' => 'required'
         ],
         'ada_lampiran' => [
            'label' => 'Apakah ada lampiran',
            'rules' => 'required'
         ]
      ];
   }
}
