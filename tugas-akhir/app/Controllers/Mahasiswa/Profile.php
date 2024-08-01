<?php

namespace App\Controllers\Mahasiswa;

use App\Controllers\BaseController;
use App\Models\Mahasiswa\Profile as Model;
use App\Validation\Mahasiswa\Profile as Validate;

class Profile extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Profile'
      ];

      $this->template($this->data);
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
}
