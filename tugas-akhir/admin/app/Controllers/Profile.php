<?php

namespace App\Controllers;

use App\Models\Profile as Model;
use App\Validation\Profile as Validate;

class Profile extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Profile'
      ];

      $this->template($this->data);
   }

   public function avatar()
   {
      $filename = $this->getVar['name'];
      $path = WRITEPATH . 'uploads/' . $filename;

      $file = new \CodeIgniter\Files\File($path);
      $mime = $file->getMimeType();

      if (in_array($mime, ['image/png', 'image/jpg', 'image/jpeg'])) {
         $handle = fopen($path, "rb");
         $content = fread($handle, filesize($path));

         fclose($handle);
         header("content-type: " . $mime);
         die($content);
      } else {
         unlink($path);
      }
   }

   public function getAksesLogs(): object
   {
      $model = new Model();
      $content = $model->getAksesLogs($this->post['id']);
      return $this->respond($content);
   }

   public function getLoginSession(): object
   {
      $model = new Model();
      $content = $model->getLoginSession($this->post['id']);
      return $this->respond($content);
   }

   public function gantiAvatar(): object
   {
      $file = $this->request->getFile('avatar');
      $upload_path = WRITEPATH . 'uploads';

      $response = ['status' => false, 'msg_response' => 'Terjadi sesuatu kesalahan.'];

      if ($file) {
         $doUpload = doUpload($file, $upload_path, ['png', 'jpg', 'jpeg']);
         if ($doUpload['status']) {
            $model = new Model();
            $model->gantiAvatar([
               'id' => $this->post['id'],
               'avatar' => $doUpload['content']
            ]);

            $response['status'] = true;
            $response['msg_response'] = 'Data berhasil disimpan.';
            $response['content'] = $doUpload['content'];
         } else {
            $response['msg_response'] = $doUpload['content'];
         }
      }

      return $this->respond($response);
   }

   public function submit(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submit())) {
         $model = new Model();
         $submit = $model->submit($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }
}
