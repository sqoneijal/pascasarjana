<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use CodeIgniter\API\ResponseTrait;

abstract class BaseController extends Controller
{

   use ResponseTrait;

   protected $request;
   protected $helpers = ['html'];

   public $data;
   public $post;
   public $getVar;

   protected $publish = false;

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
         return link_tag('http://localhost:8081/App.css');
      } else {
         return link_tag('bundle/app.' . HASH_CSS . '.css');
      }
   }

   public function generateWebpackJs(): string
   {
      if (!$this->publish) {
         return script_tag('http://localhost:8081/App.js');
      } else {
         return script_tag(['type' => 'module', 'src' => 'bundle/app.' . HASH_JS . '.js']);
      }
   }
}
