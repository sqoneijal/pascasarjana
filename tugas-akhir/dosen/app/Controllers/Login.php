<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\Login as Model;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Login extends BaseController
{

   public function index(string $jwt)
   {
      try {
         $decoded = (array) JWT::decode($jwt, new Key(JWT_KEY, 'HS256'));

         $model = new Model();
         $getData = $model->getDataUser($decoded);

         if (!empty($getData)) {
            $session = \Config\Services::session();
            $session->set('isLogin', true);
            $session->set($getData);
            return redirect()->to('dashboard');
         } else {
            return redirect()->to(LOGIN_URL);
         }
      } catch (\Exception $e) {
         return redirect()->to(LOGIN_URL);
      }
   }

   public function initLogin(): object
   {
      $session = \Config\Services::session();
      $model = new Model();

      return $this->respond(array_merge($session->get(), [
         'periode' => $model->getDaftarPeriode()
      ]));
   }

   public function logout()
   {
      $session = \Config\Services::session();

      $session->remove('IsLogin');
      $session->destroy();

      return redirect()->to(LOGIN_URL);
   }
}
