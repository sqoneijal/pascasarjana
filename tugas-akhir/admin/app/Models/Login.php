<?php

namespace App\Models;

use App\Models\Common;

class Login extends Common
{

   public function initUsers(): array
   {
      $session = \Config\Services::session();

      $table = $this->db->table('tb_users');
      $table->where('id', $session->get('id'));
      $table->where('role', $session->get('role'));

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

   private function getPeriodeAktif(): array
   {
      $table = $this->db->table('tb_periode');
      $table->select('id, concat(tahun_ajaran, id_semester) as semester');
      $table->where('status', true);

      $get = $table->get();
      $data = $get->getRowArray();
      $fieldNames = $get->getFieldNames();
      $get->freeResult();

      $response = [];
      if (isset($data)) {
         foreach ($fieldNames as $field) {
            $response[$field] = ($data[$field] ? trim($data[$field]) : (string) $data[$field]);
         }
      }
      return $response;
   }

   public function submit(array $post): array
   {
      $response = ['status' => false, 'msg_response' => 'Terjadi sesuatu kesalahan.', 'errors' => []];
      try {
         $table = $this->db->table('tb_users');
         $table->where('id', $post['id']);
         $table->where('role', $post['role']);

         $count = $table->countAllResults();

         if ($count > 0) {
            $response['status'] = true;
            $response['msg_response'] = 'Login berhasil.';
         } else {
            $response['msg_response'] = 'Akun tidak ditemukan.';
         }
      } catch (\Exception $e) {
         $response['msg_response'] = $e->getMessage();
      }
      return $response;
   }
}
