<?php

namespace App\Models\Admin\Verifikasi;

use App\Models\Common;
use CodeIgniter\Database\RawSql;

class Proposal extends Common
{

   public function submitStatusProposal(array $post): array
   {
      try {
         $fields = ['keterangan', 'judul_proposal_final'];
         foreach ($fields as $field) {
            if (@$post[$field]) {
               $data[$field] = $post[$field];
            } else {
               $data[$field] = null;
            }
         }

         $data['user_modified'] = $post['user_modified'];
         $data['modified'] = new RawSql('now()');

         if ($post['status'] === 'valid') {
            $data['status'] = 5;
         } else {
            $data['status'] = 3;
         }

         $table = $this->db->table('tb_status_tugas_akhir');
         $table->where('nim', $post['nim']);
         $table->where('id_periode', $post['id_periode']);
         $table->update($data);

         return ['status' => true, 'content' => '', 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function submitStatusLampiran(array $post): array
   {
      try {
         $data['modified'] = new RawSql('now()');
         $data['user_modified'] = $post['user_modified'];

         if ($post['status'] === 'valid') {
            $data['valid'] = true;
         } elseif ($post['status'] === 'tidak_valid') {
            $data['valid'] = false;
            $data['keterangan'] = $post['keterangan'];
         } else {
            $data['valid'] = null;
         }

         $table = $this->db->table('tb_lampiran_upload');
         $table->where('id', $post['id_lampiran_upload']);
         $table->update($data);

         return [
            'status' => true,
            'content' => $this->getLampiranUpload(['nim' => $post['nim'], 'id_periode' => $post['id_periode']]),
            'msg_response' => 'Data berhasil disimpan.'
         ];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
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

      $this->dt_where($table, [
         'tsta.status' => 1,
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
      $table->select('tsta.id, tsta.nim, tsta.nama, tsta.angkatan, concat(tp.jenjang, \' \', tp.nama) as program_studi, tsta.status, tsta.id_periode, tss.short_name as status_tesis');
      $table->join('tb_prodi tp', 'tp.id_feeder = tsta.id_prodi');
      $table->join('tb_status_tesis tss', 'tss.id = tsta.status');

      $this->dt_where($table, [
         'tsta.status' => 1,
         'tsta.id_periode' => @$post['id_periode'],
         'tsta.id_prodi' => @$post['id_prodi'],
         'tsta.angkatan' => @$post['angkatan'],
      ]);

      $this->prepareDatatableColumnSearch($table, ['tsta.nim', 'tsta.nama', 'tsta.angkatan', 'tp.nama']);
      $this->prepareDatatableColumnOrder($table, ['nim', 'nama', 'angkatan', 'program_studi']);

      return $table;
   }
}
