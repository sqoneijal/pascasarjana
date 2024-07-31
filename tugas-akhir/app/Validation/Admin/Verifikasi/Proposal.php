<?php

namespace App\Validation\Admin\Verifikasi;

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
