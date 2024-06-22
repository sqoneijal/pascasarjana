<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\Proposal as Model;

class Proposal extends BaseController
{
   public function index()
   {
      $this->data = [
         'title' => 'Seminar Proposal'
      ];

      $this->template($this->data);
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
