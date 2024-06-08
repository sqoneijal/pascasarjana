<?php

namespace App\Models\Verifikasi;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Perbaikan extends Common
{

   public function submitChangeValidStatus(array $post): array
   {
      try {
         if ($post['status'] === 'valid') {
            $data[$post['field']] = $post['checked'] === 'false' ? null : true;
         } elseif ($post['status'] === 'not_valid') {
            $data[$post['field']] = $post['checked'] === 'true' ? false : null;

            if ($post['checked'] === 'true') {
               $this->updateKeteranganLampiran($post);
            }
         }

         $table = $this->db->table('tb_status_approve_lampiran');
         $table->where('id', $post['id']);
         $table->update($data);

         $content = [
            'statusApproveLampiran' => $this->getDetailStatusApproveLampiran($post['id_lampiran']),
            'keteranganApproveLampiran' => $this->getDetailKeteranganApproveLampiran($post['id_lampiran']),
         ];

         return ['status' => true, 'content' => $content, 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   private function updateKeteranganLampiran(array $post): void
   {
      $data[$post['field']] = $post['catatan'];

      $table = $this->db->table('tb_keterangan_approve_lampiran');
      $table->where('id_lampiran', $post['id_lampiran']);
      $table->update($data);
   }

   public function submit(array $post): array
   {
      $response = ['status' => false, 'msg_response' => 'Terjadi sesuatu kesalahan.', 'errors' => []];
      try {
         $fields = ['status'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];
         $data['modified'] = new RawSql('now()');

         $table = $this->db->table('tb_status_tugas_akhir');
         $table->where('id', $post['id']);
         $table->update($data);

         $response['status'] = true;
         $response['msg_response'] = 'Data berhasil disimpan.';
      } catch (\Exception $e) {
         $response['msg_response'] = $e->getMessage();
      }
      return $response;
   }

   public function getData(array $post): array
   {
      try {
         $table = $this->queryData($post);
         $table->limit((int) $post['length'], (int) $post['start']);

         $get = $table->get();
         $result = $get->getResultArray();
         $fieldNames = $get->getFieldNames();

         $get->freeResult();

         $response = [];
         foreach ($result as $key => $val) {
            foreach ($fieldNames as $field) {
               $response[$key][$field] = ($val[$field] ? trim($val[$field]) : '');
            }
         }
         return $response;
      } catch (\Exception $e) {
         die($e->getMessage());
      }
   }

   public function countData(array $post): int
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->join('tb_prodi tp', 'tp.kode = tsta.kode_prodi');
      $table->whereIn('tsta.status', [3, 4]);

      $this->dt_where($table, [
         'tsta.id_periode' => @$post['id_periode']
      ]);
      return $table->countAllResults();
   }

   public function filteredData(array $post): int
   {
      $table = $this->queryData($post);
      return $table->countAllResults();
   }

   private function queryData(array $post): object
   {
      $table = $this->db->table('tb_status_tugas_akhir tsta');
      $table->select('tsta.id, tsta.nim, tsta.nama, tsta.angkatan, concat(tp.jenjang, \' \', tp.nama) as program_studi, tsta.status');
      $table->join('tb_prodi tp', 'tp.kode = tsta.kode_prodi');
      $table->whereIn('tsta.status', [3, 4]);

      $this->dt_where($table, [
         'tsta.id_periode' => @$post['id_periode'],
         'tsta.kode_prodi' => @$post['kode_prodi'],
         'tsta.angkatan' => @$post['angkatan'],
      ]);

      $this->prepareDatatableColumnSearch($table, ['tsta.nim', 'tsta.nama', 'tsta.angkatan', 'tp.nama']);
      $this->prepareDatatableColumnOrder($table, ['nim', 'nama', 'angkatan', 'program_studi']);

      return $table;
   }
}
