<?php

namespace App\Controllers\Seminar;

use App\Controllers\BaseController;
use App\Models\Referensi;
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

   public function submitPembimbingPenelitian(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitPembimbingPenelitian())) {
         $model = new Model();
         $submit = $model->submitPembimbingPenelitian($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function hapusPembimbingPenelitian(): object
   {
      $response = ['status' => false, 'errors' => [], 'msg_response' => 'Terjadi sesuatu kesalahan.'];

      $validation = new Validate();
      if ($this->validate($validation->hapusPembimbingPenelitian())) {
         $model = new Model();
         $submit = $model->hapusPembimbingPenelitian($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $errors = \Config\Services::validation()->getErrors();
         foreach ($errors as $key) {
            $response['msg_response'] = $key;
         }
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
      $content = $model->getDetailVerifikasiProposal($this->post['id_status_tugas_akhir']);
      return $this->respond($content);
   }

   public function initPage(): object
   {
      $referensi = new Referensi();
      $model = new Model();

      $content = [
         'daftarPeriode' => $referensi->getDaftarPeriode(),
         'daftarProdi' => $referensi->getDaftarProdi(),
         'daftarAngkatan' => $model->getDaftarAngkatan(),
         'daftarJenisAktivitas' => $referensi->getDaftarJenisAktivitas(),
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
