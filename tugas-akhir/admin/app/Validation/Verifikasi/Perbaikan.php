<?php

namespace App\Validation\Verifikasi;

class Perbaikan
{

   public function submit(): array
   {
      return ['status' => [
         'label' => 'Status verifikasi',
         'rules' => 'required'
      ]];
   }
}
