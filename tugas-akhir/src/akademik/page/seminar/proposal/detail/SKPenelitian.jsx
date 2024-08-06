import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const SKPenelitian = () => {
   const { module } = useSelector((e) => e.redux);
   const { skPenelitian } = module;

   const jenisAnggota = (key) => {
      const array = {
         P: "Personal",
         K: "Kelompok",
      };
      return h.parse(key, array);
   };

   const programMBKM = (key) => {
      const array = {
         F: "Flagship",
         M: "Mandiri",
      };
      return h.parse(key, array);
   };

   return (
      <React.Fragment>
         <Row>
            <Col>{h.detail_label("Nomor SK Tugas", h.parse("nomor_sk_tugas", skPenelitian))}</Col>
            <Col>{h.detail_label("Tanggal SK Tugas", h.parse("tanggal_sk_tugas", skPenelitian, "date"))}</Col>
            <Col>
               {h.detail_label(
                  "Jenis Anggota",
                  h.parse("untuk_kampus_merdeka", skPenelitian)
                     ? `${h.parse("jenis_aktivitas", skPenelitian)} (Kampus Merdeka)`
                     : h.parse("jenis_aktivitas", skPenelitian)
               )}
            </Col>
         </Row>
         <Row>
            <Col>{h.detail_label("Jenis Aktivitas", jenisAnggota(h.parse("jenis_aktivitas", skPenelitian)))}</Col>
            {h.parse("untuk_kampus_merdeka", skPenelitian) === "t" && (
               <Col>{h.detail_label("Program MBKM", programMBKM(h.parse("program_mbkm", skPenelitian)))}</Col>
            )}
            <Col md={2} sm={12}>
               {h.detail_label("Tanggal Mulai", h.parse("tanggal_mulai", skPenelitian, "date"))}
            </Col>
            <Col md={2} sm={12}>
               {h.detail_label("Tanggal Akhir", h.parse("tanggal_akhir", skPenelitian, "date"))}
            </Col>
         </Row>
         {h.detail_label("Judul Penelitian", h.parse("judul", skPenelitian))}
         {h.detail_label("Lokasi Penelitian", h.parse("lokasi", skPenelitian))}
         {h.detail_label("Keterangan", h.parse("keterangan", skPenelitian))}
      </React.Fragment>
   );
};
export default SKPenelitian;
