<?php

namespace App\Controllers;

use App\Validation\Home as Validate;
use App\Models\Home as Model;
use PHPMailer\PHPMailer\PHPMailer;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Home extends BaseController
{

   public function index()
   {
      $this->data = [
         'title' => 'Login'
      ];

      return $this->template($this->data);
   }

   public function submitResetPassword(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitResetPassword())) {
         $model = new Model();
         $submit = $model->submitResetPassword($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function validasiTokenLupaPassword(): object
   {
      try {
         $token = $this->post['token'];
         $decoded = (array) JWT::decode($token, new Key(JWT_KEY, 'HS256'));
         return $this->respond(['status' => true, 'data' => $decoded]);
      } catch (\Exception $e) {
         return $this->respond(['status' => false, 'msg_response' => $e->getMessage()]);
      }
   }

   public function submitLupaPassword(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitLupaPassword())) {
         $model = new Model();
         $content = $model->getUserLupaPassword($this->post['email']);

         $mail = new PHPMailer(true);
         try {
            $mail->IsSMTP();
            $mail->Mailer = "smtp";

            $mail->SMTPDebug  = 0;
            $mail->SMTPAuth   = true;
            $mail->SMTPSecure = "tls";
            $mail->Port       = 587;
            $mail->Host       = "smtp.gmail.com";
            $mail->Username   = 'noreplay@ar-raniry.ac.id';
            $mail->Password   = 'jtghfeawxzijdlfw';
            $mail->SMTPKeepAlive = true;
            $mail->IsHTML(true);
            $mail->AddAddress($this->post['email'], 'Testing');
            $mail->SetFrom('noreplay@ar-raniry.ac.id', "Tugas Akhir Pascasarjana");
            $mail->Subject = 'Reset Password';

            $msg = $this->generateEmailContent($content);

            $mail->MsgHTML($msg);

            if (!$mail->Send()) {
               $response['msg_response'] = 'Gagal mengirim email verifikasi, silahkan coba lagi!';
            } else {
               $response['status'] = true;
               $response['msg_response'] = 'Email verifikasi telah dikirim, silahkan cek email anda!';
            }
            $mail->SmtpClose();
         } catch (\Exception $e) {
            $response['msg_response'] = $mail->ErrorInfo;
         }
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   private function generateEmailHeader(): string
   {
      return '<head>
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <meta name="x-apple-disable-message-reformatting" />
         <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
         <meta name="color-scheme" content="light dark" />
         <meta name="supported-color-schemes" content="light dark" />
         <style type="text/css" rel="stylesheet" media="all">
         @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
         ' . file_get_contents(WRITEPATH . 'reset_password.css') . '
         </style>
         <!--[if mso]>
         <style type="text/css">
            .f-fallback  {
            font-family: Arial, sans-serif;
            }
         </style>
      <![endif]-->
      </head>';
   }

   private function generateJWT(array $payload): string
   {
      // Set issued at time and expiration time
      $issuedAt = time();
      $expirationTime = $issuedAt + 3600; // jwt valid for 1 hour from the issued time
      $payload['iat'] = $issuedAt;
      $payload['exp'] = $expirationTime;

      // Encode the payload to get the JWT
      return JWT::encode($payload, JWT_KEY, 'HS256');
   }

   private function generateEmailContent(array $data): string
   {
      unset($data['password']);
      $agent = $this->request->getUserAgent();

      if ($agent->isBrowser()) {
         $currentAgent = $agent->getBrowser() . ' ' . $agent->getVersion();
      } elseif ($agent->isRobot()) {
         $currentAgent = $agent->getRobot();
      } elseif ($agent->isMobile()) {
         $currentAgent = $agent->getMobile();
      } else {
         $currentAgent = 'Unidentified User Agent';
      }

      $jwt = $this->generateJWT($data);
      $linkVerifikasi = site_url('?lupa_password=' . $jwt);

      return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">' . $this->generateEmailHeader() . '
      <body>
         <span class="preheader">Use this link to reset your password. The link is only valid for 24 hours.</span>
         <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
            <td align="center">
               <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                  <td class="email-masthead">
                     <a href="https://caroeng.ar-raniry.ac.id" class="f-fallback email-masthead_name">
                     Tugas Akhir Pascasarjana
                  </a>
                  </td>
                  </tr>
                  <tr>
                  <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                     <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                        <td class="content-cell">
                           <div class="f-fallback">
                              <h1>Hi ' . $data['nama'] . ',</h1>
                              <p>Anda baru saja meminta untuk mereset kata sandi akun Tugas Akhir Pascasarjana Anda. Gunakan tombol di bawah ini untuk meresetnya. <strong>Pengaturan ulang kata sandi ini hanya berlaku untuk 1 jam ke depan.</strong></p>
                              <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                                 <td align="center">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                    <tr>
                                       <td align="center">
                                          <a href="' . $linkVerifikasi . '" class="f-fallback button button--green" target="_blank">Setel ulang kata sandi</a>
                                       </td>
                                    </tr>
                                    </table>
                                 </td>
                              </tr>
                              </table>
                              <p>Demi keamanan, permintaan ini diterima dari perangkat ' . $agent->getPlatform() . ' yang menggunakan ' . $currentAgent . '. Jika Anda tidak meminta pengaturan ulang kata sandi, abaikan email ini.</p>
                              <p>Terima Kasih,<br>Tim Tugas Akhir Pascasarjana</p>
                              <table class="body-sub" role="presentation">
                              <tr>
                                 <td>
                                    <p class="f-fallback sub">Jika Anda mengalami masalah dengan tombol di atas, salin dan tempel URL di bawah ini ke peramban web Anda.</p>
                                    <p class="f-fallback sub">' . $linkVerifikasi . '</p>
                                 </td>
                              </tr>
                              </table>
                           </div>
                        </td>
                        </tr>
                     </table>
                  </td>
                  </tr>
                  <tr>
                  <td>
                     <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                        <td class="content-cell" align="center">
                           <p class="f-fallback sub align-center">
                              Tugas Akhir Pascasarjana
                              <br/>Jl. Syech Abdurrauf, KOPELMA Darussalam, Kec. Syiah Kuala, Kota Banda Aceh
                           </p>
                        </td>
                        </tr>
                     </table>
                  </td>
                  </tr>
               </table>
            </td>
            </tr>
         </table>
      </body>
      </html>';
   }

   public function submitDaftar(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->submitDaftar())) {
         $model = new Model();
         $submit = $model->submitDaftar($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function cariMahasiswa(): object
   {
      $response = ['status' => false, 'errors' => []];

      $validation = new Validate();
      if ($this->validate($validation->cariMahasiswa())) {
         $model = new Model();
         $submit = $model->cariMahasiswa($this->post);

         $response = array_merge($submit, ['errors' => []]);
      } else {
         $response['msg_response'] = 'Tolong periksa kembali inputan anda!';
         $response['errors'] = \Config\Services::validation()->getErrors();
      }
      return $this->respond($response);
   }

   public function initRegister(): object
   {
      $model = new Model();
      $content = [
         'daftarProdi' => $model->getDaftarProdi(),
      ];
      return $this->respond($content);
   }

   public function initLogin(): object
   {
      $model = new Model();
      $data = $model->initLogin();
      return $this->respond($data);
   }

   public function submit()
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

   public function logout()
   {
      $session = \Config\Services::session();
      $session->destroy();
      return redirect()->to('/');
   }
}
