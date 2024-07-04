<?php

namespace App\Controllers\Seminar;

use App\Controllers\BaseController;
use App\Models\Seminar\Penelitian as Model;
use App\Validation\Seminar\Penelitian as Validate;

class Penelitian extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Penelitian'
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

   public function submitTidakValidLampiran(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitTidakValidLampiran())) {
         $model = new Model();
         $submit = $model->submitTidakValidLampiran($this->post);

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
         'daftarAngkatan' => $model->getDaftarAngkatan(),
         'daftarProdi' => $model->getDaftarProdi(),
         'daftarPeriode' => $model->getDaftarPeriode(),
         'daftarKategoriKegiatan' => $model->getDaftarKategoriKegiatan(),
         'daftarStatusTesis' => $model->getDaftarStatusTesis(),
      ];
      return $this->respond($content);
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
