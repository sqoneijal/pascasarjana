<?php

namespace App\Controllers\Verifikasi;

use App\Controllers\BaseController;
use App\Models\Referensi;
use App\Models\Verifikasi\Proposal as Model;
use App\Validation\Verifikasi\Proposal as Validate;

class Proposal extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Proposal'
      ];

      $this->template($this->data);
   }

   public function submitChangeValidStatus(): object
   {
      $model = new Model();
      $data = $model->submitChangeValidStatus($this->post);
      return $this->respond($data);
   }

   public function initPage(): object
   {
      $model = new Model();
      $referensi = new Referensi();

      $data = [
         'daftarAngkatan' => $model->getDaftarAngkatan(),
         'daftarProdi' => $referensi->getDaftarProdi(),
         'daftarPeriode' => $referensi->getDaftarPeriode(),
         'daftarStatusTesis' => $referensi->getDaftarStatusTesis(),
      ];
      return $this->respond($data);
   }

   public function getDetail(): object
   {
      $model = new Model();
      $data = $model->getDetailVerifikasiProposal($this->post['id_status_tugas_akhir']);
      return $this->respond($data);
   }

   public function submit(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submit())) {
         $model = new Model();
         $submit = $model->submit($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
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
