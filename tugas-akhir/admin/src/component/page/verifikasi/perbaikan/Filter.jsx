import React from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { applyFilter } from "~/redux";

const Filter = () => {
   const { filter, module } = useSelector((e) => e.redux);
   const { daftarAngkatan, daftarProdi, daftarPeriode } = module;
   const dispatch = useDispatch();

   return (
      <Row className="d-flex flex-stack flex-wrap mb-5">
         <Col md={3} xs={12} className="align-items-center position-relative">
            {h.form_text(`Cari ${document.title}`, "search", { onKeyDown: (e) => e.code === "Enter" && h.handleSearchDatatable(e.target.value) })}
         </Col>
         <Col md={9} xs={12}>
            <Row className="d-flex justify-content-end">
               <Col>
                  {h.form_select(
                     "Program Studi",
                     "id_prodi",
                     {
                        onChange: (e) => dispatch(applyFilter({ url: "/getdata", data: { ...filter, id_prodi: e.target.value } })),
                        value: h.parse("id_prodi", filter),
                     },
                     daftarProdi.map((row) => ({ value: h.parse("id_feeder", row), label: h.parse("nama", row) }))
                  )}
               </Col>
               <Col md={2} sm={12}>
                  {h.form_select(
                     "Angkatan",
                     "angkatan",
                     {
                        onChange: (e) => dispatch(applyFilter({ url: "/getdata", data: { ...filter, angkatan: e.target.value } })),
                        value: h.parse("angkatan", filter),
                     },
                     daftarAngkatan.map((row) => ({ value: row, label: row }))
                  )}
               </Col>
               <Col md={2} sm={12}>
                  {h.form_select(
                     "Periode",
                     "id_periode",
                     {
                        onChange: (e) => dispatch(applyFilter({ url: "/getdata", data: { ...filter, id_periode: e.target.value } })),
                        value: h.parse("id_periode", filter),
                     },
                     daftarPeriode.map((row) => ({ value: h.parse("id", row), label: h.periode(h.parse("periode", row)) }))
                  )}
               </Col>
            </Row>
         </Col>
      </Row>
   );
};
export default Filter;
