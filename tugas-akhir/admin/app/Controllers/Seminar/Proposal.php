<?php

namespace App\Controllers\Seminar;

use App\Controllers\BaseController;
use App\Models\Seminar\Proposal as Model;
use App\Validation\Seminar\Proposal as Validate;

class Proposal extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Proposal'
      ];

      $this->template($this->data);
   }

   public function hapusPembimbing(): object
   {
      $model = new Model();
      $content = $model->hapusPembimbing($this->post);
      return $this->respond($content);
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

   public function submitPenetapanSK(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitPenetapanSK())) {
         $model = new Model();
         $submit = $model->submitPenetapanSK($this->post);

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

   public function initPage(): object
   {
      $model = new Model();

      $content = [
         'daftarPeriode' => $model->getDaftarPeriode(),
         'daftarProdi' => $model->getDaftarProdi(),
         'daftarAngkatan' => $model->getDaftarAngkatan(),
         'daftarJenisAktivitas' => $model->getDaftarJenisAktivitas(),
         'daftarKategoriKegiatan' => $model->getDaftarKategoriKegiatan(),
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
