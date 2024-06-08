<?php

namespace App\Models\Pengaturan;

use App\Models\Common;

class Lampiran extends Common
{

   public function submit(array $post): void
   {
      $data[$post['field']] = $post['file'];

      $table = $this->db->table('tb_pengaturan');
      $table->where('id', 1);
      $table->update($data);
   }
}
