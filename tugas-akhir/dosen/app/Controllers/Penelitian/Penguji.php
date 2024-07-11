<?php

namespace App\Controllers\Penelitian;

use App\Controllers\BaseController;
use App\Models\Penelitian\Penguji as Model;

class Penguji extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Penguji',
      ];

      $this->template($this->data);
   }

   public function submitTelahSeminar(): object
   {
      $model = new Model();
      $content = $model->submitTelahSeminar($this->post);
      return $this->respond($content);
   }

   public function getDetail(): object
   {
      $model = new Model();
      $content = $model->getDetail($this->post);
      return $this->respond($content);
   }

   public function getData()
   {
      $model = new Model();
      $query = $model->getData($this->getVar);

      $output = [
         'draw' => intval(@$this->post['draw']),
         'recordsTotal' => intval($model->countData($this->getVar)),
         'recordsFiltered' => intval($model->filteredData($this->getVar)),
         'data' => $query
      ];
      return $this->respond($output);
   }
}
