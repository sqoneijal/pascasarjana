<?php

namespace App\Validation\SidangMunaqasyah;

class Penguji
{

   public function submitPerbaikiHasilSidang(): array
   {
      return [
         'keterangan_perbaikan' => [
            'rules' => 'required',
            'label' => 'Catatan perbaikan'
         ]
      ];
   }
}
