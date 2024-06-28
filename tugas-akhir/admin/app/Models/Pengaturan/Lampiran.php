<?php

namespace App\Models\Pengaturan;

use App\Models\Common;

class Lampiran extends Common
{

   public function submit(array $post): array
   {
      try {
         $table = $this->db->table('tb_mst_syarat');
         $table->where('id', $post['id']);
         $table->update([
            'nama_lampiran' => $post['lampiran'],
            'id_google_drive' => $post['id_google_drive']
         ]);
         return ['status' => true, 'content' => $this->getLampiran(), 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function getData(): array
   {
      return [
         'lampiran' => $this->getLampiran()
      ];
   }

   private function getLampiran(): array
   {
      $table = $this->db->table('tb_mst_syarat');
      $table->where('ada_lampiran', true);

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
}
