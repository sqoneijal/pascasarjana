#!/bin/bash

export PGPASSWORD="KQYsG4Hi201ajyEzOSGzr4MVfw=="

psql -h pps-db-master -U postgres -d tugas_akhir <<EOF

CREATE USER replicator WITH PASSWORD 'KQYsG4Hi201ajyEzOSGzr4MVfw==';

CREATE TABLE if not exists tb_akses_logs (
	id serial4 NOT NULL,
	id_users int4 NULL,
	"method" varchar NULL,
	pathname varchar NULL,
	"time" timestamptz NULL,
	CONSTRAINT tb_akses_logs_pk PRIMARY KEY (id)
);
CREATE INDEX if not exists tb_akses_logs_id_users_idx ON public.tb_akses_logs USING btree (id_users);

CREATE TABLE if not exists tb_catatan_konsultasi (
	id serial4 NOT NULL,
	id_parent int4 NULL,
	jenis_konsultasi varchar NULL,
	catatan varchar NULL,
	uploaded timestamptz NULL,
	user_modified varchar NULL,
	CONSTRAINT tb_catatan_konsultasi_pk PRIMARY KEY (id)
);
CREATE INDEX if not exists tb_catatan_konsultasi_id_parent_idx ON public.tb_catatan_konsultasi USING btree (id_parent);

CREATE TABLE if not exists tb_jadwal_seminar (
	id serial4 NOT NULL,
	id_status_tugas_akhir int4 NULL,
	tanggal_seminar date NULL,
	jam_seminar time NULL,
	uploaded timestamptz NULL,
	modified timestamptz NULL,
	user_modified varchar NULL,
	CONSTRAINT tb_jadwal_pk PRIMARY KEY (id),
	CONSTRAINT tb_jadwal_unique_id_status_tugas_akhir UNIQUE (id_status_tugas_akhir)
);
CREATE INDEX if not exists tb_jadwal_id_periode_idx ON public.tb_jadwal_seminar USING btree (id_status_tugas_akhir);
CREATE INDEX if not exists tb_jadwal_id_status_tugas_akhir_idx ON public.tb_jadwal_seminar USING btree (id_status_tugas_akhir);

CREATE TABLE if not exists tb_jadwal_sidang (
	id serial4 NOT NULL,
	id_status_tugas_akhir int4 NULL,
	tanggal date NULL,
	jam time NULL,
	uploaded timestamptz NULL,
	modified timestamptz NULL,
	user_modified varchar NULL,
	CONSTRAINT tb_jadwal_sidang_pk PRIMARY KEY (id)
);
CREATE INDEX if not exists tb_jadwal_sidang_id_status_tugas_akhir_idx ON public.tb_jadwal_sidang USING btree (id_status_tugas_akhir);

CREATE TABLE if not exists tb_kategori_kegiatan (
	id serial4 NOT NULL,
	nama varchar NULL,
	CONSTRAINT tb_kategori_kegiatan_pk PRIMARY KEY (id)
);

