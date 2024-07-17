<?php

use CodeIgniter\Router\RouteCollection;

login($routes);
function login(RouteCollection $routes): void
{
   $routes->group('login', function ($routes) {
      $routes->get('init', 'Login::initLogin');
      $routes->get('logout', 'Login::logout');
      $routes->get('(:any)', 'Login::index/$1');
   });
}

firewall($routes);
function firewall(RouteCollection $routes): void
{
   $routes->group('firewall', ['filter' => 'IsLogin'], function ($routes) {
      $routes->get('panel', 'Firewall::panel');
      $routes->post('panel', 'Firewall::panel');
   });
}

dashboard($routes);
function dashboard(RouteCollection $routes): void
{
   $routes->group('dashboard', ['filter' => 'IsLogin'], function ($routes) {
      $routes->get('/', 'Dashboard::index');
   });
}

proposal($routes);
function proposal(RouteCollection $routes): void
{
   $routes->group('proposal', ['filter' => 'IsLogin'], function ($routes) {
      $routes->get('/', 'Proposal::index');

      $routes->post('getdata', 'Proposal::getData');
      $routes->post('getdetail', 'Proposal::getDetail');
      $routes->post('submitperbaiki', 'Proposal::submitPerbaiki');
      $routes->post('submitsudahseminar', 'Proposal::submitSudahSeminar');
      $routes->post('updatestatustesis', 'Proposal::updateStatusTesis');
   });
}

penelitian($routes);
function penelitian(RouteCollection $routes): void
{
   $routes->group('penelitian', ['filter' => 'IsLogin'], function ($routes) {
      penelitianPembimbing($routes);
      penelitianPenguji($routes);
   });
}

function penelitianPembimbing(RouteCollection $routes): void
{
   $routes->group('pembimbing', ['filter' => 'IsLogin', 'namespace' => 'App\Controllers\Penelitian'], function ($routes) {
      $routes->get('/', 'Pembimbing::index');

      $routes->post('getdata', 'Pembimbing::getData');
      $routes->post('getdetail', 'Pembimbing::getDetail');
      $routes->post('submit', 'Pembimbing::submit');
   });
}

function penelitianPenguji(RouteCollection $routes): void
{
   $routes->group('penguji', ['filter' => 'IsLogin', 'namespace' => 'App\Controllers\Penelitian'], function ($routes) {
      $routes->get('/', 'Penguji::index');

      $routes->post('getdata', 'Penguji::getData');
      $routes->post('getdetail', 'Penguji::getDetail');
      $routes->post('submittelahseminar', 'Penguji::submitTelahSeminar');
      $routes->post('submitperbaikihasilseminar', 'Penguji::submitPerbaikiHasilSeminar');
   });
}

sidangMunaqasyah($routes);
function sidangMunaqasyah(RouteCollection $routes): void
{
   $routes->group('sidangmunaqasyah', ['filter' => 'IsLogin'], function ($routes) {
      sidangMunaqasyahPembimbing($routes);
   });
}

function sidangMunaqasyahPembimbing(RouteCollection $routes): void
{
   $routes->group('pembimbing', ['filter' => 'IsLogin', 'namespace' => 'App\Controllers\SidangMunaqasyah'], function ($routes) {
      $routes->get('/', 'Pembimbing::index');

      $routes->post('getdata', 'Pembimbing::getData');
      $routes->post('getdetail', 'Pembimbing::getDetail');
      $routes->post('submitlanjutsidang', 'Pembimbing::submitLanjutSidang');
      $routes->post('submitperbaikisidang', 'Pembimbing::submitPerbaikiSidang');
      $routes->post('submitsudahsidang', 'Pembimbing::submitSudahSidang');
   });
}
