<?php

use CodeIgniter\Router\RouteCollection;

$routes->get('/', 'Home::index');
$routes->get('init', 'Home::initLogin', ['filter' => 'Islogin']);
$routes->get('logout', 'Home::logout');

$routes->post('submit', 'Home::submit');

dosen($routes);
function dosen(RouteCollection $routes): void
{
   $routes->group('dosen', ['namespace' => 'App\Controllers\Dosen', 'filter' => 'Islogin'], function ($routes) {
      dashboardDosen($routes);
      profile($routes);
      dosenProposal($routes);
      dosenPenelitian($routes, ['namespace' => 'App\Controllers\Dosen\Penelitian', 'filter' => 'Islogin']);
      dosenSidangMunaqasyah($routes, ['namespace' => 'App\Controllers\Dosen\SidangMunaqasyah', 'filter' => 'Islogin']);
   });
}

function dosenSidangMunaqasyah(RouteCollection $routes, array $opt): void
{
   $routes->group('sidangmunaqasyah', $opt, function ($routes) {
      dosenSidangMunaqasyahPembimbing($routes);
      dosenSidangMunaqasyahPenguji($routes);
   });
}

function dosenSidangMunaqasyahPembimbing(RouteCollection $routes): void
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

function dosenSidangMunaqasyahPenguji(RouteCollection $routes): void
{
   $routes->group('penguji', function ($routes) {
      $routes->get('/', 'Penguji::index');

      $routes->post('getdata', 'Penguji::getData');
      $routes->post('getdetail', 'Penguji::getDetail');
      $routes->post('submitsudahmelaksanakansidang', 'Penguji::submitSudahMelaksanakanSidang');
      $routes->post('submitperbaikihasilsidang', 'Penguji::submitPerbaikiHasilSidang');
   });
}

function dosenPenelitian(RouteCollection $routes, array $opt): void
{
   $routes->group('penelitian', $opt, function ($routes) {
      dosenPenelitianPembimbing($routes);
      dosenPenelitianPenguji($routes);
   });
}

function dosenPenelitianPembimbing(RouteCollection $routes): void
{
   $routes->group('pembimbing', function ($routes) {
      $routes->get('/', 'Pembimbing::index');

      $routes->post('getdata', 'Pembimbing::getData');
      $routes->post('getdetail', 'Pembimbing::getDetail');
      $routes->post('submit', 'Pembimbing::submit');
   });
}

function dosenPenelitianPenguji(RouteCollection $routes): void
{
   $routes->group('penguji', function ($routes) {
      $routes->get('/', 'Penguji::index');

      $routes->post('getdata', 'Penguji::getData');
      $routes->post('getdetail', 'Penguji::getDetail');
      $routes->post('submittelahseminar', 'Penguji::submitTelahSeminar');
      $routes->post('submitperbaikihasilseminar', 'Penguji::submitPerbaikiHasilSeminar');
   });
}

function dosenProposal(RouteCollection $routes): void
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

function dashboardDosen(RouteCollection $routes): void
{
   $routes->get('/', 'Dashboard::index');

   $routes->post('initpage', 'Dashboard::initPage');
}

mahasiswa($routes);
function mahasiswa(RouteCollection $routes): void
{
   $routes->group('mahasiswa', ['namespace' => 'App\Controllers\Mahasiswa', 'filter' => 'Islogin'], function ($routes) {
      dashboardMahasiswa($routes);
      profile($routes);
   });
}

function dashboardMahasiswa(RouteCollection $routes): void
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
