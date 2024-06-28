<?php

namespace App\Controllers\Pengaturan;

use App\Controllers\BaseController;
use App\Models\Pengaturan\Lampiran as Model;
use Google\Client as Google_Client;
use Google\Service\Drive as Google_Service_Drive;
use Google\Service\Drive\DriveFile as Google_Service_Drive_DriveFile;

class Lampiran extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Lampiran'
      ];

      $this->template($this->data);
   }

   public function getData()
   {
      $model = new Model();
      $data = $model->getData();
      return $this->respond($data);
   }

   public function submit(): object
   {
      $file = $this->request->getFile('file');

      $response = ['status' => false, 'msg_response' => 'Terjadi sesuatu kesalahan. Silahkan coba kembali.'];
      if ($file) {
         try {
            $client = new Google_Client();
            $client->setAuthConfig(WRITEPATH . 'uploads/google-service-account.json');
            $client->addScope(Google_Service_Drive::DRIVE);

            $driveService = new Google_Service_Drive($client);

            $driveFile = new Google_Service_Drive_DriveFile();
            $driveFile->setName($file->getClientName());
            $driveFile->setParents(['1ugNtsy45yXDq_Y0eOAxso2KJBISOKV2a']);

            $googleFile = $driveService->files->create($driveFile, array(
               'data' => file_get_contents($file->getTempName()),
               'mimeType' => $file->getClientMimeType(),
               'uploadType' => 'multipart'
            ));

            $response['googleFile'] = $googleFile;
            if ($googleFile['id']) {
               $this->post['id_google_drive'] = $googleFile['id'];
               $this->post['lampiran'] = $googleFile['name'];

               $model = new Model();
               $submit = $model->submit($this->post);

               $response['status'] = true;
               $response['msg_response'] = 'File lampiran berhasil di upload';
               $response['content'] = $submit['content'];
            } else {
               $response['msg_response'] = 'Gagal upload file, silahkan coba kembali.';
            }
         } catch (\Exception $e) {
            return ['status' => false, 'msg_response' => $e->getMessage()];
         }
      }
      return $this->respond($response);
   }
}
