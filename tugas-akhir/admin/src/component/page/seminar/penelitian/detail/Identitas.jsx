import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const Identitas = () => {
   const { module } = useSelector((e) => e.redux);
   const { identitas } = module;

   return (
      <React.Fragment>
         <Row>
            <Col>
               {h.detail_label("NIM", h.parse("nim", identitas))}
               {h.detail_label("Nama", h.parse("nama", identitas))}
               {h.detail_label("Periode", h.periode(h.parse("periode", identitas)))}
               {h.detail_label("Program Studi", h.parse("program_studi", identitas))}
            </Col>
            <Col>
               {h.detail_label("Angkatan", h.parse("angkatan", identitas))}
               {h.detail_label("Email", h.parse("email", identitas))}
               {h.detail_label("HP", h.parse("hp", identitas))}
            </Col>
         </Row>
         <Row>
            <Col>{h.detail_label("Judul Penelitian", h.parse("judul_penelitian", identitas))}</Col>
         </Row>
      </React.Fragment>
   );
};
export default Identitas;
