<?php

namespace App\Controllers;

class Home extends BaseController
{
   public function index(): void
   {
      $this->data = [
         'title' => 'Login'
      ];

      $this->template($this->data);
   }
}
