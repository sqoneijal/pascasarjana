<?php

use Config\Routing\Admin;
use Config\Routing\Mahasiswa;
use Config\Routing\Dosen;
use Config\Routing\Akademik;

$routes = service('routes');

$adminRoutes = new Admin();
$adminRoutes->route($routes);

$akademikRoutes = new Akademik();
$akademikRoutes->route($routes);

$mahasiswaRoutes = new Mahasiswa();
$mahasiswaRoutes->route($routes);

$dosenRoutes = new Dosen();
$dosenRoutes->route($routes);

$routes->get('/', 'Home::index');
$routes->get('init', 'Home::initLogin', ['filter' => 'Islogin']);
$routes->get('logout', 'Home::logout');
$routes->get('initregister', 'Home::initRegister');

$routes->post('submitlupapassword', 'Home::submitLupaPassword');
$routes->post('submit', 'Home::submit');
$routes->post('carimahasiswa', 'Home::cariMahasiswa');
$routes->post('submitdaftar', 'Home::submitDaftar');
$routes->post('validasitokenlupapassword', 'Home::validasiTokenLupaPassword');
$routes->post('submitresetpassword', 'Home::submitResetPassword');
