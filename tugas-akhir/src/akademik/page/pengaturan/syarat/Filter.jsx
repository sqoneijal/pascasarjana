import React from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { applyFilter } from "~/redux";

const Filter = () => {
   const { filter } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   return (
      <Row className="d-flex flex-stack flex-wrap mb-5">
         <Col md={3} xs={12} className="align-items-center position-relative">
            {h.form_text(`Cari...`, "search", { onKeyDown: (e) => e.code === "Enter" && h.handleSearchDatatable(e.target.value) })}
         </Col>
         <Col md={9} xs={12}>
            <Row className="d-flex justify-content-end">
               <Col md={3} sm={12}>
                  {h.form_select(
                     "Jenis",
                     "syarat",
                     {
                        onChange: (e) => dispatch(applyFilter({ url: "/getdata", data: { ...filter, syarat: e.target.value } })),
                        value: h.parse("syarat", filter),
                     },
                     [
                        { value: 1, label: "Seminar Proposal" },
                        { value: 2, label: "Seminar Hasil Penelitian" },
                        { value: 3, label: "Sidang Munaqasyah" },
                     ]
                  )}
               </Col>
            </Row>
         </Col>
      </Row>
   );
};
export default Filter;
