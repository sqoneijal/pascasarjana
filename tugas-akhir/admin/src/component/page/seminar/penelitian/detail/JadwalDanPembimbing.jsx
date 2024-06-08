import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const JadwalDanPembimbing = () => {
   const { module } = useSelector((e) => e.redux);
   const { jadwalSeminar, pembimbing } = module;

   return (
      <React.Fragment>
         <Row>
            <Col>{h.detail_label("Tanggal Seminar", h.parse("tanggal_seminar", jadwalSeminar, "date"))}</Col>
            <Col>{h.detail_label("Jam Seminar", h.parse("jam_seminar", jadwalSeminar, "jam"))}</Col>
         </Row>
         <Each
            of={pembimbing}
            render={(row) => (
               <Row>
                  <Col md={2} sm={12}>
                     {h.detail_label("Pembimbing Ke", h.parse("pembimbing_ke", row))}
                  </Col>
                  <Col md={4} sm={12}>
                     {h.detail_label("Dosen", `${h.parse("nidn", row)} - ${h.parse("nama_dosen", row)}`)}
                  </Col>
                  <Col>{h.detail_label("Kategori Kegiatan", h.parse("kategori_kegiatan", row))}</Col>
               </Row>
            )}
         />
      </React.Fragment>
   );
};
export default JadwalDanPembimbing;
