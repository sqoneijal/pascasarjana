<?php

namespace App\Validation\Dosen\Penelitian;

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
