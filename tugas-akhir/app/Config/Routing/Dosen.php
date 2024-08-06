<?php

namespace Config\Routing;

use CodeIgniter\Config\Routing;
use CodeIgniter\Router\RouteCollection;

class Dosen extends Routing
{
   public function route(RouteCollection $routes): void
   {
      $routes->group('dosen', ['namespace' => 'App\Controllers\Dosen', 'filter' => 'Islogin'], function ($routes) {
         $this->dashboard($routes);
         $this->profile($routes);
         $this->proposal($routes);
         $this->penelitian($routes, ['namespace' => 'App\Controllers\Dosen\Penelitian', 'filter' => 'Islogin']);
         $this->sidangMunaqasyah($routes, ['namespace' => 'App\Controllers\Dosen\SidangMunaqasyah', 'filter' => 'Islogin']);
      });
   }

   private function sidangMunaqasyah(RouteCollection $routes, array $opt): void
   {
      $routes->group('sidangmunaqasyah', $opt, function ($routes) {
         $this->sidangMunaqasyahPembimbing($routes);
         $this->sidangMunaqasyahPenguji($routes);
      });
   }

   private function sidangMunaqasyahPembimbing(RouteCollection $routes): void
   {
      $routes->group('pembimbing', function ($routes) {
         $routes->get('/', 'Pembimbing::index');

         $routes->post('getdata', 'Pembimbing::getData');
         $routes->post('getdetail', 'Pembimbing::getDetail');
         $routes->post('submitlanjutsidang', 'Pembimbing::submitLanjutSidang');
         $routes->post('submitperbaikisidang', 'Pembimbing::submitPerbaikiSidang');
         $routes->post('submitsudahsidang', 'Pembimbing::submitSudahSidang');
      });
   }

   private function sidangMunaqasyahPenguji(RouteCollection $routes): void
   {
      $routes->group('penguji', function ($routes) {
         $routes->get('/', 'Penguji::index');

         $routes->post('getdata', 'Penguji::getData');
         $routes->post('getdetail', 'Penguji::getDetail');
         $routes->post('submitsudahmelaksanakansidang', 'Penguji::submitSudahMelaksanakanSidang');
         $routes->post('submitperbaikihasilsidang', 'Penguji::submitPerbaikiHasilSidang');
      });
   }

   private function penelitian(RouteCollection $routes, array $opt): void
   {
      $routes->group('penelitian', $opt, function ($routes) {
         $this->penelitianPembimbing($routes);
         $this->penelitianPenguji($routes);
      });
   }

   private function penelitianPembimbing(RouteCollection $routes): void
   {
      $routes->group('pembimbing', function ($routes) {
         $routes->get('/', 'Pembimbing::index');

         $routes->post('getdata', 'Pembimbing::getData');
         $routes->post('getdetail', 'Pembimbing::getDetail');
         $routes->post('submit', 'Pembimbing::submit');
      });
   }

   private function penelitianPenguji(RouteCollection $routes): void
   {
      $routes->group('penguji', function ($routes) {
         $routes->get('/', 'Penguji::index');

         $routes->post('getdata', 'Penguji::getData');
         $routes->post('getdetail', 'Penguji::getDetail');
         $routes->post('submittelahseminar', 'Penguji::submitTelahSeminar');
         $routes->post('submitperbaikihasilseminar', 'Penguji::submitPerbaikiHasilSeminar');
      });
   }

   private function proposal(RouteCollection $routes): void
   {
      $routes->group('proposal', function ($routes) {
         $routes->get('/', 'Proposal::index');

         $routes->post('getdata', 'Proposal::getData');
         $routes->post('getdetail', 'Proposal::getDetail');
         $routes->post('submitperbaiki', 'Proposal::submitPerbaiki');
         $routes->post('submitsudahseminar', 'Proposal::submitSudahSeminar');
         $routes->post('updatestatustesis', 'Proposal::updateStatusTesis');
      });
   }

   private function dashboard(RouteCollection $routes): void
   {
      $routes->get('/', 'Dashboard::index');

      $routes->post('initpage', 'Dashboard::initPage');
   }

   private function profile(RouteCollection $routes): void
   {
      $routes->group('profile', function ($routes) {
         $routes->get('/', 'Profile::index');
         $routes->get('avatar', 'Profile::avatar');

         $routes->post('submit', 'Profile::submit');
         $routes->post('gantiavatar', 'Profile::gantiAvatar');
         $routes->post('getloginsession', 'Profile::getLoginSession');
         $routes->post('getakseslogs', 'Profile::getAksesLogs');
      });
   }
}