INSERT INTO tb_kategori_kegiatan (id, nama) VALUES
(110104, 'Lektor/Lektor Kepala/Profesor dengan beban mengajar 2 sks berikutnya'),
(110502, 'Anggota penguji'),
(110102, 'Asisten Ahli dengan beban mengajar 2 sks berikutnya'),
(110501, 'Ketua penguji'),
(110200, 'Membimbing seminar mahasiswa'),
(110400, 'Membimbing dan ikut membimbing dalam menghasilkan disertasi, tesis, skripsi dan laporan akhir studi yang sesuai dengan bidang tugasnya'),
(110107, 'Melakukan pemeriksaan luar dengan pembimbingan terhadap peserta pendidikan dokter'),
(110108, 'Melakukan pemeriksaan dalam dengan pembimbingan terhadap peserta pendidikan dokter'),
(111003, 'Ketua Sekolah Tinggi/Ketua Lembaga/ Wakil Dekan/Wakil Direktur Pascasarjana/Ketua Senat Fakultas'),
(110403, 'Skripsi (pembimbing utama)'),
(110406, 'Tesis (pembimbing pendamping)'),
(110407, 'Skripsi (pembimbing pendamping)'),
(110106, 'Melakukan pengajaran konsultasi spesialis kepada peserta pendidikan dokter'),
(110109, 'Menjadi saksi ahli dengan pembimbingan terhadap peserta pendidikan dokter'),
(110402, 'Tesis (pembimbing utama)'),
(110101, 'Asisten Ahli dengan beban mengajar 10 sks pertama'),
(110404, 'Laporan/tugas akhir studi (pembimbing utama)'),
(110408, 'Laporan akhir studi (pembimbing pendamping)'),
(110401, 'Disertasi (pembimbing utama)'),
(110405, 'Disertasi (pembimbing pendamping)'),
(110500, 'Bertugas sebagai penguji pada ujian akhir/profesi'),
(110600, 'Membina kegiatan mahasiswa di bidang akademik dan kemahasiswaan, termasuk dalam kegiatan ini adalah membimbing mahasiswa menghasilkan produk saintifik, membimbing mahasiswa mengikuti kompetisi di bidang akademik dan kemahasiswaan'),
(110103, 'Lektor/Lektor Kepala/Profesor dengan beban mengajar 10 sks pertama'),
(111007, 'Pembantu direktur akademi/ketua jurusan/ketua prodi pada universitas/politeknik/akademi, sekretaris jurusan/bagian pada universitas/institut/sekolah tinggi'),
(111102, 'Pembimbing Reguler'),
(110801, 'Buku Ajar (cetak atau elektronik)'),
(111302, 'Lamanya 641-960 jam'),
(111005, 'Wakil Direktur Akademi/Sekretaris Lembaga/ Ketua Jurusan/ Departemen/Bagian/Program studi'),
(111306, 'Lamanya 31-80 jam'),
(111002, 'Kepala LLDIKTI/ Direktur Politeknik/Wakil Rektor/Dekan/Direktur Pascasarjana/Ketua Senat Universitas'),
(111001, 'Rektor'),
(111300, 'Melakukan kegiatan pengembangan diri untuk meningkatkan kompetensi/memperoleh sertifikasi profesi'),
(111100, 'Membimbing dosen yang lebih rendah jabatannya'),
(111304, 'Lamanya 161-480 jam'),
(111201, 'Detasering Dosen berkegiatan pada institusi Qs 100'),
(111006, 'Kepala Laboratorium/Sekretaris Jurusan/Departemen/Bagian'),
(111101, 'Pembimbing pencangkokan'),
(111200, 'Melaksanakan kegiatan Detasering dan Pencangkokan di luar institusi'),
(111301, 'Lamanya lebih dari 960 jam'),
(111004, 'Wakil Ketua Sekolah Tinggi/Wakil Direktur Politeknik/Direktur Akademi'),
(111008, 'Sekretaris jurusan pada politeknik/akademi dan kepala laboratorium (bengkel) universitas/institut/sekolah tinggi/politeknik/akademi'),
(111303, 'Lamanya 481-640 jam'),
(111000, 'Menduduki jabatan perguruan tinggi'),
(111307, 'Lamanya 10-30 jam'),
(111305, 'Lamanya 81-160 jam'),
(111400, 'Pendampingan, pembimbingan, mentoring mahasiswa secara terstruktur menghasilkan diantaranya: karya inovatif, karya teknologi yang bermanfaat bagi kesejahteraan masyarakat dan industri; proyek kewirausahaan; startup/usaha rintisan; magang industri; bina de'),
(110900, 'Melakukan kegiatan orasi ilmiah pada perguruan tinggi'),
(111202, 'Detasering Dosen berkegiatan pada institusi nasional'),
(110150, 'Kegiatan pelaksanaan pendidikan untuk pendidikan dokter klinis'),
(110151, 'Melakukan pengajaran untuk peserta pendidikan dokter melalui tindakan medik spesialistik'),
(110152, 'Melakukan pengajaran Konsultasi spesialis kepada peserta pendidikan dokter, melakukan pemeriksaan luar dengan pembimbingan terhadap peserta pendidikan dokter'),
(110153, 'Melakukan pemeriksaan dalam dengan pembimbingan terhadap peserta pendidikan dokter'),
(110154, 'Menjadi saksi ahli dengan pembimbingan terhadap peserta pendidikan dokter'),
(110601, 'Melakukan pembinaan kegiatan mahasiswa di bidang akademik (PA) dan kemahasiswaan (BEM, Maperwa, dan lain-lain)'),
(110602, 'Membimbing mahasiswa menghasilkan produk saintifik bereputasi dan mendapat pengakuan tingkat Internasional'),
(110603, 'Membimbing mahasiswa menghasilkan produk saintifik bereputasi dan mendapat pengakuan tingkat Nasional'),
(110604, 'Membimbing mahasiswa mengikuti kompetisi dibidang akademik dan kemahasiswaan bereputasi dan mencapai juara tingkat Internasional'),
(110605, 'Membimbing mahasiswa mengikuti kompetisi dibidang akademik dan kemahasiswaan bereputasi dan mencapai juara tingkat Nasional'),
(110803, 'mengembangkan bahan pengajaran/modul/ bahan kuliah yang mempunyai nilai kebaharuan/manual/ pedoman akademik/pedoman pemagangan/pedoman pembelajaran dalam bentuk case study/problem based learning/project based learning'),
(110802, 'Diktat, modul, petunjuk praktikum, model, alat bantu, audio visual, naskah tutorial'),
(110800, 'Mengembangkan bahan kuliah'),
(111204, 'Pencangkokan Dosen berkegiatan pada institusi nasional'),
(110804, 'Mengembangkan bahan pengajaran/modul/ bahan kuliah yang mempunyai nilai kebaharuan/manual/ pedoman akademik/pedoman pemagangan/pedoman pembelajaran'),
(111308, 'Memperoleh sertifikasi profesi Bereputasi tingkat Internasional'),
(111309, 'Memperoleh sertifikasi profesi Bereputasi tingkat Nasional'),
(111203, 'Pencangkokan Dosen berkegiatan pada institusi Qs 100'),
(110700, 'Melakukan kegiatan pengembangan program kuliah tatap muka/daring (RPS, perangkat pembelajaran)'),
(110300, 'Membimbing Kuliah Kerja Nyata, Praktek Kerja Nyata, Praktek Kerja Lapangan, termasuk membimbing pelatihan militer mahasiswa, pertukaran mahasiswa, Magang, kuliah berbasis penelitian, wirausaha, dan bentuk lain pengabdian kepada masyarakat, dan sejenisnya'),
(110100, 'melaksanakan perkuliahan (pengajaran, tutorial, tatap muka, dan/atau daring) dalam rangka melaksanakan metode pembelajaran student centered learning (seperti problembased learning atau project basedlearning), membimbing/menguji dalam menghasilkan disertas'),
(110105, 'Melakukan pengajaran untuk peserta pendidikan dokter melalui tindakan medik spesialistik')
on conflict (id) do nothing;

