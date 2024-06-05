import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const DaftarPembimbing = () => {
   const { module } = useSelector((e) => e.redux);
   const { pembimbing } = module;

   const renderStatus = (row) => {
      if (h.parse("boleh_sidang", row)) {
         if (h.parse("boleh_sidang", row) === "t") {
            return <i className="ki-outline ki-like fs-4 fw-bold text-success m-2" />;
         } else if (h.parse("boleh_sidang", row) === "f") {
            return <i className="ki-outline ki-dislike fs-4 fw-bold text-danger m-2" />;
         }
      }
   };

   return (
      <React.Fragment>
         <h4>Tim Pembimbing</h4>
         <Each
            of={pembimbing}
            render={(row, index) => (
               <Row className={index === pembimbing.length - 1 ? "mb-5" : ""}>
                  <Col md={2} sm={12}>
                     {h.detail_label(
                        "Pembimbing Ke",
                        <span>
                           {h.parse("pembimbing_ke", row)}
                           {renderStatus(row)}
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
