<?php

namespace App\Validation;

class Home
{

   public function submitDaftarSeminarProposal(): array
   {
      return [
         'judul_proposal_1' => [
            'label' => 'Judul proposal 1',
            'rules' => 'required'
         ],
         'judul_proposal_2' => [
            'label' => 'Judul proposal 2',
            'rules' => 'required'
         ],
         'judul_proposal_3' => [
            'label' => 'Judul proposal 3',
            'rules' => 'required'
         ],
      ];
   }
}
