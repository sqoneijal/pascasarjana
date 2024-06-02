<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header("Acess-Control-Allow-Methods: POST");
header("Acess-Control-Allow-Headers: Acess-Control-Allow-Headers,Content-Type,Acess-Control-Allow-Methods, Authorization");

function isValidBearerToken($token)
{
   return 'tugas-akhir' === $token;
}

function isAllowedExtension($fileExtension, $allowedExtensions)
{
   return in_array($fileExtension, $allowedExtensions);
}

function isAllowedMimeType($fileMimeType, $allowedMimeTypes)
{
   return in_array($fileMimeType, $allowedMimeTypes);
}

function isValidFile($file)
{
   $maxFileSize = 2 * 1024 * 1024; // 2MB
   $allowedExtensions = ['png', 'jpg', 'jpeg', 'ico', 'pdf', 'svg', 'gif', 'doc', 'docx'];
   $allowedMimeTypes = [
      'image/png', 'image/x-png', 'image/jpeg', 'image/pjpeg', 'image/x-icon', 'image/x-ico', 'image/vnd.microsoft.icon', 'application/pdf', 'image/svg+xml', 'image/svg', 'application/xml', 'text/xml', 'image/gif', 'application/msword', 'application/vnd.ms-office', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-zip'
   ];

   $fileName = $file['name'];
   $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
   $fileMimeType = mime_content_type($file['tmp_name']);
   $fileSize = $file['size'];

   return $fileSize <= $maxFileSize &&
      isAllowedExtension($fileExtension, $allowedExtensions) &&
      isAllowedMimeType($fileMimeType, $allowedMimeTypes);
}

// Pemeriksaan Bearer Token
$headers = apache_request_headers();
$token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

if (!$token || !isValidBearerToken($token)) {
   http_response_code(200);
   echo json_encode(['status' => false, 'message' => 'Unauthorized.']);
   exit;
}

// Pemeriksaan unggahan file
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file']['name'])) {
   try {
      $uploadDir = 'media/';
      if (isset($_POST['uploadPath'])) {
         $uploadDir = 'media/' . $_POST['uploadPath'] . '/';
         if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
         }
      }

      $file = $_FILES['file'];

      if (isValidFile($file)) {
         $hashedFileName = hash('sha256', $file['name'] . microtime(true));
         $uploadedFileName = $hashedFileName . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
         $uploadPath = $uploadDir . $uploadedFileName;

         if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            // Tambahkan log atau entri basis data jika diperlukan
            echo json_encode(['status' => true, 'message' => 'File berhasil diunggah.', 'content' => $uploadedFileName]);
         } else {
            echo json_encode(['status' => false, 'message' => 'Gagal mengunggah file.']);
         }
      } else {
         echo json_encode(['status' => false, 'message' => 'Ukuran, ekstensi, atau tipe file tidak diizinkan.']);
      }
   } catch (\Exception $e) {
      echo json_encode(['status' => false, 'message' => $e->getMessage()]);
   }
} else {
   echo json_encode(['status' => false, 'message' => 'Metode request tidak valid atau file tidak ditemukan.']);
}
