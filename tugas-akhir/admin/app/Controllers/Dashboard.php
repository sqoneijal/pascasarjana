<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\Dashboard as Model;

class Dashboard extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Dashboard'
      ];

      $this->template($this->data);
   }

   public function initPage(): object
   {
      $model = new Model();
      $content = $model->initPage($this->getVar);
      return $this->respond($content);
   }
}
