<?php

namespace App\Models;

use App\Models\Common;
use CodeIgniter\Database\RawSql;
use Firebase\JWT\JWT;

class Login extends Common
{

   public function submit(array $post): array
   {
      $response = ['status' => false, 'msg_response' => 'Terjadi sesuatu kesalahan.', 'errors' => []];
      try {
         $table = $this->db->table('tb_users');
         $table->select('id, password, role');
         $table->groupStart();
         $table->where('username', $post['username']);
         $table->orWhere('email', $post['username']);
         $table->groupEnd();

         $get = $table->get();
         $data = $get->getRowArray();
         $get->freeResult();

         $response = [];
         if (isset($data) && (password_verify($post['password'], $data['password']))) {
            unset($data['password']);

            $this->insertLoginLogs($data);

            $jwt = JWT::encode($data, JWT_KEY, 'HS256');

            $response['status'] = true;
            $response['content'] = $data;
            $response['token'] = $jwt;
            $response['msg_response'] = 'Login berhasil, halaman segera dialihkan.';
         } else {
            $response['msg_response'] = 'Login gagal, silahkan coba kembali.';
         }
         return $response;
      } catch (\Exception $e) {
         $response['msg_response'] = $e->getMessage();
      }
      return $response;
   }

   private function insertLoginLogs(array $post): void
   {
      $request = \Config\Services::request();
      $client = \Config\Services::curlrequest();

      $response = $client->request('GET', 'http://www.geoplugin.net/json.gp');
      $body = $response->getBody();
      $geo = json_decode($body, true);

      $agent = $request->getUserAgent();

      if ($agent->isBrowser()) {
         $currentAgent = $agent->getBrowser() . ' ' . $agent->getVersion();
      } elseif ($agent->isRobot()) {
         $currentAgent = $agent->getRobot();
      } elseif ($agent->isMobile()) {
         $currentAgent = $agent->getMobile();
      } else {
         $currentAgent = 'Unidentified User Agent';
      }

      $userAgent = [$currentAgent, $agent->getPlatform()];

      $table = $this->db->table('tb_login_logs');
      $table->insert([
         'id_users' => $post['id'],
         'last_login' => new RawSql('now()'),
         'ip_address' => $request->getIPAddress(),
         'city' => $geo['geoplugin_city'],
         'region' => $geo['geoplugin_region'],
         'countryname' => $geo['geoplugin_countryName'],
         'continentname' => $geo['geoplugin_continentName'],
         'latitude' => $geo['geoplugin_latitude'],
         'longitude' => $geo['geoplugin_longitude'],
         'timezone' => $geo['geoplugin_timezone'],
         'device' => implode(' - ', $userAgent),
      ]);
   }
}
