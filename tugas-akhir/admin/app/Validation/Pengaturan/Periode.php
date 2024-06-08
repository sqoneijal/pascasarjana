<?php

namespace App\Validation\Pengaturan;

class Periode
{

   private function validasiTahunAjaran($db): callable
   {
      return static function ($value, array $data, ?string &$error = null) use ($db): bool {
         $periode = $value . @$data['id_semester'];

         $table = $db->table('tb_periode');
         $table->where('concat(tahun_ajaran, id_semester) =', $periode);

         $count = $table->countAllResults();
         if ($count > 0) {
            $error = 'Tahun ajaran sudah terdaftar.';
            return false;
         }
         return true;
      };
   }

   private function validasiIDSemester($db): callable
   {
      return static function ($value, array $data, ?string &$error = null) use ($db): bool {
         $periode = @$data['tahun_ajaran'] . $value;

         $table = $db->table('tb_periode');
         $table->where('concat(tahun_ajaran, id_semester) =', $periode);

         $count = $table->countAllResults();
         if ($count > 0) {
            $error = 'Tahun ajaran sudah terdaftar.';
            return false;
         }
         return true;
      };
   }

   public function submit(): array
   {
      $db = \Config\Database::connect();
      $validasiTahunAjaran = $this->validasiTahunAjaran($db);
      $validasiIDSemester = $this->validasiIDSemester($db);

      return [
         'tahun_ajaran' => [
            'label' => 'Tahun ajaran',
            'rules' => ['required', 'numeric', 'exact_length[4]', $validasiTahunAjaran]
         ],
         'id_semester' => [
            'label' => 'Semester',
            'rules' => ['required', 'numeric', $validasiIDSemester]
         ]
      ];
   }

   private function validasiHapus(): callable
   {
      return static function ($value, array $data, ?string &$error = null): bool {
         $db = \Config\Database::connect();

         $table = $db->table('tb_status_tugas_akhir');
         $table->where('id_periode', $value);

         $count = $table->countAllResults();

         if ($count > 0) {
            $error = 'Tidak dapat menghapus periode ' . periode($data['periode']) . ' yang telah digunakan.';
            return false;
         }
         return true;
      };
   }

   public function hapus(): array
   {
      $validasiHapus = $this->validasiHapus();

      return [
         'id' => [
            'label' => 'ID periode',
            'rules' => ['required', 'numeric', 'is_not_unique[tb_periode.id,id]', $validasiHapus]
         ],
      ];
   }
}
