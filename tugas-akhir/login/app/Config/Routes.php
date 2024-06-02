<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('login', function ($routes) {
   $routes->post('submit', 'Login::submit');
});
