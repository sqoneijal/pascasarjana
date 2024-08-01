import React from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { applyFilter } from "~/redux";

const Filter = () => {
   const { filter, init } = useSelector((e) => e.redux);
   const { daftar_periode } = init;
   const dispatch = useDispatch();

   return (
      <Row className="d-flex flex-stack flex-wrap mb-5">
         <Col md={3} xs={12} className="align-items-center position-relative">
            {h.form_text(`Cari...`, "search", { onKeyDown: (e) => e.code === "Enter" && h.handleSearchDatatable(e.target.value) })}
         </Col>
         <Col md={9} xs={12}>
            <Row className="d-flex justify-content-end">
               <Col md={2} sm={12}>
                  {h.form_select(
                     "Periode",
                     "id_periode",
                     {
                        onChange: (e) => dispatch(applyFilter({ url: "/getdata", data: { ...filter, id_periode: e.target.value } })),
                        value: h.parse("id_periode", filter),
                     },
                     daftar_periode.map((row) => ({ value: h.parse("id", row), label: h.periode(h.parse("periode", row)) }))
                  )}
               </Col>
            </Row>
         </Col>
      </Row>
   );
};
export default Filter;
