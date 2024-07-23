<?php

namespace App\Controllers\Pengaturan;

use App\Controllers\BaseController;
use App\Models\Pengaturan\Syarat as Model;
use App\Validation\Pengaturan\Syarat as Validate;
use Google\Client as Google_Client;
use Google\Service\Drive as Google_Service_Drive;
use Google\Service\Drive\DriveFile as Google_Service_Drive_DriveFile;

class Syarat extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Syarat'
      ];

      $this->template($this->data);
   }

   public function hapus(): object
   {
      $model = new Model();
      $content = $model->hapus($this->post);
      return $this->respond($content);
   }

   public function submit(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submit())) {
         if ($this->post['ada_lampiran'] === 't') {
            $berkas = $this->uploadBerkasLampiran($this->request->getFile('file'));
            if ($berkas['status']) {
               $this->post['id_google_drive'] = $berkas['content']['id'];
               $this->post['nama_lampiran'] = $berkas['content']['name'];
            }
         }

         $model = new Model();
         $submit = $model->submit($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   private function uploadBerkasLampiran($file): array
   {
      try {
         $client = new Google_Client();
         $client->setAuthConfig(WRITEPATH . 'uploads/google-service-account.json');
         $client->addScope(Google_Service_Drive::DRIVE);

         $driveService = new Google_Service_Drive($client);

         $driveFile = new Google_Service_Drive_DriveFile();
         $driveFile->setName($file->getClientName());
         $driveFile->setParents(['1ugNtsy45yXDq_Y0eOAxso2KJBISOKV2a']);

         $upload = $driveService->files->create($driveFile, array(
            'data' => file_get_contents($file->getTempName()),
            'mimeType' => $file->getClientMimeType(),
            'uploadType' => 'multipart'
         ));
         return ['status' => true, 'content' => $upload, 'msg_response' => 'Data berhasil disimpan.'];
      } catch (\Exception $e) {
         return ['status' => false, 'msg_response' => $e->getMessage()];
      }
   }

   public function getData()
   {
      $model = new Model();
      $query = $model->getData($this->getVar);

      $output = [
         'draw' => intval(@$this->post['draw']),
         'recordsTotal' => intval($model->countData($this->getVar)),
         'recordsFiltered' => intval($model->filteredData($this->getVar)),
         'data' => $query
      ];
      return $this->respond($output);
   }
}
