<?php

namespace App\Validation\Verifikasi;

class Proposal
{

   public function submit(): array
   {
      return [
         'status' => [
            'label' => 'Status verifikasi',
            'rules' => 'required'
         ]
      ];
   }
}
