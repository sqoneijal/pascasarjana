<?php

namespace App\Controllers\Admin\Verifikasi;

use App\Controllers\BaseController;
use App\Models\Admin\Verifikasi\Diterima as Model;
use App\Validation\Admin\Verifikasi\Diterima as Validate;

class Diterima extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Diterima'
      ];

      $this->template($this->data);
   }

   public function hapusPembimbing(): object
   {
      $response = ['status' => false, 'errors' => [], 'msg_response' => 'Terjadi sesuatu kesalahan.'];

      $validation = new Validate();
      if ($this->validate($validation->hapusPembimbing())) {
         $model = new Model();
         $submit = $model->hapusPembimbing($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $errors = \Config\Services::validation()->getErrors();
         foreach ($errors as $key) {
            $response['msg_response'] = $key;
         }
      }
      return $this->respond($response);
   }

   public function cariDosen(): object
   {
      $model = new Model();
      $tokenFeeder = $model->getTokenFeeder();

      $response = ['status' => false, 'msg_response' => 'Terjadi sesuatu kesalahan, silahkan coba lagi.'];
      if ($tokenFeeder['status']) {
         $token = $tokenFeeder['token'];

         $action = $model->feederAction($token, 'DetailBiodataDosen', [
            'filter' => "trim(lower(nama_dosen)) like '%" . trim(strtolower($this->post['query'])) . "%' or trim(lower(nidn)) like '%" . trim(strtolower($this->post['query'])) . "%'"
         ]);

         if ($action['status']) {
            $response['status'] = true;
            $response['content'] = $action['content'];
         } else {
            $response['msg_response'] = $action['msg_response'];
         }
      } else {
         $response['msg_response'] = $tokenFeeder['msg_response'];
      }
      return $this->respond($response);
   }

   public function submitPembimbing(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitPembimbing())) {
         $model = new Model();
         $submit = $model->submitPembimbing($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function submitJadwalSeminar(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitJadwalSeminar())) {
         $model = new Model();
         $submit = $model->submitJadwalSeminar($this->post);

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
         'daftarKategoriKegiatan' => $model->getDaftarKategoriKegiatan(),
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
