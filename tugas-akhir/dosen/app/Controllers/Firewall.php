<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class Firewall extends BaseController
{
   public function panel()
   {
      $panel = new \Shieldon\Firewall\Panel();
      $panel->csrf([csrf_token() => csrf_hash()]);
      $panel->entry();
   }
}
