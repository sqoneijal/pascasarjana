import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const DaftarPenguji = () => {
   const { module } = useSelector((e) => e.redux);
   const { penguji } = module;

   const renderStatus = (row) => {
      if (h.parse("telah_sidang", row)) {
         if (h.parse("telah_sidang", row) === "t") {
            return <i className="ki-outline ki-like fs-4 fw-bold text-success m-2" />;
         } else if (h.parse("telah_sidang", row) === "f") {
            return <i className="ki-outline ki-dislike fs-4 fw-bold text-danger m-2" />;
         }
      }
   };

   return (
      <React.Fragment>
         <h4>Tim Penguji</h4>
         <Each
            of={penguji}
            render={(row, index) => (
               <Row className={index === penguji.length - 1 ? "mb-5" : ""}>
                  <Col md={2} sm={12}>
                     {h.detail_label(
                        "Penguji Ke",
                        <span>
                           {h.parse("penguji_ke", row)}
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
export default DaftarPenguji;
