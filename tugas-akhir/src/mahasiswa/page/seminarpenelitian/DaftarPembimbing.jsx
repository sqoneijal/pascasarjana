import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const DaftarPembimbing = () => {
   const { module } = useSelector((e) => e.redux);
   const { pembimbingSeminarPenelitian } = module;

   const renderStatusBolehSeminar = (row) => {
      if (h.parse("boleh_seminar", row)) {
         if (h.parse("boleh_seminar", row) === "t") {
            return <i className="ki-outline ki-like fs-4 fw-bold text-success m-2" />;
         } else if (h.parse("boleh_seminar", row) === "f") {
            return <i className="ki-outline ki-dislike fs-4 fw-bold text-danger m-2" />;
         }
      }
   };

   return (
      <React.Fragment>
         <h4>Tim Pembimbing</h4>
         <Each
            of={pembimbingSeminarPenelitian}
            render={(row, index) => (
               <Row className={index === pembimbingSeminarPenelitian.length - 1 ? "mb-5" : ""}>
                  <Col md={2} sm={12}>
                     {h.detail_label(
                        "Pembimbing Ke",
                        <span>
                           {h.parse("pembimbing_ke", row)}
                           {renderStatusBolehSeminar(row)}
                        </span>
                     )}
                  </Col>
                  <Col md={3} sm={12}>
                     {h.detail_label("Dosen", `${h.parse("nidn", row)} - ${h.parse("nama_dosen", row)}`)}
                  </Col>
                  <Col>{h.detail_label("Kategori Kegiatan", h.parse("kategori_kegiatan", row))}</Col>
               </Row>
            )}
         />
      </React.Fragment>
   );
};
export default DaftarPembimbing;