ALTER SEQUENCE tb_kategori_kegiatan_id_seq RESTART WITH 111401;

CREATE TABLE if not exists tb_keterangan_approve_lampiran (
	id serial4 NOT NULL,
	id_lampiran int4 NULL,
	permohonan_proposal varchar NULL,
	slip_spp varchar NULL,
	sinopsis_disertasi varchar NULL,
	persetujuan_penasehat varchar NULL,
	transkrip_nilai varchar NULL,
	buku_kegiatan_akademik varchar NULL,
	review_jurnal varchar NULL,
	slip_seminar varchar NULL,
	CONSTRAINT tb_keterangan_approve_lampiran_pk PRIMARY KEY (id),
	CONSTRAINT tb_keterangan_approve_lampiran_unique_id_lampiran UNIQUE (id_lampiran)
);

CREATE TABLE if not exists tb_lampiran (
	id serial4 NOT NULL,
	id_status_tugas_akhir int4 NULL,
	permohonan_proposal varchar NULL,
	slip_spp varchar NULL,
	slip_seminar varchar NULL,
	sinopsis_disertasi varchar NULL,
	persetujuan_penasehat varchar NULL,
	transkrip_nilai varchar NULL,
	buku_kegiatan_akademik varchar NULL,
	review_jurnal varchar NULL,
	CONSTRAINT tb_lampiran_pk PRIMARY KEY (id),
	CONSTRAINT tb_lampiran_unique_id_status_tugas_akhir UNIQUE (id_status_tugas_akhir)
);
CREATE INDEX if not exists tb_lampiran_id_status_tugas_akhir_idx ON public.tb_lampiran USING btree (id_status_tugas_akhir);

CREATE TABLE if not exists tb_lampiran_seminar_penelitian (
	id serial4 NOT NULL,
	id_status_tugas_akhir int4 NULL,
	permohonan varchar NULL,
	sk_pembimbing varchar NULL,
	surat_pengantar varchar NULL,
	slip_spp varchar NULL,
	slip_seminar varchar NULL,
	transkrip varchar NULL,
	tesis varchar NULL,
	CONSTRAINT tb_lampiran_seminar_penelitian_pk PRIMARY KEY (id)
);
CREATE INDEX if not exists tb_lampiran_seminar_penelitian_id_status_tugas_akhir_idx ON public.tb_lampiran_seminar_penelitian USING btree (id_status_tugas_akhir);

CREATE TABLE if not exists tb_lampiran_upload (
	id serial4 NOT NULL,
	nim varchar NULL,
	id_syarat int4 NULL,
	lampiran varchar NULL,
	"valid" bool NULL,
	keterangan varchar NULL,
	uploaded timestamptz NULL,
	modified timestamptz NULL,
	CONSTRAINT tb_lampiran_upload_pk PRIMARY KEY (id),
	CONSTRAINT unique_nim_idsyarat UNIQUE (nim, id_syarat)
);
CREATE INDEX if not exists tb_lampiran_upload_id_syarat_idx ON public.tb_lampiran_upload USING btree (id_syarat);
CREATE INDEX if not exists tb_lampiran_upload_nim_idx ON public.tb_lampiran_upload USING btree (nim);

