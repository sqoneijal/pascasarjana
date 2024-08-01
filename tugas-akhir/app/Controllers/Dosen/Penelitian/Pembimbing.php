<?php

namespace App\Controllers\Dosen\Penelitian;

use App\Controllers\BaseController;
use App\Models\Dosen\Penelitian\Pembimbing as Model;

class Pembimbing extends BaseController
{
   public function index()
   {
      $this->data = [
         'title' => 'Pembimbing'
      ];

      $this->template($this->data);
   }

   public function submit(): object
   {
      $model = new Model();
      $content = $model->submit($this->post);
      return $this->respond($content);
   }

   public function getDetail(): object
   {
      $model = new Model();
      $data = $model->getDetail($this->post);
      return $this->respond($data);
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
