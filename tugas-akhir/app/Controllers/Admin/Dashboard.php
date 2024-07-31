<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\Admin\Dashboard as Model;

class Dashboard extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Dasbhoard'
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