CREATE TABLE if not exists tb_login_logs (
	id serial4 NOT NULL,
	id_users int4 NULL,
	last_login timestamptz NULL,
	ip_address inet NULL,
	city varchar NULL,
	region varchar NULL,
	countryname varchar NULL,
	continentname varchar NULL,
	latitude numeric NULL,
	longitude numeric NULL,
	timezone varchar NULL,
	device varchar NULL,
	CONSTRAINT tb_login_logs_pk PRIMARY KEY (id)
);
CREATE INDEX if not exists tb_login_logs_id_users_idx ON public.tb_login_logs USING btree (id_users);

CREATE TABLE if not exists tb_mst_jenis_aktivitas (
	id serial4 NOT NULL,
	nama varchar NULL,
	untuk_kampus_merdeka bool DEFAULT false NULL,
	CONSTRAINT tb_mst_jenis_aktivitas_pk PRIMARY KEY (id)
);

INSERT INTO tb_mst_jenis_aktivitas (id, nama, untuk_kampus_merdeka) VALUES
(7, 'Bimbingan akademis', false),
(3, 'Tesis', true),
(1, 'Laporan akhir studi', true),
(10, 'Aktivitas kemahasiswaan', false),
(4, 'Disertasi', true),
(11, 'Program kreativitas mahasiswa', false),
(12, 'Kompetisi', false),
(6, 'Kerja praktek/PKL', true),
(13, 'Magang/Praktik Kerja', true),
(14, 'Asistensi Mengajar di Satuan Pendidikan', true),
(15, 'Penelitian/Riset', true),
(16, 'Proyek Kemanusiaan', true),
(17, 'Kegiatan Wirausaha', true),
(18, 'Studi/Proyek Independen', true),
(19, 'Membangun Desa/Kuliah Kerja Nyata Tematik', true),
(20, 'Bela Negara', true),
(22, 'Skripsi', true),
(2, 'Tugas akhir', true),
(21, 'Pertukaran Pelajar', true),
(5, 'Kuliah kerja nyata', true),
(23, 'Kegiatan Penelitian Reguler', true)
on conflict (id) do nothing;

ALTER SEQUENCE tb_mst_jenis_aktivitas_id_seq RESTART WITH 24;

CREATE TABLE if not exists tb_mst_syarat (
	id serial4 NOT NULL,
	nama varchar NULL,
	wajib bool DEFAULT true NULL,
	syarat varchar(1) NULL,
	CONSTRAINT tb_mst_syarat_pk PRIMARY KEY (id)
);

INSERT INTO tb_mst_syarat (id, nama, wajib, syarat) VALUES
(1, 'Permohonan Kepada Direktur Pascasarjana UIN Ar-Raniry', true, 1),
(2, 'Slip Setoran SPP yang Sedang Berjalan', true, 1),
(3, 'Slip Setoran Seminar Proposal', true, 1),
(4, 'Sinopsi Disertasi sesuai Ketentuan Yang Berlaku sebanyak 6 Eksamplar', true, 1),
(5, 'Persetujuan Penasehat Akademik / Ka.Prodi', true, 1),
(6, 'Transkrip Nilai', true, 1),
(7, 'Buku Kegiatan Akademik (Pengecekan Kehadiran pada Seminar Sinopsis yang Berlaku)', true, 1),
(8, 'Review Jurnal sebanyak 5 Review Jurnal', true, 1)
on conflict (id) do nothing;

ALTER SEQUENCE tb_mst_syarat_id_seq RESTART WITH 9;

CREATE TABLE if not exists tb_munaqasyah (
	id serial4 NOT NULL,
	id_status_tugas_akhir int4 NULL,
	surat_permohonan varchar NULL,
	sk_pembimbing varchar NULL,
	surat_pengantar varchar NULL,
	nilai_ujian varchar NULL,
	lembar_persetujuan varchar NULL,
	transkrip varchar NULL,
	persetujuan_pembimbing varchar NULL,
	slip_spp varchar NULL,
	artikel_ilmiah varchar NULL,
	slip_yudisium varchar NULL,
	abstrak varchar NULL,
	turnitin varchar NULL,
	hki varchar NULL,
	CONSTRAINT tb_munaqasyah_pk PRIMARY KEY (id)
);
CREATE INDEX if not exists tb_munaqasyah_id_status_tugas_akhir_idx ON public.tb_munaqasyah USING btree (id_status_tugas_akhir);

