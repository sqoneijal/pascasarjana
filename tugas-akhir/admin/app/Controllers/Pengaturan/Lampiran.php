<?php

namespace App\Controllers\Pengaturan;

use App\Controllers\BaseController;
use App\Models\Pengaturan\Lampiran as Model;

class Lampiran extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Lampiran'
      ];

      $this->template($this->data);
   }

   public function initPage(): object
   {
      $model = new Model();
      $data = $model->getDataPengaturan();
      return $this->respond($data);
   }

   public function submit(): object
   {
      $file = $this->request->getFile('file');
      $uploadPath = WRITEPATH . 'uploads';

      $response = ['status' => false, 'msg_response' => 'Terjadi sesuatu kesalahan. Silahkan dicoba kembali.'];
      if ($file) {
         $doUpload = doUpload($file, $uploadPath, ['doc', 'docx', 'pdf']);
         if ($doUpload['status']) {
            $filePath = $uploadPath . '/' . $doUpload['content'];
            $cdnUpload = cdnUpload('tugas-akhir', $filePath, $doUpload['content'], $file);
            if ($cdnUpload['status']) {
               $model = new Model();
               $model->submit(array_merge($this->post, ['file' => $cdnUpload['content']]));

               $response['status'] = true;
               $response['msg_response'] = 'Lampiran berhasil diupload.';
               $response['content'] = $model->getDataPengaturan();
            } else {
               $response['msg_response'] = $cdnUpload['content'];
            }
            @unlink($uploadPath . '/' . $doUpload['content']);
         } else {
            $response['msg_response'] = $doUpload['content'];
         }
      }
      return $this->respond($response);
   }
}
