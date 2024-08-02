<?php

namespace App\Controllers;

use App\Validation\Home as Validate;
use App\Models\Home as Model;

class Home extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Login'
      ];

      return $this->template($this->data);
   }

   public function submitDaftar(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitDaftar())) {
         $model = new Model();
         $submit = $model->submitDaftar($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function cariMahasiswa(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->cariMahasiswa())) {
         $model = new Model();
         $submit = $model->cariMahasiswa($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function initRegister(): object
   {
      $model = new Model();
      $content = [
         'daftarProdi' => $model->getDaftarProdi(),
      ];
      return $this->respond($content);
   }

   public function initLogin(): object
   {
      $model = new Model();
      $data = $model->initLogin();
      return $this->respond($data);
   }

   public function submit()
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

   public function logout()
   {
      $session = \Config\Services::session();
      $session->destroy();
      return redirect()->to('/');
   }
}
