<?php

namespace App\Controllers\Mahasiswa;

use App\Controllers\BaseController;
use App\Models\Mahasiswa\Home as Model;
use App\Validation\Mahasiswa\Home as Validate;
use Google\Client as Google_Client;
use Google\Service\Drive as Google_Service_Drive;
use Google\Service\Drive\DriveFile as Google_Service_Drive_DriveFile;

class Home extends BaseController
{
   public function index(): void
   {
      $this->data = [
         'title' => 'Dashboard'
      ];

      $this->template($this->data);
   }

   public function updateJudulProposal(): void
   {
      $model = new Model();
      $model->updateJudulProposal($this->post);
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

      $response = ['status' => false, 'msg_response' => 'Terjadi sesuatu kesalahan. Silahkan coba kembali.'];
      if ($file) {
         try {
            $parentId = '1ugNtsy45yXDq_Y0eOAxso2KJBISOKV2a';

            $client = new Google_Client();
            $client->setAuthConfig(WRITEPATH . 'uploads/google-service-account.json');
            $client->addScope(Google_Service_Drive::DRIVE);

            $driveService = new Google_Service_Drive($client);

            $driveFile = new Google_Service_Drive_DriveFile();
            $folderId = cariFolderGoogleDrive($driveService, $this->post['nim'], $parentId);

            if ($folderId === null) {
               $folderId = buatFolderGoogleDrive($driveService, $this->post['nim'], $parentId);
            }

            $driveFile->setName($file->getClientName());
            $driveFile->setParents([$folderId]);

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
               $model->updateLampiran($this->post);

               $response['status'] = true;
               $response['msg_response'] = 'File lampiran berhasil di upload';
               $response['googleFile'] = $googleFile;
            } else {
               $response['msg_response'] = 'Gagal upload file, silahkan coba kembali.';
            }
         } catch (\Exception $e) {
            $response['msg_response'] = $e->getMessage();
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
