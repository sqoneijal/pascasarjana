<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\Admin\Sidang as Model;
use App\Validation\Admin\Sidang as Validate;

class Sidang extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Sidang'
      ];

      $this->template($this->data);
   }

   public function hapusPenguji(): object
   {
      $model = new Model();
      $content = $model->hapusPenguji($this->post);
      return $this->respond($content);
   }

   public function submitPenguji(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitPenguji())) {
         $model = new Model();
         $submit = $model->submitPenguji($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function cariDosen(): object
   {
      $model = new Model();
      $getToken = $model->getTokenFeeder();

      $response = ['status' => false];
      if ($getToken['status']) {
         $q = $this->post['query'];

         $act = $model->feederAction($getToken['token'], 'DetailBiodataDosen', [
            'filter' => "trim(lower(nama_dosen)) like '%" . trim(strtolower($q)) . "%' or trim(lower(nidn)) like '%" . trim(strtolower($q)) . "%'"
         ]);

         if ($act['status']) {
            $response['status'] = true;
            $response['content'] = $act['content'];
         } else {
            $response['msg_response'] = $act['msg_response'];
         }
      } else {
         $response['msg_response'] = $getToken['msg_response'];
      }
      return $this->respond($response);
   }

   public function submitJadwalSidang(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitJadwalSidang())) {
         $model = new Model();
         $submit = $model->submitJadwalSidang($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function submitNotValidLampiran(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitNotValidLampiran())) {
         $model = new Model();
         $submit = $model->submitNotValidLampiran($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function submitValidLampiran(): object
   {
      $model = new Model();
      $content = $model->submitValidLampiran($this->post);
      return $this->respond($content);
   }

   public function getDetail(): object
   {
      $model = new Model();
      $content = $model->getDetail($this->post);
      return $this->respond($content);
   }

   public function initPage(): object
   {
      $model = new Model();
      $content = [
         'daftarProdi' => $model->getDaftarProdi(),
         'daftarAngkatan' => $model->getDaftarAngkatan(),
         'daftarPeriode' => $model->getDaftarPeriode(),
         'daftarKategoriKegiatan' => $model->getDaftarKategoriKegiatan(),
      ];
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
