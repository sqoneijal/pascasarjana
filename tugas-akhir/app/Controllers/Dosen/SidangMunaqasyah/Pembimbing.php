<?php

namespace App\Controllers\Dosen\SidangMunaqasyah;

use App\Controllers\BaseController;
use App\Models\Dosen\SidangMunaqasyah\Pembimbing as Model;
use App\Validation\Dosen\SidangMunaqasyah\Pembimbing as Validate;

class Pembimbing extends BaseController
{
   public function index()
   {
      $this->data = [
         'title' => 'Pembimbing',
      ];

      $this->template($this->data);
   }

   public function submitSudahSidang(): object
   {
      $model = new Model();
      $content = $model->submitSudahSidang($this->post);
      return $this->respond($content);
   }

   public function submitPerbaikiSidang(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitPerbaikiSidang())) {
         $model = new Model();
         $submit = $model->submitPerbaikiSidang($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
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