CREATE TABLE if not exists tb_pembimbing_penelitian (
	id serial4 NOT NULL,
	id_penelitian int4 NULL,
	apakah_dosen_uin bool DEFAULT true NULL,
	pembimbing_ke numeric NULL,
	id_kategori_kegiatan int4 NULL,
	nidn varchar NULL,
	nama_dosen varchar NULL,
	uploaded timestamptz NULL,
	modified timestamptz NULL,
	user_modified varchar NULL,
	seminar_penelitian bool DEFAULT false NULL,
	boleh_seminar bool NULL,
	boleh_sidang bool NULL,
	CONSTRAINT tb_pembimbing_penelitian_pk PRIMARY KEY (id)
);
CREATE INDEX if not exists tb_pembimbing_penelitian_id_kategori_kegiatan_idx ON public.tb_pembimbing_penelitian USING btree (id_kategori_kegiatan);
CREATE INDEX if not exists tb_pembimbing_penelitian_id_penelitian_idx ON public.tb_pembimbing_penelitian USING btree (id_penelitian);

CREATE TABLE if not exists tb_pembimbing_seminar (
	id serial4 NOT NULL,
	id_status_tugas_akhir int4 NULL,
	pembimbing_ke numeric NULL,
	id_kategori_kegiatan int4 NULL,
	uploaded timestamptz NULL,
	modified timestamptz NULL,
	user_modified varchar NULL,
	nidn varchar NULL,
	nama_dosen varchar NULL,
	sudah_seminar bool NULL,
	keterangan_perbaikan varchar NULL,
	apakah_dosen_uin bool DEFAULT true NULL,
	CONSTRAINT tb_pembimbing_pk PRIMARY KEY (id),
	CONSTRAINT tb_pembimbing_unique_pembimbing UNIQUE (id_status_tugas_akhir, pembimbing_ke, nidn)
);
CREATE INDEX if not exists tb_pembimbing_id_kategori_kegiatan_idx ON public.tb_pembimbing_seminar USING btree (id_kategori_kegiatan);
CREATE INDEX if not exists tb_pembimbing_id_status_tugas_akhir_idx ON public.tb_pembimbing_seminar USING btree (id_status_tugas_akhir);

CREATE TABLE if not exists tb_pembimbing_tesis (
	id serial4 NOT NULL,
	id_status_tugas_akhir int4 NULL,
	pembimbing_ke numeric NULL,
	id_kategori_kegiatan int4 NULL,
	uploaded timestamptz NULL,
	modified timestamptz NULL,
	user_modified varchar NULL,
	nidn varchar NULL,
	nama_dosen varchar NULL,
	sudah_sidang bool NULL,
	keterangan_perbaikan varchar NULL,
	CONSTRAINT tb_pembimbing_tesis_pk PRIMARY KEY (id)
);
CREATE INDEX if not exists tb_pembimbing_tesis_id_kategori_kegiatan_idx ON public.tb_pembimbing_tesis USING btree (id_kategori_kegiatan);
CREATE INDEX if not exists tb_pembimbing_tesis_id_status_tugas_akhir_idx ON public.tb_pembimbing_tesis USING btree (id_status_tugas_akhir);

CREATE TABLE if not exists tb_penelitian (
	id serial4 NOT NULL,
	id_status_tugas_akhir int4 NULL,
	id_periode int4 NULL,
	judul varchar NULL,
	user_modified varchar NULL,
	uploaded timestamptz NULL,
	modified timestamptz NULL,
	nomor_sk_tugas varchar NULL,
	tanggal_sk_tugas date NULL,
	id_jenis_aktivitas int4 NULL,
	keterangan varchar NULL,
	lokasi varchar NULL,
	tanggal_mulai date NULL,
	tanggal_akhir date NULL,
	program_mbkm varchar NULL,
	CONSTRAINT tb_penelitian_pk PRIMARY KEY (id)
);
CREATE INDEX if not exists tb_penelitian_id_jenis_aktivitas_idx ON public.tb_penelitian USING btree (id_jenis_aktivitas);
CREATE INDEX if not exists tb_penelitian_id_periode_idx ON public.tb_penelitian USING btree (id_periode);
CREATE INDEX if not exists tb_penelitian_id_status_tugas_akhir_idx ON public.tb_penelitian USING btree (id_status_tugas_akhir);

CREATE TABLE if not exists tb_pengaturan (
	id serial4 NOT NULL,
	template_permohonan varchar NULL,
	template_pengesahan varchar NULL,
	CONSTRAINT tb_pengaturan_pk PRIMARY KEY (id)
);

