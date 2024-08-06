<?php

namespace Config\Routing;

use CodeIgniter\Config\Routing;
use CodeIgniter\Router\RouteCollection;

class Mahasiswa extends Routing
{
   public function route(RouteCollection $routes): void
   {
      $routes->group('mahasiswa', ['namespace' => 'App\Controllers\Mahasiswa', 'filter' => 'Islogin'], function ($routes) {
         $this->dashboard($routes);
         $this->profile($routes);
      });
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

   private function dashboard(RouteCollection $routes): void
   {
      $routes->get('/', 'Home::index');

      $routes->post('getdaftarlampiran', 'Home::getDaftarLampiran');
      $routes->post('uploadlampiran', 'Home::uploadLampiran');
      $routes->post('submitdaftarproposal', 'Home::submitDaftarProposal');
      $routes->post('submitdaftarulangproposal', 'Home::submitDaftarUlangProposal');
      $routes->post('submittelahseminar', 'Home::submitTelahSeminar');
      $routes->post('submitpenentuansk', 'Home::submitPenentuanSK');
      $routes->post('getdetailseminarproposal', 'Home::getDetailSeminarProposal');
      $routes->post('submitdaftarseminarproposal', 'Home::submitDaftarSeminarProposal');
      $routes->post('submitsudahseminarproposal', 'Home::submitSudahSeminarProposal');
      $routes->post('updatestatustugasakhir', 'Home::updateStatusTugasAkhir');
      $routes->post('getdetailseminarpenelitian', 'Home::getDetailSeminarPenelitian');
      $routes->post('uploadlampiranpenelitian', 'Home::uploadLampiranPenelitian');
      $routes->post('getdetailmunaqasyah', 'Home::getDetailMunaqasyah');
      $routes->post('updatejudulproposal', 'Home::updateJudulProposal');
   }
}
