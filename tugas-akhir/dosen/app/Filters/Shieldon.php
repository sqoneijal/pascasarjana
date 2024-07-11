<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Shieldon\Firewall\Firewall;
use Shieldon\Firewall\HttpResolver;
use Shieldon\Firewall\Captcha\Csrf;
use function csrf_token;
use function csrf_hash;

class Shieldon implements FilterInterface
{

   protected $panelUri;

   protected $storage;

   public function __construct(string $storage = '', string $panelUri = '')
   {
      $this->storage = WRITEPATH . 'shieldon_firewall';
      $this->panelUri = '/firewall/panel';

      if ('' !== $storage) {
         $this->storage = $storage;
      }

      if ('' !== $panelUri) {
         $this->panelUri = $panelUri;
      }
   }

   public function before(RequestInterface $request, $arguments = null)
   {
      if ($request->isCLI()) {
         return;
      }

      $firewall = new Firewall();
      $firewall->configure($this->storage);
      $firewall->controlPanel($this->panelUri);

      $firewall->getKernel()->setCaptcha(
         new Csrf([
            'name' => csrf_token(),
            'value' => csrf_hash(),
         ])
      );

      $response = $firewall->run();

      if ($response->getStatusCode() !== 200) {
         $httpResolver = new HttpResolver();
         $httpResolver($response);
      }
   }

   /**
    * Allows After filters to inspect and modify the response
    * object as needed. This method does not allow any way
    * to stop execution of other after filters, short of
    * throwing an Exception or Error.
    *
    * @param RequestInterface  $request
    * @param ResponseInterface $response
    * @param array|null        $arguments
    *
    * @return ResponseInterface|void
    */
   public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
   {
      //
   }
}
