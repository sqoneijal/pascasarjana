import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const DaftarTimPembahasPenelitian = React.lazy(() => import("./DaftarTimPembahasPenelitian"));

const JadwalSeminarPenelitian = () => {
   const { module } = useSelector((e) => e.redux);
   const { jadwalSeminarPenelitian } = module;

   return (
      <React.Fragment>
         <Row>
            <Col>{h.detail_label("Tanggal Seminar", h.parse("tanggal_seminar", jadwalSeminarPenelitian, "date"))}</Col>
            <Col>{h.detail_label("Jam Seminar", h.parse("jam_seminar", jadwalSeminarPenelitian, "jam"))}</Col>
         </Row>
         <DaftarTimPembahasPenelitian />
      </React.Fragment>
   );
};
export default JadwalSeminarPenelitian;
