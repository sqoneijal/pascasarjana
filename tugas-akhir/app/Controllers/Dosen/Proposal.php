<?php

namespace App\Controllers\Dosen;

use App\Controllers\BaseController;
use App\Models\Dosen\Proposal as Model;
use App\Validation\Dosen\Proposal as Validate;

class Proposal extends BaseController
{
   public function index()
   {
      $this->data = [
         'title' => 'Seminar Proposal'
      ];

      $this->template($this->data);
   }

   public function updateStatusTesis(): object
   {
      $model = new Model();
      $content = $model->updateStatusTesis($this->post);
      return $this->respond($content);
   }

   public function submitSudahSeminar(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitSudahSeminar())) {
         $model = new Model();
         $submit = $model->submitSudahSeminar($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function submitPerbaiki(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitPerbaiki())) {
         $model = new Model();
         $submit = $model->submitPerbaiki($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
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
