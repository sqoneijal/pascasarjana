<?php

use CodeIgniter\Router\RouteCollection;

$routes->get('/', 'Home::index');
$routes->get('init', 'Home::initLogin');
$routes->get('logout', 'Home::logout');

$routes->post('submit', 'Home::submit');

admin($routes);
function admin(RouteCollection $routes): void
{
   $routes->group('admin', ['namespace' => 'App\Controllers\Admin', 'filter' => 'Islogin'], function (RouteCollection $routes) {
      dashboard($routes);
      profile($routes);
      verifikasi($routes);
      seminar($routes);
      sidang($routes);
      pengaturan($routes, ['namespace' => 'App\Controllers\Admin\Pengaturan']);
      pengguna($routes);
   });
}

function pengguna(RouteCollection $routes): void
{
   $routes->group('pengguna', function ($routes) {
      $routes->get('/', 'Pengguna::index');

      $routes->post('getdata', 'Pengguna::getData');
      $routes->post('submit', 'Pengguna::submit');
      $routes->post('hapus', 'Pengguna::hapus');
      $routes->post('caridosen', 'Pengguna::cariDosen');
      $routes->post('carimahasiswa', 'Pengguna::cariMahasiswa');
   });
}

function pengaturan(RouteCollection $routes, array $opt): void
{
   $routes->group('pengaturan', $opt, function ($routes) {
      pengaturanLampiran($routes);
      pengaturanPeriode($routes);
      pengaturanSyarat($routes);
   });
}

function pengaturanSyarat(RouteCollection $routes): void
{
   $routes->group('syarat', function ($routes) {
      $routes->get('/', 'Syarat::index');

      $routes->post('getdata', 'Syarat::getData');
      $routes->post('submit', 'Syarat::submit');
      $routes->post('hapus', 'Syarat::hapus');
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
      $routes->get('getdata', 'Lampiran::getData');

      $routes->post('submit', 'Lampiran::submit');
   });
}

function sidang(RouteCollection $routes): void
{
   $routes->group('sidang', function ($routes) {
      $routes->get('/', 'Sidang::index');
      $routes->get('initpage', 'Sidang::initPage');

      $routes->post('getdata', 'Sidang::getData');
      $routes->post('getdetail', 'Sidang::getDetail');
      $routes->post('submitvalidlampiran', 'Sidang::submitValidLampiran');
      $routes->post('submitnotvalidlampiran', 'Sidang::submitNotValidLampiran');
      $routes->post('submitjadwalsidang', 'Sidang::submitJadwalSidang');
      $routes->post('caridosen', 'Sidang::cariDosen');
      $routes->post('submitpenguji', 'Sidang::submitPenguji');
      $routes->post('hapuspenguji', 'Sidang::hapusPenguji');
   });
}

function seminar(RouteCollection $routes): void
{
   $routes->group('seminar', ['namespace' => 'App\Controllers\Admin\Seminar'], function ($routes) {
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
      $routes->post('submitvalidlampiran', 'Penelitian::submitValidLampiran');
      $routes->post('submittidakvalidlampiran', 'Penelitian::submitTidakValidLampiran');
      $routes->post('submitjadwalseminar', 'Penelitian::submitJadwalSeminar');
      $routes->post('caridosen', 'Penelitian::cariDosen');
      $routes->post('submitpenguji', 'Penelitian::submitPenguji');
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
      $routes->post('submitpenetpansk', 'Proposal::submitPenetapanSK');
      $routes->post('submitpembimbing', 'Proposal::submitPembimbing');
      $routes->post('caridosen', 'Proposal::cariDosen');
      $routes->post('hapuspembimbing', 'Proposal::hapusPembimbing');
   });
}

function dashboard(RouteCollection $routes): void
{
   $routes->get('/', 'Dashboard::index');
   $routes->get('initpage', 'Dashboard::initPage');
}

function profile(RouteCollection $routes): void
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

function verifikasi(RouteCollection $routes): void
{
   $routes->group('verifikasi', ['namespace' => 'App\Controllers\Admin\Verifikasi'], function ($routes) {
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
      $routes->post('submitjadwalseminar', 'Diterima::submitJadwalSeminar');
      $routes->post('submitpembimbing', 'Diterima::submitPembimbing');
      $routes->post('caridosen', 'Diterima::cariDosen');
      $routes->post('hapuspembimbing', 'Diterima::hapusPembimbing');
   });
}

function verifikasiPerbaikan(RouteCollection $routes): void
{
   $routes->group('perbaikan', function ($routes) {
      $routes->get('/', 'Perbaikan::index');
      $routes->get('initpage', 'Perbaikan::initPage');

      $routes->post('getdata', 'Perbaikan::getData');
      $routes->post('getdetail', 'Perbaikan::getDetail');
      $routes->post('submitstatuslampiran', 'Perbaikan::submitStatusLampiran');
      $routes->post('submitstatusproposal', 'Perbaikan::submitStatusProposal');
   });
}

function verifikasiProposal(RouteCollection $routes): void
{
   $routes->group('proposal', function ($routes) {
      $routes->get('/', 'Proposal::index');
      $routes->get('initpage', 'Proposal::initPage');

      $routes->post('getdata', 'Proposal::getData');
      $routes->post('getdetail', 'Proposal::getDetail');
      $routes->post('submitstatuslampiran', 'Proposal::submitStatusLampiran');
      $routes->post('submitstatusproposal', 'Proposal::submitStatusProposal');
   });
}
