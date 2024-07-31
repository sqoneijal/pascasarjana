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
            {h.form_text(`Cari ${document.title}`, "search", { onKeyDown: (e) => e.code === "Enter" && h.handleSearchDatatable(e.target.value) })}
         </Col>
         <Col md={9} xs={12}>
            <Row className="d-flex justify-content-end">
               <Col md={3} sm={12}>
                  {h.form_select(
                     "Role",
                     "role",
                     {
                        onChange: (e) => dispatch(applyFilter({ url: "/getdata", data: { ...filter, role: e.target.value } })),
                        value: h.parse("role", filter),
                     },
                     [
                        { value: 1, label: "Administrator" },
                        { value: 2, label: "Akademik" },
                        { value: 3, label: "Dosen" },
                        { value: 4, label: "Mahasiswa" },
                     ]
                  )}
               </Col>
            </Row>
         </Col>
      </Row>
   );
};
export default Filter;
