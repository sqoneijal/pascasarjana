<?php

use CodeIgniter\Router\RouteCollection;

profile($routes);
function profile(RouteCollection $routes): void
{
   $routes->group('profile', ['filter' => 'IsLogin'], function ($routes) {
      $routes->get('/', 'Profile::index');

      $routes->post('submit', 'Profile::submit');
   });
}

dashboard($routes);
function dashboard(RouteCollection $routes): void
{
   $routes->get('/', 'Home::index', ['filter' => 'IsLogin']);

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

$routes->group('login', function ($routes) {
   $routes->get('init', 'Login::init');
   $routes->get('logout', 'Login::logout');
   $routes->get('fail', 'Login::perluLoginDulu');
   $routes->get('googleauth', 'Login::googleAuth');
   $routes->get('(:any)', 'Login::index/$1');
});
