<?php

namespace App\Models;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Login extends Common
{

   public function initLogin(): array
   {
      $session = \Config\Services::session();

      $table = $this->db->table('tb_status_tugas_akhir');
      $table->where('nim', $session->get('nim'));

      $get = $table->get();
      $data = $get->getRowArray();
      $fieldNames = $get->getFieldNames();
      $get->freeResult();

      $response = [];
      if (isset($data)) {
         foreach ($fieldNames as $field) {
            $response[$field] = ($data[$field] ? trim($data[$field]) : (string) $data[$field]);
         }

         $response['pengaturan'] = $this->getDataPengaturan();
         $response['syarat'] = $this->getDaftarSyarat();
      }
      return $response;
   }

   private function getDaftarSyarat(): array
   {
      $table = $this->db->table('tb_mst_syarat');
      $table->orderBy('id');

      $get = $table->get();
      $result = $get->getResultArray();
      $fieldNames = $get->getFieldNames();
      $get->freeResult();

      $response = [];
      foreach ($result as $key => $val) {
         foreach ($fieldNames as $field) {
            $response[$key][$field] = $val[$field] ? trim($val[$field]) : (string) $val[$field];
         }
      }
      return $response;
   }

   private function getUsers(array $post): array
   {
      $table = $this->db->table('tb_users');
      $table->select('username');
      $table->where('id', $post['id']);

      $get = $table->get();
      $data = $get->getRowArray();
      $get->freeResult();

      $response['status'] = false;
      if (isset($data)) {
         $tokenFeeder = $this->getTokenFeeder();

         if ($tokenFeeder['error_code'] === 0) {
            $riwayatPendidikan = $this->getRiwayatPendidikan($tokenFeeder['data']['token'], $data['username']);
            if ($riwayatPendidikan['status']) {
               $response['status'] = true;
               $response['data'] = $riwayatPendidikan['data'];
            }
         }
      }
      return $response;
   }

   private function getRiwayatPendidikan(string $token, string $nim): array
   {
      $curl = \Config\Services::curlrequest();
      $req = $curl->request('POST', FEEDER_URL, [
         'json' => [
            'act' => 'GetDataLengkapMahasiswaProdi',
            'token' => $token,
            'filter' => "nim = '$nim'"
         ],
      ]);

      $body = json_decode($req->getBody(), true);

      $response['status'] = false;
      if ($body['error_code'] === 0 && arrLength($body['data'])) {
         $response['status'] = true;
         $response['data'] = $body['data'][0];
      }
      return $response;
   }

   private function getTokenFeeder(): array
   {
      $curl = \Config\Services::curlrequest();
      $req = $curl->request('POST', FEEDER_URL, [
         'json' => [
            'act' => 'GetToken',
            'username' => FEEDER_USERNAME,
            'password' => FEEDER_PASSWORD
         ],
      ]);

      return json_decode($req->getBody(), true);
   }

   private function getKodeProdi(): array
   {
      $table = $this->db->table('tb_prodi');
      $table->select('kode, id_feeder');

      $get = $table->get();
      $result = $get->getResultArray();
      $get->freeResult();

      $response = [];
      foreach ($result as $row) {
         $response[$row['id_feeder']] = $row['kode'];
      }
      return $response;
   }

   public function generateStatusTugasAkhir(array $post): array
   {
      $response = ['status' => false, 'msg_response' => 'Terjadi sesuatu kesalahan. Silahkan dicoba kembali.'];
      try {
         $getUsers = $this->getUsers($post);

         if ($getUsers['status']) {
            $kodeProdi = $this->getKodeProdi();

            $post['nim'] = $getUsers['data']['nim'];
            $post['kode_prodi'] = $kodeProdi[$getUsers['data']['id_prodi']];
            $post['nama'] = $getUsers['data']['nama_mahasiswa'];
            $post['angkatan'] = substr($getUsers['data']['id_periode_masuk'], 0, 4);
            $post['email'] = $getUsers['data']['email'];
            $post['hp'] = $getUsers['data']['handphone'];

            $periode = $this->getPeriodeAktif();

            if (arrLength($periode)) {
               $checkOldestRegister = $this->checkOldestRegister($post);
               if ($checkOldestRegister > 0) {
                  $this->updateStatusTugasAkhir(array_merge($post, $periode));
               } else {
                  $this->insertStatusTugasAkhir(array_merge($post, $periode));
               }

               $this->generateSession($post);

               $response['status'] = true;
            } else {
               $response['msg_response'] = 'Periode tugas akhir belum aktif. Silahkan hubungi akademik untuk info lebih lanjut.';
            }
         } else {
            $response['status'] = false;
         }
      } catch (\Exception $e) {
         $response['msg_response'] = $e->getMessage();
      }
      return $response;
   }

   private function generateSession(array $post): void
   {
      $session = \Config\Services::session();
      $session->set('isLogin', true);
      $session->set('nim', $post['nim']);
   }

   private function checkOldestRegister(array $post): int
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->where('nim', $post['nim']);

      return $table->countAllResults();
   }

   private function updateStatusTugasAkhir(array $post): void
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->where('nim', $post['nim']);
      $table->update([
         'id_periode' => $post['id'],
         'kode_prodi' => $post['kode_prodi'],
         'nama' => $post['nama'],
         'angkatan' => $post['angkatan'],
         'modified' => new RawSql('now()'),
         'email' => $post['email'],
         'hp' => $post['hp'],
      ]);
   }

   private function insertStatusTugasAkhir(array $post): void
   {
      $table = $this->db->table('tb_status_tugas_akhir');
      $table->insert([
         'nim' => $post['nim'],
         'id_periode' => $post['id'],
         'kode_prodi' => $post['kode_prodi'],
         'nama' => $post['nama'],
         'angkatan' => $post['angkatan'],
         'uploaded' => new RawSql('now()'),
         'email' => $post['email'],
         'hp' => $post['hp'],
      ]);
   }
}
