import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const JadwalSidang = () => {
   const { module } = useSelector((e) => e.redux);
   const { jadwal_sidang } = module;

   return (
      <Row>
         <Col>{h.detail_label("Tanggal Sidang", h.parse("tanggal", jadwal_sidang, "date"))}</Col>
         <Col>{h.detail_label("Jam Sidang", h.parse("tanggal", jadwal_sidang, "jam"))}</Col>
      </Row>
   );
};
export default JadwalSidang;
