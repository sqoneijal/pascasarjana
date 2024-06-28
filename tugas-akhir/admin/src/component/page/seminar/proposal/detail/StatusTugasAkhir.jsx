import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const StatusTugasAkhir = () => {
   const { module } = useSelector((e) => e.redux);
   const { status_tugas_akhir } = module;

   return (
      <React.Fragment>
         <Row>
            <Col>
               {h.detail_label("NIM", h.parse("nim", status_tugas_akhir))}
               {h.detail_label("Nama", h.parse("nama", status_tugas_akhir))}
               {h.detail_label("Periode", h.periode(h.parse("semester", status_tugas_akhir)))}
               {h.detail_label("Program Studi", h.parse("program_studi", status_tugas_akhir))}
            </Col>
            <Col>
               {h.detail_label("Angkatan", h.parse("angkatan", status_tugas_akhir))}
               {h.detail_label("Email", h.parse("email", status_tugas_akhir))}
               {h.detail_label("HP", h.parse("hp", status_tugas_akhir))}
            </Col>
         </Row>
         <Row>
            <Row>
               <Col>
                  {h.detail_label("Judul Proposal 1", h.parse("judul_proposal_1", status_tugas_akhir))}
                  {h.detail_label("Judul Proposal 2", h.parse("judul_proposal_2", status_tugas_akhir))}
               </Col>
               <Col>
                  {h.detail_label("Judul Proposal 3", h.parse("judul_proposal_3", status_tugas_akhir))}
                  {h.detail_label("Judul Proposal Disetujui", h.parse("judul_proposal_final", status_tugas_akhir))}
               </Col>
            </Row>
         </Row>
      </React.Fragment>
   );
};
export default StatusTugasAkhir;
