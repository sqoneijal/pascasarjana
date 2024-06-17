<?php

namespace App\Validation\Verifikasi;

class Proposal
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
