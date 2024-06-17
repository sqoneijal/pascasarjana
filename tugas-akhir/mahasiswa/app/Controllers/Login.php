<?php

namespace App\Controllers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\Login as Model;
use Google_Client;
use Google\Service\Drive;

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

   public function googleAuth()
   {
      $google = new Google_Client();
      $google->setClientId('1082692189858-ujm1c5eojeencvdo9vkc3mot8ekm8tlf.apps.googleusercontent.com');
      $google->setClientSecret('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');
      $google->setRedirectUri(site_url('login/googleauth'));
      $google->addScope(Drive::DRIVE_FILE);

      if (!isset($_GET['code'])) {
         $auth_url = $google->createAuthUrl();
         return redirect()->to(filter_var($auth_url, FILTER_SANITIZE_URL));
      } else {
         $token = $google->fetchAccessTokenWithAuthCode($_GET['code']);
         if (isset($token['error'])) {
            return 'Error fetching access token: ' . htmlspecialchars($token['error']);
         }

         $google->setAccessToken($token);

         if (isset($token['refresh_token'])) {
            session()->set('google_refresh_token', $token['refresh_token']);
         }

         session()->set('google_access_token', $token);
         session()->set('googleLogin', true);
         return redirect()->to('/');
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
