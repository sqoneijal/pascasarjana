<?php

namespace App\Validation;

class Proposal
{

   public function submitSudahSeminar(): array
   {
      return [
         'judul_proposal_final' => [
            'label' => 'Judul proposal',
            'rules' => 'required'
         ]
      ];
   }

   public function submitPerbaiki(): array
   {
      return [
         'keterangan' => [
            'label' => 'Alasan perbaiki',
            'rules' => 'required'
         ]
      ];
   }
}
