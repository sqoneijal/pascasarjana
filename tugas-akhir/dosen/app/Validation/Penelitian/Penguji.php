<?php

namespace App\Validation\Penelitian;

class Penguji
{

   public function submitPerbaikiHasilSeminar(): array
   {
      return [
         'keterangan_perbaikan' => [
            'rules' => 'required',
            'label' => 'Catatan perbaikan'
         ],
      ];
   }
}
