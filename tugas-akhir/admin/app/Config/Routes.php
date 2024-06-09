<?php

use CodeIgniter\Router\RouteCollection;

$routes->group('login', function ($routes) {
   $routes->get('logout', 'Login::logout');
   $routes->get('init', 'Login::init');
   $routes->get('(:any)', 'Login::index/$1');
});

sidang($routes);
function sidang(RouteCollection $routes): void
{
   $routes->group('sidang', ['filter' => 'IsLogin'], function ($routes) {
      $routes->get('/', 'Sidang::index');
      $routes->get('initpage', 'Sidang::initPage');

      $routes->post('getdata', 'Sidang::getData');
      $routes->post('getdetailsidang', 'Sidang::getDetailSidang');
      $routes->post('submitjadwalsidang', 'Sidang::submitJadwalSidang');
      $routes->post('submittimpenguji', 'Sidang::submitTimPenguji');
      $routes->post('caridosen', 'Sidang::cariDosen');
      $routes->post('hapuspenguji', 'Sidang::hapusPenguji');
   });
}

profile($routes);
function profile(RouteCollection $routes): void
{
   $routes->group('profile', ['filter' => 'IsLogin'], function ($routes) {
      $routes->get('/', 'Profile::index');

      $routes->post('submit', 'Profile::submit');
      $routes->post('gantiavatar', 'Profile::gantiAvatar');
      $routes->post('getloginsession', 'Profile::getLoginSession');
      $routes->post('getakseslogs', 'Profile::getAksesLogs');
   });
}

pengaturan($routes);
function pengaturan(RouteCollection $routes): void
{
   $routes->group('pengaturan', ['namespace' => 'App\Controllers\Pengaturan', 'filter' => 'IsLogin'], function ($routes) {
      pengaturanLampiran($routes);
      pengaturanPeriode($routes);
   });
}

function pengaturanPeriode(RouteCollection $routes): void
{
   $routes->group('periode', function ($routes) {
      $routes->get('/', 'Periode::index');

      $routes->post('submit', 'Periode::submit');
      $routes->post('getdata', 'Periode::getData');
      $routes->post('hapus', 'Periode::hapus');
   });
}

function pengaturanLampiran(RouteCollection $routes): void
{
   $routes->group('lampiran', function ($routes) {
      $routes->get('/', 'Lampiran::index');
      $routes->get('initpage', 'Lampiran::initPage');

      $routes->post('submit', 'Lampiran::submit');
   });
}

seminar($routes);
function seminar(RouteCollection $routes): void
{
   $routes->group('seminar', ['namespace' => 'App\Controllers\Seminar', 'filter' => 'IsLogin'], function ($routes) {
      seminarProposal($routes);
      seminarPenelitian($routes);
   });
}

function seminarPenelitian(RouteCollection $routes): void
{
   $routes->group('penelitian', function ($routes) {
      $routes->get('/', 'Penelitian::index');
      $routes->get('initpage', 'Penelitian::initPage');

      $routes->post('getdata', 'Penelitian::getData');
      $routes->post('getdetail', 'Penelitian::getDetail');
      $routes->post('submitjadwalseminar', 'Penelitian::submitJadwalSeminar');
      $routes->post('submitpenguji', 'Penelitian::submitPenguji');
      $routes->post('caridosen', 'Penelitian::cariDosen');
      $routes->post('hapuspenguji', 'Penelitian::hapusPenguji');
   });
}

function seminarProposal(RouteCollection $routes): void
{
   $routes->group('proposal', function ($routes) {
      $routes->get('/', 'Proposal::index');
      $routes->get('initpage', 'Proposal::initPage');

      $routes->post('getdata', 'Proposal::getData');
      $routes->post('getdetail', 'Proposal::getDetail');
      $routes->post('submitpenetapansk', 'Proposal::submitPenetapanSK');
      $routes->post('hapuspembimbing', 'Proposal::hapusPembimbingPenelitian');
      $routes->post('submitpembimbing', 'Proposal::submitPembimbingPenelitian');
      $routes->post('caridosen', 'Proposal::cariDosen');
   });
}

verifikasi($routes);
function verifikasi(RouteCollection $routes): void
{
   $routes->group('verifikasi', ['namespace' => 'App\Controllers\Verifikasi', 'filter' => 'IsLogin'], function ($routes) {
      verifikasiProposal($routes);
      verifikasiPerbaikan($routes);
      verifikasiDiterima($routes);
   });
}

function verifikasiDiterima(RouteCollection $routes): void
{
   $routes->group('diterima', function ($routes) {
      $routes->get('/', 'Diterima::index');
      $routes->get('initpage', 'Diterima::initPage');

      $routes->post('getdata', 'Diterima::getData');
      $routes->post('getdetail', 'Diterima::getDetail');
      $routes->post('caridosen', 'Diterima::cariDosen');
      $routes->post('submittimpembimbing', 'Diterima::submitTimPembimbing');
      $routes->post('hapuspembimbing', 'Diterima::hapusPembimbing');
      $routes->post('submitjadwalseminar', 'Diterima::submitJadwalSeminar');
   });
}

function verifikasiPerbaikan(RouteCollection $routes): void
{
   $routes->group('perbaikan', function ($routes) {
      $routes->get('/', 'Perbaikan::index');
      $routes->get('initpage', 'Perbaikan::initPage');

      $routes->post('getdata', 'Perbaikan::getData');
      $routes->post('getdetail', 'Perbaikan::getDetail');
      $routes->post('submitchangevalidstatus', 'Perbaikan::submitChangeValidStatus');
      $routes->post('submit', 'Perbaikan::submit');
   });
}

function verifikasiProposal(RouteCollection $routes): void
{
   $routes->group('proposal', function ($routes) {
      $routes->get('/', 'Proposal::index');
      $routes->get('initpage', 'Proposal::initPage');

      $routes->post('getdata', 'Proposal::getData');
      $routes->post('getdetail', 'Proposal::getDetail');
      $routes->post('submitchangevalidstatus', 'Proposal::submitChangeValidStatus');
      $routes->post('submit', 'Proposal::submit');
   });
}

dashboard($routes);
function dashboard(RouteCollection $routes): void
{
   $routes->get('/', 'Dashboard::index', ['filter' => 'IsLogin']);
   $routes->group('/', ['filter' => 'IsLogin'], function ($routes) {
      $routes->get('initpage', 'Dashboard::initPage');
   });
}

pengguna($routes);
function pengguna(RouteCollection $routes): void
{
   $routes->group('pengguna', ['filter' => 'IsLogin'], function ($routes) {
      $routes->get('/', 'Pengguna::index');

      $routes->post('getdata', 'Pengguna::getData');
      $routes->post('submit', 'Pengguna::submit');
      $routes->post('hapus', 'Pengguna::hapus');
      $routes->post('caridosen', 'Pengguna::cariDosen');
      $routes->post('carimahasiswa', 'Pengguna::cariMahasiswa');
   });
}
