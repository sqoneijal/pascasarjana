<?php

namespace App\Models;

use CodeIgniter\Database\RawSql;

class Home extends Common
{

   public function initLogin(): array
   {
      $session = \Config\Services::session();

      $table = $this->db->table('tb_users tu');
      $table->select('tu.*, tsta.status');
      $table->join('tb_status_tugas_akhir tsta', 'tsta.nim = tu.username', 'left');
      $table->where('tu.id', $session->get('id'));
      $table->where('tu.role', $session->get('role'));

      $get = $table->get();
      $data = $get->getRowArray();
      $fieldNames = $get->getFieldNames();
      $get->freeResult();

      $response = [];
      if (isset($data)) {
         foreach ($fieldNames as $field) {
            $response[$field] = ($data[$field] ? trim($data[$field]) : (string) $data[$field]);
         }
         $response['periode'] = $this->getPeriodeAktif();
         $response['syarat'] = $this->getDaftarSyarat();
      }

      unset($response['password']);
      return $response;
   }

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

            $session = \Config\Services::session();
            $session->set('isLogin', true);
            $session->set($data);

            $response['status'] = true;
            $response['msg_response'] = 'Login berhasil, halaman segera dialihkan.';
            $response['redirect_to'] = $this->getRedirectTo($data['role']);
         } else {
            $response['msg_response'] = 'Login gagal, silahkan coba kembali.';
         }
         return $response;
      } catch (\Exception $e) {
         $response['msg_response'] = $e->getMessage();
      }
      return $response;
   }

   private function getRedirectTo(int $role): string
   {
      switch ($role) {
         case 1:
            $redirect = '/admin';
            break;
         case 2:
            $redirect = '/akademik';
            break;
         case 3:
            $redirect = '/dosen';
            break;
         case 4:
            $redirect = '/mahasiswa';
            break;
         default:
            $redirect = '/';
            break;
      }
      return $redirect;
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
