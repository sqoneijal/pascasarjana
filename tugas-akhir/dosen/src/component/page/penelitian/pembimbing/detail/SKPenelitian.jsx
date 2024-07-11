import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const SKPenelitian = () => {
   const { module } = useSelector((e) => e.redux);
   const { sk_penelitian } = module;

   const jenisAnggota = (key) => {
      const obj = {
         P: "Personal",
         K: "Kelompok",
      };
      return h.parse(key, obj);
   };

   const programMBKM = (key) => {
      const obj = {
         F: "Flagship",
         M: "Mandiri",
      };
      return h.parse(key, obj);
   };

   return (
      <React.Fragment>
         <Row>
            <Col>{h.detail_label("Nomor SK Tugas", h.parse("nomor_sk_tugas", sk_penelitian))}</Col>
            <Col>{h.detail_label("Tanggal SK Tugas", h.parse("tanggal_sk_tugas", sk_penelitian, "date"))}</Col>
            <Col>{h.detail_label("Jenis Anggota", jenisAnggota(h.parse("jenis_anggota", sk_penelitian)))}</Col>
            <Col>{h.detail_label("Program MBKM", programMBKM(h.parse("program_mbkm", sk_penelitian)))}</Col>
         </Row>
         <Row>
            <Col md={3} sm={12}>
               {h.detail_label("Jenis Aktivitas", h.parse("jenis_aktivitas", sk_penelitian))}
            </Col>
            <Col>{h.detail_label("Judul Penelitian", h.parse("judul", sk_penelitian))}</Col>
         </Row>
         <Row>
            <Col>{h.detail_label("Lokasi Penelitian", h.parse("lokasi", sk_penelitian))}</Col>
            <Col>{h.detail_label("Keterangan", h.parse("keterangan", sk_penelitian))}</Col>
         </Row>
      </React.Fragment>
   );
};
export default SKPenelitian;
