<?php

namespace App\Controllers;

use App\Models\Sidang as Model;
use App\Validation\Sidang as Validate;
use App\Models\Referensi;

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

   public function cariDosen(): object
   {
      $model = new Model();

      $tokenFeeder = $model->getTokenFeeder();

      $response['status'] = $tokenFeeder['status'];
      $response['msg_response'] = @$tokenFeeder['msg_response'];
      if ($tokenFeeder['status']) {
         $query = trim(strtolower($this->post['query']));

         $req = $model->feederAction($tokenFeeder['token'], 'DetailBiodataDosen', [
            'limit' => 100,
            'filter' => "trim(lower(nidn)) like '%" . $query . "%' or trim(lower(nama_dosen)) like '%" . $query . "%'"
         ]);

         $response['content'] = $req['content'];
      }

      return $this->respond($response);
   }

   public function submitTimPenguji(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitTimPenguji())) {
         $model = new Model();
         $submit = $model->submitTimPenguji($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
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

   public function getDetailSidang(): object
   {
      $model = new Model();
      $content = $model->getDetailSidang($this->post['nim']);
      return $this->respond($content);
   }

   public function initPage(): object
   {
      $referensi = new Referensi();
      $model = new Model();

      $content = [
         'daftarAngkatan' => $model->getDaftarAngkatan(),
         'daftarProdi' => $referensi->getDaftarProdi(),
         'daftarPeriode' => $referensi->getDaftarPeriode(),
         'daftarKategoriKegiatan' => $referensi->getDaftarKategoriKegiatan(),
         'daftarStatusTesis' => $referensi->getDaftarStatusTesis(),
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
