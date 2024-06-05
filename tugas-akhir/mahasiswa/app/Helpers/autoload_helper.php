<?php

use CodeIgniter\Files\File;

function arrLength($content = [])
{
   return count($content) > 0 ? true : false;
}

function doUpload($file, $upload_path, $ext_allowed = [])
{
   if (!file_exists($upload_path)) {
      mkdir($upload_path, 0755);
   }

   $max_upload = 20;
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

function cdnUpload(string $token, string $filePath, string $filename, $file, $uploadPath = null)
{
   try {
      $cFile = new \CURLFile($filePath, $file->getClientMimeType(), $filename);

      $postRequest = [
         'file' => $cFile,
         'uploadPath' => $uploadPath
      ];

      $cURL = curl_init('pps-cdn');
      curl_setopt($cURL, CURLOPT_POSTFIELDS, $postRequest);
      curl_setopt($cURL, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($cURL, CURLOPT_HTTPHEADER, [
         'Authorization: Bearer ' . $token
      ]);

      $cResponse = curl_exec($cURL);
      $cError = curl_error($cURL);

      curl_close($cURL);

      if ($cError) {
         $response['status'] = false;
         $response['content'] = $cError;
      } else {
         $cArrayResponse = json_decode($cResponse, true);
         if ($cArrayResponse['status']) {
            $response['status'] = true;
            $response['content'] = $cArrayResponse['content'];
         } else {
            $response['status'] = false;
            $response['content'] = $cArrayResponse['message'];
         }
      }
      return $response;
   } catch (\Exception $e) {
      return $e;
   }
}
