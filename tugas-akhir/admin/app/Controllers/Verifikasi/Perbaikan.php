<?php

namespace App\Controllers\Verifikasi;

use App\Controllers\BaseController;
use App\Models\Verifikasi\Perbaikan as Model;
use App\Validation\Verifikasi\Perbaikan as Validate;

class Perbaikan extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Perbaikan'
      ];

      $this->template($this->data);
   }

   public function submitStatusProposal(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitStatusProposal())) {
         $model = new Model();
         $submit = $model->submitStatusProposal($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function submitStatusLampiran(): object
   {
      $model = new Model();
      $content = $model->submitStatusLampiran($this->post);
      return $this->respond($content);
   }

   public function getDetail(): object
   {
      $model = new Model();
      $data = $model->getDetailStatusTugasAkhir($this->post);
      return $this->respond($data);
   }

   public function initPage(): object
   {
      $model = new Model();

      $data = [
         'daftarAngkatan' => $model->getDaftarAngkatan(),
         'daftarProdi' => $model->getDaftarProdi(),
         'daftarPeriode' => $model->getDaftarPeriode(),
         'daftarStatusTesis' => $model->getDaftarStatusTesis(),
      ];
      return $this->respond($data);
   }

   public function getData(): object
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
