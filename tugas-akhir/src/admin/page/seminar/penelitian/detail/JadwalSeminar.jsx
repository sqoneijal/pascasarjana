import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const JadwalSeminar = ({ input, setInput, errors }) => {
   const { module } = useSelector((e) => e.redux);
   const { jadwal_seminar } = module;

   return (
      <Row>
         <Col>{h.detail_label("Tanggal Seminar", h.parse("tanggal_seminar", jadwal_seminar, "date"))}</Col>
         <Col>{h.detail_label("Jam Seminar", h.parse("jam_seminar", jadwal_seminar, "jam"))}</Col>
      </Row>
   );
};
export default JadwalSeminar;
