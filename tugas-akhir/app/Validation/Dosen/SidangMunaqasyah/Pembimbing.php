<?php

namespace App\Validation\Dosen\SidangMunaqasyah;

class Pembimbing
{

   public function submitPerbaikiSidang(): array
   {
      return [
         'catatan' => [
            'label' => 'Catatan',
            'rules' => 'required'
         ]
      ];
   }
}
