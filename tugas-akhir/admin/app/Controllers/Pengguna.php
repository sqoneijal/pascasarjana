<?php

namespace App\Controllers;

use App\Models\Pengguna as Model;
use App\Validation\Pengguna as Validate;

class Pengguna extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Pengguna'
      ];

      $this->template($this->data);
   }

   public function cariMahasiswa(): object
   {
      $model = new Model();
      $getToken = $model->getTokenFeeder();

      $response = ['status' => false];
      if ($getToken['status']) {
         $q = $this->post['query'];

         $idProdi = $model->getIDProdiPasca();

         $act = $model->feederAction($getToken['token'], 'GetListMahasiswa', [
            'filter' => "id_prodi in (" . $idProdi . ") and trim(lower(nama_mahasiswa)) like '%" . trim(strtolower($q)) . "%' or trim(lower(nim)) like '%" . trim(strtolower($q)) . "%'"
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

   public function hapus(): object
   {
      $response = ['status' => false, 'errors' => [], 'msg_response' => 'Terjadi sesuatu kesalahan.'];

      $validation = new Validate();
      if ($this->validate($validation->hapus())) {
         $model = new Model();
         $submit = $model->hapus($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $errors = \Config\Services::validation()->getErrors();
         foreach ($errors as $key) {
            $response['msg_response'] = $key;
         }
      }
      return $this->respond($response);
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
