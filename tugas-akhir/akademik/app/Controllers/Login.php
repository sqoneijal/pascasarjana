<?php

namespace App\Controllers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\Login as Model;

class Login extends BaseController
{

   public function index(string $token)
   {
      try {
         $decoded = JWT::decode($token, new Key('gB?RR<SiE!@g~;wYPd7.xlNj&D3@6Q39xB_8+t!U|o1LH7L@T:@37^JVAH3?{Zq', 'HS256'));
         $data = (array) $decoded;

         $model = new Model();
         $content = $model->submit($data);

         if ($content['status']) {
            $session = \Config\Services::session();
            $session->set('isLogin', true);
            $session->set($data);

            return redirect()->to('/');
         } else {
            return $this->fail($content);
         }
      } catch (\Exception $e) {
         return $this->fail($e->getMessage());
      }
   }

   public function logout(): object
   {
      $session = \Config\Services::session();

      $session->remove('isLogin');
      $session->remove('id');
      $session->destroy();

      return redirect()->to(LOGIN_PAGE);
   }

   public function init(): object
   {
      $model = new Model();
      $data = $model->initUsers();
      return $this->respond($data);
   }
}
