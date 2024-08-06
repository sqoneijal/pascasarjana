import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const StatusTugasAkhir = () => {
   const { module } = useSelector((e) => e.redux);
   const { statusTugasAkhir } = module;

   return (
      <React.Fragment>
         <Row>
            <Col>
               {h.detail_label("NIM", h.parse("nim", statusTugasAkhir))}
               {h.detail_label("Nama", h.parse("nama", statusTugasAkhir))}
               {h.detail_label("Periode", h.periode(h.parse("semester", statusTugasAkhir)))}
               {h.detail_label("Program Studi", h.parse("program_studi", statusTugasAkhir))}
            </Col>
            <Col>
               {h.detail_label("Angkatan", h.parse("angkatan", statusTugasAkhir))}
               {h.detail_label("Email", h.parse("email", statusTugasAkhir))}
               {h.detail_label("HP", h.parse("hp", statusTugasAkhir))}
            </Col>
         </Row>
         <Row>
            <Row>
               <Col>
                  {h.detail_label("Judul Proposal 1", h.parse("judul_proposal_1", statusTugasAkhir))}
                  {h.detail_label("Judul Proposal 2", h.parse("judul_proposal_2", statusTugasAkhir))}
               </Col>
               <Col>{h.detail_label("Judul Proposal 3", h.parse("judul_proposal_3", statusTugasAkhir))}</Col>
            </Row>
         </Row>
      </React.Fragment>
   );
};
export default StatusTugasAkhir;
