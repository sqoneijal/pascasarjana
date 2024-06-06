import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const JadwalSidang = () => {
   const { module } = useSelector((e) => e.redux);
   const { jadwalSidang } = module;

   return (
      <Row>
         <Col>{h.detail_label("Tanggal Sidang", h.parse("tanggal", jadwalSidang, "date"))}</Col>
         <Col>{h.detail_label("Tanggal Sidang", h.parse("jam", jadwalSidang, "jam"))}</Col>
      </Row>
   );
};
export default JadwalSidang;
