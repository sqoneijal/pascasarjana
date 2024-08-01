<?php

use CodeIgniter\Files\File;

function doUpload($file, $upload_path, $ext_allowed = [])
{
   try {
      if (!file_exists($upload_path)) {
         mkdir($upload_path, 0755);
      }

      $max_upload = 2;
      $client_mime = $file->getMimeType();
      $allowed_mime = getAllowedMimeTypes($ext_allowed);

      if (isClientMimeTypeAllowed($client_mime, $allowed_mime) && isFileSizeAllowed($file, $max_upload)) {
         $getRandomName = $file->getRandomName();
         $file->move($upload_path, $getRandomName);

         if (isUploadedFileValid($upload_path, $getRandomName, $allowed_mime)) {
            $response['status'] = true;
            $response['content'] = $getRandomName;
         } else {
            $response['status'] = false;
            $response['content'] = 'Anda mencoba upload file yang tidak diizinkan oleh sistem.';
         }
      } else {
         $response['status'] = false;
         $response['content'] = 'File yang coba anda upload tidak diizinkan.';
      }
   } catch (\Exception $e) {
      $response = ['status' => false, 'msg_response' => $e->getMessage()];
   }
   return $response;
}

function getAllowedMimeTypes($ext_allowed)
{
   $config_mime = new \Config\Mimes();
   $allowed_mime = [];

   foreach ($ext_allowed as $ext) {
      foreach ($config_mime::$mimes[$ext] as $row) {
         $allowed_mime[] = $row;
      }
   }

   return $allowed_mime;
}

function isClientMimeTypeAllowed($client_mime, $allowed_mime)
{
   return in_array($client_mime, $allowed_mime);
}

function isFileSizeAllowed($file, $max_upload)
{
   return $max_upload >= (float) $file->getSizeByUnit('mb');
}

function isUploadedFileValid($upload_path, $getRandomName, $allowed_mime)
{
   $filePath = $upload_path . '/' . $getRandomName;
   if (file_exists($filePath)) {
      $info = new File($filePath);
      return in_array($info->getMimeType(), $allowed_mime);
   }
   return false;
}
