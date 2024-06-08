<?php

namespace App\Controllers\Verifikasi;

use App\Controllers\BaseController;
use App\Models\Verifikasi\Diterima as Model;
use App\Validation\Verifikasi\Diterima as Validate;
use App\Models\Referensi;

class Diterima extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Diterima'
      ];

      $this->template($this->data);
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

   public function submitTimPembimbing(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitTimPembimbing())) {
         $model = new Model();
         $submit = $model->submitTimPembimbing($this->post);

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

   public function getDetail(): object
   {
      $model = new Model();
      $data = $model->getDetailVerifikasiProposal($this->post['id_status_tugas_akhir']);
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
         'daftarKategoriKegiatan' => $referensi->getDaftarKategoriKegiatan(),
         'daftarStatusTesis' => $referensi->getDaftarStatusTesis(),
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
