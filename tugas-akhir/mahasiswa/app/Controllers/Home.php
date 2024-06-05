<?php

namespace App\Controllers;

use App\Models\Home as Model;
use App\Validation\Home as Validate;

class Home extends BaseController
{
   public function index(): void
   {
      $this->data = [
         'title' => 'Dashboard'
      ];

      $this->template($this->data);
   }

   public function getDetailMunaqasyah(): object
   {
      $model = new Model();
      $content = $model->getDetailMunaqasyah($this->post['nim']);
      return $this->respond($content);
   }

   public function getDetailSeminarPenelitian(): object
   {
      $model = new Model();
      $content = $model->getDetailSeminarPenelitian($this->post['nim']);
      return $this->respond($content);
   }

   public function updateStatusTugasAkhir(): object
   {
      $model = new Model();
      $content = $model->updateStatusTugasAkhir($this->post);
      return $this->respond($content);
   }

   public function submitDaftarSeminarProposal(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitDaftarSeminarProposal())) {
         $model = new Model();
         $submit = $model->submitDaftarSeminarProposal($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function getDetailSeminarProposal(): object
   {
      $model = new Model();
      $content = $model->getDetailSeminarProposal($this->post['nim']);
      return $this->respond($content);
   }

   public function submitPenentuanSK(): object
   {
      $model = new Model();
      $content = $model->submitPenentuanSK($this->post);
      return $this->respond($content);
   }

   public function submitTelahSeminar(): object
   {
      $model = new Model();
      $content = $model->submitTelahSeminar($this->post);
      return $this->respond($content);
   }

   public function submitDaftarUlangProposal(): object
   {
      $model = new Model();
      $data = $model->submitDaftarUlangProposal($this->post);
      return $this->respond($data);
   }

   public function submitDaftarProposal(): object
   {
      $model = new Model();
      $data = $model->submitDaftarProposal($this->post);
      return $this->respond($data);
   }

   public function uploadLampiran(): object
   {
      $file = $this->request->getFile('file');
      $upload_path = WRITEPATH . 'uploads/';

      $response = ['status' => false, 'msg_response' => 'Terjadi sesuatu kesalahan. Silahkan coba kembali.'];
      if ($file) {
         $doUpload = doUpload($file, $upload_path, ['pdf']);
         if ($doUpload['status']) {
            $filePath = $upload_path . $doUpload['content'];
            $cdnUpload = cdnUpload('tugas-akhir', $filePath, $doUpload['content'], $file, $this->post['nim']);
            if ($cdnUpload['status']) {
               $model = new Model();
               $submit = $model->updateLampiran(array_merge($this->post, ['lampiran' => $cdnUpload['content']]));

               $response['status'] = true;
               $response['content'] = $submit;
               $response['fileName'] = $cdnUpload['content'];
               $response['msg_response'] = 'File lampiran berhasil di upload';
            } else {
               $response['msg_response'] = $cdnUpload['content'];
            }

            @unlink($filePath);
         } else {
            $response['msg_response'] = $doUpload['content'];
         }
      }
      return $this->respond($response);
   }

   public function getDaftarLampiran(): object
   {
      $model = new Model();
      $data = $model->getDaftarLampiran($this->post);
      return $this->respond($data);
   }
}
