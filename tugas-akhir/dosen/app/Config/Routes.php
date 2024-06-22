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
