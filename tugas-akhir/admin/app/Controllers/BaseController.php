<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\CLIRequest;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use CodeIgniter\API\ResponseTrait;

/**
 * Class BaseController
 *
 * BaseController provides a convenient place for loading components
 * and performing functions that are needed by all your controllers.
 * Extend this class in any new controllers:
 *     class Home extends BaseController
 *
 * For security be sure to declare any new methods as protected or private.
 */
abstract class BaseController extends Controller
{

   use ResponseTrait;

   /**
    * Instance of the main Request object.
    *
    * @var CLIRequest|IncomingRequest
    */
   protected $request;

   /**
    * An array of helpers to be loaded automatically upon
    * class instantiation. These helpers will be available
    * to all other controllers that extend BaseController.
    *
    * @var list<string>
    */
   protected $helpers = ['html', 'autoload'];

   public $data;
   public $post;
   public $getVar;

   protected $publish = false;

   /**
    * @return void
    */
   public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
   {
      // Do Not Edit This Line
      parent::initController($request, $response, $logger);

      $this->post = $request->getPost();
      $this->getVar = $request->getVar();
   }

   public function template(array $params): void
   {
      $params['linkTag'] = $this->generateWebpackCss();
      $params['scriptTag'] = $this->generateWebpackJs();

      echo View('Template', $params);
   }

   public function generateWebpackCss(): string
   {
      if (!$this->publish) {
         return '<link href="http://localhost:8081/App.css" rel="stylesheet" type="text/css" nonce="' . NONCE . '" />';
      } else {
         return link_tag(CDN_PATH . 'bundle/tugas-akhir/admin/app.' . HASH_CSS . '.css');
      }
   }

   public function generateWebpackJs(): string
   {
      if (!$this->publish) {
         return '<script src="http://localhost:8081/App.js" nonce="' . NONCE . '"></script>';
      } else {
         return script_tag(['type' => 'module', 'src' => CDN_PATH . 'bundle/tugas-akhir/admin/app.' . HASH_JS . '.js']);
      }
   }
}
