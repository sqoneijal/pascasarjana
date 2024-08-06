<?php

namespace Config\Routing;

use CodeIgniter\Config\Routing;
use CodeIgniter\Router\RouteCollection;

class Akademik extends Routing
{
    public function route(RouteCollection $routes): void
    {
        $routes->group('akademik', ['namespace' => 'App\Controllers\Admin', 'filter' => 'Islogin'], function (RouteCollection $routes) {
            $this->dashboard($routes);
            $this->profile($routes);
            $this->verifikasi($routes, ['namespace' => 'App\Controllers\Admin\Verifikasi']);
            $this->seminar($routes, ['namespace' => 'App\Controllers\Admin\Seminar']);
            $this->sidang($routes);
            $this->pengaturan($routes, ['namespace' => 'App\Controllers\Admin\Pengaturan']);
            $this->pengguna($routes);
        });
    }

    private function pengguna(RouteCollection $routes): void
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

    private function pengaturan(RouteCollection $routes, array $opt): void
    {
        $routes->group('pengaturan', $opt, function ($routes) {
            $this->pengaturanLampiran($routes);
            $this->pengaturanPeriode($routes);
            $this->pengaturanSyarat($routes);
        });
    }

    private function pengaturanSyarat(RouteCollection $routes): void
    {
        $routes->group('syarat', function ($routes) {
            $routes->get('/', 'Syarat::index');

            $routes->post('getdata', 'Syarat::getData');
            $routes->post('submit', 'Syarat::submit');
            $routes->post('hapus', 'Syarat::hapus');
        });
    }

    private function pengaturanPeriode(RouteCollection $routes): void
    {
        $routes->group('periode', function ($routes) {
            $routes->get('/', 'Periode::index');

            $routes->post('submit', 'Periode::submit');
            $routes->post('getdata', 'Periode::getData');
            $routes->post('hapus', 'Periode::hapus');
        });
    }

    private function pengaturanLampiran(RouteCollection $routes): void
    {
        $routes->group('lampiran', function ($routes) {
            $routes->get('/', 'Lampiran::index');
            $routes->get('getdata', 'Lampiran::getData');

            $routes->post('submit', 'Lampiran::submit');
        });
    }

    private function sidang(RouteCollection $routes): void
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

    private function seminar(RouteCollection $routes, array $opt): void
    {
        $routes->group('seminar', $opt, function ($routes) {
            $this->seminarProposal($routes);
            $this->seminarPenelitian($routes);
        });
    }

    private function seminarPenelitian(RouteCollection $routes): void
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

    private function seminarProposal(RouteCollection $routes): void
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


    private function verifikasi(RouteCollection $routes, array $opt): void
    {
        $routes->group('verifikasi', $opt, function ($routes) {
            $this->verifikasiProposal($routes);
            $this->verifikasiPerbaikan($routes);
            $this->verifikasiDiterima($routes);
        });
    }

    private function verifikasiDiterima(RouteCollection $routes): void
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


    private function verifikasiPerbaikan(RouteCollection $routes): void
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


    private function verifikasiProposal(RouteCollection $routes): void
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

    private function dashboard(RouteCollection $routes): void
    {
        $routes->get('/', 'Dashboard::index');
        $routes->get('initpage', 'Dashboard::initPage');
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
