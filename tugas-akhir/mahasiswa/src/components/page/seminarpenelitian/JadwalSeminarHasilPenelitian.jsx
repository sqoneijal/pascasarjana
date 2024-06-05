import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const JadwalSeminarHasilPenelitian = () => {
   const { module } = useSelector((e) => e.redux);
   const { jadwalSeminarPenelitian } = module;

   return (
      <React.Fragment>
         <h4>Jadwal Seminar Hasil Penelitian</h4>
         <Row className="mb-5">
            <Col>{h.detail_label("Tanggal Seminar", h.parse("tanggal_seminar", jadwalSeminarPenelitian, "date"))}</Col>
            <Col>{h.detail_label("Jam Seminar", h.parse("jam_seminar", jadwalSeminarPenelitian, "jam"))}</Col>
         </Row>
      </React.Fragment>
   );
};
export default JadwalSeminarHasilPenelitian;