CREATE TABLE if not exists tb_penguji_sidang (
	id serial4 NOT NULL,
	id_status_tugas_akhir int4 NULL,
	penguji_ke numeric NULL,
	nidn varchar NULL,
	nama_dosen varchar NULL,
	id_kategori_kegiatan int4 NULL,
	apakah_dosen_uin bool DEFAULT true NULL,
	uploaded timestamptz NULL,
	modified timestamptz NULL,
	user_modified varchar NULL,
	keterangan_perbaikan varchar NULL,
	telah_sidang bool NULL,
	CONSTRAINT tb_penguji_sidang_pk PRIMARY KEY (id)
);
CREATE INDEX if not exists tb_penguji_sidang_id_kategori_kegiatan_idx ON public.tb_penguji_sidang USING btree (id_kategori_kegiatan);
CREATE INDEX if not exists tb_penguji_sidang_id_status_tugas_akhir_idx ON public.tb_penguji_sidang USING btree (id_status_tugas_akhir);

CREATE TABLE if not exists tb_periode (
	id serial4 NOT NULL,
	tahun_ajaran numeric NULL,
	id_semester numeric NULL,
	status bool DEFAULT false NULL,
	user_modified varchar NULL,
	uploaded timestamptz NULL,
	modified timestamptz NULL,
	CONSTRAINT tb_periode_pk PRIMARY KEY (id),
	CONSTRAINT tb_periode_unique_periode UNIQUE (tahun_ajaran, id_semester)
);

insert into tb_periode (id, tahun_ajaran, id_semester, status) values
(1, 2024, 1, true)
on conflict (id) do nothing;

ALTER SEQUENCE tb_periode_id_seq RESTART WITH 2;

CREATE TABLE if not exists tb_prodi (
	id serial4 NOT NULL,
	kode varchar NULL,
	jenjang varchar NULL,
	nama varchar NULL,
	id_feeder uuid NULL,
	CONSTRAINT tb_prodi_pk PRIMARY KEY (id),
	CONSTRAINT tb_prodi_unique_kode UNIQUE (kode)
);

INSERT INTO tb_prodi (id, kode, jenjang, nama, id_feeder) VALUES
(7, '76132', 'S2', 'Ilmu Aqidah', NULL),
(1, '74033', 'S3', 'Fiqh Modern (Hukum Islam)', '8184c16b-cc48-44c0-ba3e-0f06d7fa16e5'),
(2, '86008', 'S3', 'Pendidikan Agama Islam', '2d937ef6-6944-4493-a2f2-7c65d6638755'),
(3, '60102', 'S2', 'Ekonomi Syariah', '5a4e8033-a533-4a48-aab0-60554d636f82'),
(4, '70133', 'S2', 'Komunikasi dan Penyiaran Islam', '31cbdd32-3d1d-4e13-9cb3-0e387756d940'),
(5, '74130', 'S2', 'Hukum Keluarga (Ahwal Al-syakhshiyyah)', '2569f289-e43a-47c5-9443-1a46fe8984ff'),
(6, '76131', 'S2', 'Ilmu Al-Quran dan Tafsir', 'b84be0ca-4c71-47a3-bfe0-f43f398a65ca'),
(8, '86108', 'S2', 'Pendidikan Agama Islam', 'a09f76fd-dcfc-4b1e-b0c4-385d89c938cc'),
(9, '86131', 'S2', 'Ilmu Agama Islam', 'd2d558c0-50a0-4146-aa48-a3a69ba7d6a3'),
(10, '88104', 'S2', 'Pendidikan Bahasa Arab', 'c8d0bde9-2d87-48e9-b4ba-e5b0fa9b3781')
on conflict (id) do nothing;

ALTER SEQUENCE tb_prodi_id_seq RESTART WITH 11;

CREATE TABLE if not exists tb_seminar_penelitian (
	id serial4 NOT NULL,
	id_penelitian int4 NULL,
	tanggal_seminar date NULL,
	jam_seminar time NULL,
	uploaded timestamptz NULL,
	modified timestamptz NULL,
	user_modified varchar NULL,
	CONSTRAINT tb_seminar_penelitian_pk PRIMARY KEY (id)
);
CREATE INDEX if not exists tb_seminar_penelitian_id_penelitian_idx ON public.tb_seminar_penelitian USING btree (id_penelitian);

