import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const DaftarPembimbingPenelitian = React.lazy(() => import("./DaftarPembimbingPenelitian"));

const SKPenelitian = () => {
   const { module } = useSelector((e) => e.redux);
   const { penelitian } = module;

   const mbkm = {
      1: "Flagship",
      2: "Mandiri",
   };

   const kampusMerdeka = (key) => {
      return key === "t" ? " (Kampus Merdeka)" : "";
   };

   return (
      <React.Fragment>
         <Row>
            <Col md={3} sm={12}>
               {h.detail_label("Semester", h.periode(h.parse("semester", penelitian)))}
            </Col>
            <Col>
               {h.detail_label(
                  "Jenis Aktivitas",
                  `${h.parse("jenis_aktivitas", penelitian)}${kampusMerdeka(h.parse("untuk_kampus_merdeka", penelitian))}`
               )}
            </Col>
            {h.parse("untuk_kampus_merdeka", penelitian) === "t" && (
               <Col md={2} sm={12}>
                  {h.detail_label("Program MBKM", mbkm[h.parse("program_mbkm", penelitian)])}
               </Col>
            )}
         </Row>
         <Row>
            <Col>{h.detail_label("Nomor SK Tugas", h.parse("nomor_sk_tugas", penelitian))}</Col>
            <Col>{h.detail_label("Tanggal SK Tugas", h.parse("tanggal_sk_tugas", penelitian, "date"))}</Col>
            <Col>{h.detail_label("Tanggal Mulai", h.parse("tanggal_mulai", penelitian, "date"))}</Col>
            <Col>{h.detail_label("Tanggal Akhir", h.parse("tanggal_akhir", penelitian, "date"))}</Col>
         </Row>
         {h.detail_label("Judul", h.parse("judul", penelitian))}
         {h.detail_label("Keterangan", h.parse("keterangan", penelitian))}
         {h.detail_label("Lokasi", h.parse("lokasi", penelitian))}
         <DaftarPembimbingPenelitian />
      </React.Fragment>
   );
};
export default SKPenelitian;
