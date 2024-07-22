<?php

namespace App\Controllers\SidangMunaqasyah;

use App\Controllers\BaseController;
use App\Models\SidangMunaqasyah\Penguji as Model;
use App\Validation\SidangMunaqasyah\Penguji as Validate;

class Penguji extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Penguji'
      ];

      $this->template($this->data);
   }

   public function submitPerbaikiHasilSidang(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitPerbaikiHasilSidang())) {
         $model = new Model();
         $submit = $model->submitPerbaikiHasilSidang($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function submitSudahMelaksanakanSidang(): object
   {
      $model = new Model();
      $content = $model->submitSudahMelaksanakanSidang($this->post);
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
