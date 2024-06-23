<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class Penelitian extends BaseController
{
   public function index()
   {
      $this->data = [
         'title' => 'Seminar Penelitian'
      ];

      $this->template($this->data);
   }
}
