<?php

namespace App\Controllers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\Login as Model;

class Login extends BaseController
{

   public function index(string $jwt)
   {
      try {
         $decoded = JWT::decode($jwt, new Key(JWT_KEY, 'HS256'));
         $data = (array) $decoded;

         $model = new Model();
         $submit = $model->generateStatusTugasAkhir($data);

         if ($submit['status']) {
            return redirect()->to('/');
         } else {
            return redirect()->to(LOGIN_PAGE);
         }
      } catch (\Exception $e) {
         die('Login gagal, silahkan soba kembali. ' . $e->getMessage());
      }
   }

   public function init(): object
   {
      $model = new Model();
      $data = $model->initLogin();
      return $this->respond($data);
   }

   public function logout()
   {
      $session = \Config\Services::session();

      $session->remove('isLogin');
      $session->remove('nim');
      $session->destroy();

      return redirect()->to(LOGIN_PAGE);
   }

   public function perluLoginDulu(): void
   {
      $this->data = [
         'title' => 'Login Gagal'
      ];

      $this->templateBelumLogin($this->data);
   }
}
