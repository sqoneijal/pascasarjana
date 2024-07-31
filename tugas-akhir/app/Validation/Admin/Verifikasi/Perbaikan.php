<?php

namespace App\Validation\Admin\Verifikasi;

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
