import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const DaftarTimPembahas = () => {
   const { module } = useSelector((e) => e.redux);
   const { timPembahasHasilPenelitian } = module;

   const renderStatusLanjutSidang = (row) => {
      if (h.parse("lanjut_sidang", row)) {
         if (h.parse("lanjut_sidang", row) === "t") {
            return <i className="ki-outline ki-like fs-4 fw-bold text-success m-2" />;
         } else if (h.parse("lanjut_sidang", row) === "f") {
            return <i className="ki-outline ki-dislike fs-4 fw-bold text-danger m-2" />;
         }
      }
   };

   return (
      <React.Fragment>
         <h4>Tim Pembahas Hasil Penelitian</h4>
         <Each
            of={timPembahasHasilPenelitian}
            render={(row, index) => (
               <Row className={index === timPembahasHasilPenelitian.length - 1 ? "mb-5" : ""}>
                  <Col md={2} sm={12}>
                     {h.detail_label(
                        "Penguji Ke",
                        <span>
                           {h.parse("penguji_ke", row)}
                           {renderStatusLanjutSidang(row)}
                        </span>
                     )}
                  </Col>
                  <Col md={3} sm={12}>
                     {h.detail_label("Dosen", `${h.parse("nidn", row)} - ${h.parse("nama_dosen", row)}`)}
                  </Col>
                  <Col md={7} sm={12}>
                     {h.detail_label("Kategori Kegiatan", h.parse("kategori_kegiatan", row))}
                  </Col>
                  {h.parse("lanjut_sidang", row) === "f" && <Col className="text-danger">{h.parse("keterangan_perbaikan", row)}</Col>}
               </Row>
            )}
         />
      </React.Fragment>
   );
};
export default DaftarTimPembahas;
