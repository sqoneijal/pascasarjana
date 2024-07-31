import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const JadwalDanPembimbingSeminarProposal = () => {
   const { module } = useSelector((e) => e.redux);
   const { jadwalSeminarProposal, pembimbingSeminarProposal } = module;

   const renderStatusSudahSeminar = (row) => {
      if (h.parse("sudah_seminar", row)) {
         if (h.parse("sudah_seminar", row) === "t") {
            return <i className="ki-outline ki-like fs-4 fw-bold text-success m-2" />;
         } else if (h.parse("sudah_seminar", row) === "f") {
            return <i className="ki-outline ki-dislike fs-4 fw-bold text-danger m-2" />;
         }
      }
   };

   return (
      <React.Fragment>
         <Row className="mb-5">
            <Col>{h.detail_label("Tanggal Seminar Proposal", h.parse("tanggal_seminar", jadwalSeminarProposal, "date"))}</Col>
            <Col>{h.detail_label("Jam Seminar Proposal", h.parse("jam_seminar", jadwalSeminarProposal, "jam"))}</Col>
         </Row>
         <h4>Tim Pembimbing</h4>
         <Each
            of={pembimbingSeminarProposal}
            render={(row) => (
               <React.Fragment>
                  <Row className="mb-5">
                     <Col md={2} sm={12}>
                        {h.detail_label(
                           "Pembimbing Ke",
                           <span>
                              {h.parse("pembimbing_ke", row)}
                              {renderStatusSudahSeminar(row)}
                           </span>
                        )}
                     </Col>
                     <Col md={3} sm={12}>
                        {h.detail_label("Dosen", `${h.parse("nidn", row)} - ${h.parse("nama_dosen", row)}`)}
                     </Col>
                     <Col>{h.detail_label("Kategori Kegiatan", h.parse("kategori_kegiatan", row))}</Col>
                  </Row>
                  {h.parse("keterangan_perbaikan", row) && h.parse("sudah_seminar", row) === "f" && (
                     <Row>
                        <Col className="text-danger fs-4">{h.parse("keterangan_perbaikan", row)}</Col>
                     </Row>
                  )}
               </React.Fragment>
            )}
         />
      </React.Fragment>
   );
};
export default JadwalDanPembimbingSeminarProposal;
