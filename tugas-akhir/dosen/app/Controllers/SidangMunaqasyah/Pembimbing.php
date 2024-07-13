<?php

namespace App\Controllers\SidangMunaqasyah;

use App\Controllers\BaseController;
use App\Models\SidangMunaqasyah\Pembimbing as Model;

class Pembimbing extends BaseController
{
   public function index()
   {
      $this->data = [
         'title' => 'Pembimbing',
      ];

      $this->template($this->data);
   }

   public function submitLanjutSidang(): object
   {
      $model = new Model();
      $content = $model->submitLanjutSidang($this->post);
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
