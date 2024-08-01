<?php

namespace App\Controllers\Dosen;

use App\Controllers\BaseController;
use App\Models\Dosen\Dashboard as Model;

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
      $content = $model->initPage($this->post['nidn']);
      return $this->respond($content);
   }
}
