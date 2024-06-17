<?php

namespace App\Validation\Verifikasi;

class Perbaikan
{

   public function submitStatusProposal(): array
   {
      return [
         'status' => [
            'label' => 'Status',
            'rules' => 'required'
         ]
      ];
   }
}
