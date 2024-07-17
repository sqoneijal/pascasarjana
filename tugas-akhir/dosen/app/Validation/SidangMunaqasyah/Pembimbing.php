<?php

namespace App\Validation\SidangMunaqasyah;

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
