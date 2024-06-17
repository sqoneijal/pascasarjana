import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const JadwalSeminar = () => {
   const { module } = useSelector((e) => e.redux);
   const { jadwalSeminarProposal } = module;

   return (
      <Row>
         <Col>{h.detail_label("Tanggal Seminar", h.parse("tanggal_seminar", jadwalSeminarProposal, "date"))}</Col>
         <Col>{h.detail_label("Jam Seminar", h.parse("jam_seminar", jadwalSeminarProposal, "jam"))}</Col>
      </Row>
   );
};
export default JadwalSeminar;
