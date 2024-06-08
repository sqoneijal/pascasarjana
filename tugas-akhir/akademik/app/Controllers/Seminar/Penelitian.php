<?php

namespace App\Controllers\Seminar;

use App\Controllers\BaseController;
use App\Models\Referensi;
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
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->hapusPenguji())) {
         $model = new Model();
         $submit = $model->hapusPenguji($this->post);

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
      $content = $model->getDetailVerifikasiProposal($this->post['id_status_tugas_akhir']);
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