CREATE TABLE if not exists tb_seminar_penelitian_detail (
	id serial4 NOT NULL,
	id_seminar_penelitian int4 NULL,
	penguji_ke numeric NULL,
	nidn varchar NULL,
	nama_dosen varchar NULL,
	id_kategori_kegiatan int4 NULL,
	apakah_dosen_uin bool DEFAULT true NULL,
	uploaded timestamptz NULL,
	modified timestamptz NULL,
	user_modified varchar NULL,
	lanjut_sidang bool NULL,
	keterangan_perbaikan varchar NULL,
	CONSTRAINT tb_seminar_penelitian_detail_pk PRIMARY KEY (id)
);
CREATE INDEX if not exists tb_seminar_penelitian_detail_id_kategori_kegiatan_idx ON public.tb_seminar_penelitian_detail USING btree (id_kategori_kegiatan);
CREATE INDEX if not exists tb_seminar_penelitian_detail_id_seminar_penelitian_idx ON public.tb_seminar_penelitian_detail USING btree (id_seminar_penelitian);

CREATE TABLE if not exists tb_status_approve_lampiran (
	id serial4 NOT NULL,
	id_lampiran int4 NULL,
	permohonan_proposal bool NULL,
	slip_spp bool NULL,
	sinopsis_disertasi bool NULL,
	persetujuan_penasehat bool NULL,
	transkrip_nilai bool NULL,
	buku_kegiatan_akademik bool NULL,
	review_jurnal bool NULL,
	slip_seminar bool NULL,
	CONSTRAINT tb_status_approve_lampiran_pk PRIMARY KEY (id),
	CONSTRAINT tb_status_approve_lampiran_unique_id_lampiran UNIQUE (id_lampiran)
);
CREATE INDEX if not exists tb_status_approve_lampiran_id_lampiran_idx ON public.tb_status_approve_lampiran USING btree (id_lampiran);

CREATE TABLE if not exists tb_status_tesis (
	id serial4 NOT NULL,
	keterangan varchar NULL,
	short_name varchar NULL,
	CONSTRAINT tb_status_tesis_pk PRIMARY KEY (id)
);

INSERT INTO tb_status_tesis (id, keterangan, short_name) VALUES
(1, 'mahasiswa telah mengajukan seminar proposal, menunggu verifikasi dari akademik', 'Menunggu verifikasi'),
(2, 'menunggu verifikasi dari akademik', NULL),
(3, 'proposal di suruh perbaiki oleh akademik', 'Perbaiki proposal'),
(4, 'mahasiswa telah memperbaiki proposal', 'Telah memperbaiki proposal'),
(5, 'akademik telah menerima proposal mahasiswa. menunggu penentuan jadwal dan tim pembimbing seminar proposal', 'Belum menentukan jadwal tim pembimbing'),
(6, 'akademik telah menentukan jadwal seminar proposal', 'Belum menentukan tim pembimbing seminar'),
(7, 'akademik telah menentukan jadwal dan tim seminar proposal. menunggu hasil seminar proposal', 'Seminar proposal'),
(8, 'mahasiswa menyatakan diri telah melaksanakan seminar proposal. menunggu verifikasi seminar proposal dari tim pembimbing', 'Menunggu verifikasi pembimbing seminar'),
(9, 'tim pembimbing menyatakan ada perbaikan pada proposal', 'Perbaikan proposal'),
(10, 'mahasiswa telah memperbaiki proposal hasil seminar', 'Telah memperbaiki proposal, menunggu verifikasi pembimbing seminar'),
(11, 'tim pembimbing seminar proposal telah menyetujui hasil seminar proposal mahasiswa, dan menunggu penetapan SK penelitian', 'Belum menentukan SK penelitian'),
(12, 'akademik telah membuat SK penelitian, tapi belum menentukan tim pembimbing penelitian', 'Belum menentukan tim pembimbing penelitian'),
(13, 'akademik telah membuat SK penelitian dan telah menentukan tim pembimbing penelitian', 'Sedang penelitian'),
(14, 'mahasiswa mendaftar seminar penelitian. menunggu persetujuan tim pembimbing', 'Mahasiswa mendaftar seminar, menunggu persetujuan pembimbing'),
(15, 'tim pembimbing telah menyetujui seminar penelitian mahasiswa. menunggu penentuan jadwal dan tim pembahas', 'Belum menentukan jadwal dan penguji hasil penelitian'),
(16, 'akademik telah menentukan jadwal seminar penelitian', 'Belum menentukan tim penguji'),
(17, 'akademik telah menentukan jadwal dan tim pembahas seminar penelitian', 'Seminar penelitian'),
(18, 'mahasiswa menyatakan diri telah melaksanakan seminar hasil penelitian. menunggu persetujuan dari tim pembahas', 'Telah seminar, menunggu persetujuan tim penguji'),
(19, 'tim pembahas hasil seminar penelitian menyatakan ada perbaikian hasil penelitian', 'Perbaikan hasil seminar penelitian'),
(20, 'mahasiswa telah memperbaiki hasil penelitian', 'Telah memperbaiki hasil seminar penelitian'),
(21, 'tim pembahas telah menyetujui hasil seminar penelitian mahasiswa.', 'Lanjut ke sidang munaqasyah'),
(22, 'mahasiswa telah mendaftar sidang, menunggu persetujuan dari pembimbing', 'Telah mendaftar sidang, menunggu persetujuan pembimbing'),
(23, 'tim pembimbing telah menyetujui untuk melaksanakan sidang munaqasyah', 'Belum menentukan jadwal dan penguji'),
(24, 'akademik telah menentukan jadwal sidang, tapi belum menentukan tim penguji', 'Belum menentukan tim penguji'),
(25, 'akademik telah mementukan jadwal dan penguji sidang munaqasyah', 'Sidang munaqasyah'),
(26, 'mahasiswa menyatakan diri telah melaksanakan sidang munaqasyah', 'Menunggu persetujuan penguji'),
(27, 'tim pembimbing menyatakan ada perbaikan pada tesis/disertasi', 'Perbaiki tesis/disertasi'),
(28, 'mahasiswa telah memperbaiki tesis/disertasi dari sidang munaqasyah', 'Sudah memperbaiki tesis/disertasi'),
(29, 'telah menyelesaikan sidang munaqasyah', 'Yudisium')
on conflict (id) do nothing;

ALTER SEQUENCE tb_status_tesis_id_seq RESTART WITH 30;

CREATE TABLE if not exists tb_status_tugas_akhir (
	id serial4 NOT NULL,
	nim varchar NULL,
	id_periode int4 NULL,
	kode_prodi varchar NULL,
	nama varchar NULL,
	angkatan numeric NULL,
	nidn_penasehat varchar NULL,
	uploaded timestamptz NULL,
	modified timestamptz NULL,
	email varchar NULL,
	hp varchar NULL,
	user_modified varchar NULL,
	status int4 NULL,
	judul_proposal varchar NULL,
	CONSTRAINT tb_status_tugas_akhir_pk PRIMARY KEY (id),
	CONSTRAINT tb_status_tugas_akhir_unique_periode UNIQUE (nim, id_periode)
);
CREATE INDEX if not exists tb_status_tugas_akhir_id_periode_idx ON public.tb_status_tugas_akhir USING btree (id_periode);
CREATE INDEX if not exists tb_status_tugas_akhir_kode_prodi_idx ON public.tb_status_tugas_akhir USING btree (kode_prodi);
CREATE INDEX if not exists tb_status_tugas_akhir_nim_idx ON public.tb_status_tugas_akhir USING btree (nim);
CREATE INDEX if not exists tb_status_tugas_akhir_status_idx ON public.tb_status_tugas_akhir USING btree (status);
CREATE INDEX if not exists tb_status_tugas_akhir_user_modified_idx ON public.tb_status_tugas_akhir USING btree (user_modified);

CREATE TABLE if not exists tb_users (
	id serial4 NOT NULL,
	avatar varchar DEFAULT 'avatar-placeholder.png'::character varying NULL,
	nama varchar NULL,
	username varchar NULL,
	email varchar NULL,
	"role" varchar NULL,
	"password" varchar NULL,
	uploaded timestamptz NULL,
	modified timestamptz NULL,
	user_modified varchar NULL,
	CONSTRAINT tb_users_pk PRIMARY KEY (id),
	CONSTRAINT tb_users_unique_email UNIQUE (email),
	CONSTRAINT tb_users_unique_username UNIQUE (username)
);

INSERT INTO tb_users (id, avatar, nama, username, email, role, uploaded, modified, user_modified) VALUES
(1, 'avatar-placeholder.png', 'Akademik', 'akademik', 'akademik@ar-raniry.ac.id', 2, NULL, '2024-05-05 21:01:09.115+0700', NULL)
on conflict (id) do nothing;

ALTER SEQUENCE tb_users_id_seq RESTART WITH 2;

create trigger after_insert_jadwal after
insert
    on
    public.tb_jadwal_seminar for each row execute function after_insert_jadwal();

create trigger after_insert_lampiran after
insert
    on
    public.tb_lampiran for each row execute function after_insert_lampiran();
create trigger after_delete_lampiran after
delete
    on
    public.tb_lampiran for each row execute function after_delete_lampiran();

create trigger after_insert_status_tugas_akhir after
insert
    on
    public.tb_status_tugas_akhir for each row execute function after_insert_status_tugas_akhir();
create trigger after_delete_tugas_akhir after
delete
    on
    public.tb_status_tugas_akhir for each row execute function after_delete_tugas_akhir();

EOF