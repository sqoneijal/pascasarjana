import React, { useLayoutEffect } from "react";
import { Card, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";
import Filter from "./Filter";

let datatable;

const Lists = () => {
   const { filter, module } = useSelector((e) => e.redux);
   const { daftarStatusTesis } = module;
   const dispatch = useDispatch();

   const datatable_url = `/getdata?${h.serialize(filter)}`;
   datatable = h.initDatatable({
      show_edit_button: false,
      show_delete_button: false,
      url: datatable_url,
      columns: [
         {
            data: null,
            render: (data) => {
               return `<button id="nim">${h.parse("nim", data)}</button>`;
            },
         },
         { data: "nama" },
         { data: "angkatan", class: "text-center" },
         { data: "program_studi" },
         {
            data: null,
            render: (data) => {
               return h.renderStatusTesis(h.parse("status", data), daftarStatusTesis);
            },
         },
         { data: "jumlah_pembimbing", class: "text-center" },
      ],
      columnDefs: false,
      createdRow: (row, data) => {
         const nim = row.querySelector("#nim");
         nim.onclick = (e) => {
            e.preventDefault();
            dispatch(setModule({ ...module, openDetail: true, detailContent: data }));
         };
      },
   });

   useLayoutEffect(() => {
      datatable.init();
      return () => {};
   }, []);

   return (
      <Card className="shadow-sm card-bordered">
         <Card.Header>
            <h3 className="card-title">Daftar {document.title}</h3>
         </Card.Header>
         <Card.Body>
            <Filter />
            <Table responsive hover id="datatable" className="align-middle table-row-dashed fs-6" size="sm">
               <thead>
                  <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                     <th style={{ width: "10%" }}>nim</th>
                     <th style={{ width: "20%" }}>nama</th>
                     <th style={{ width: "10%" }} className="text-center">
                        angkatan
                     </th>
                     <th>program studi</th>
                     <th>status</th>
                     <th className="text-center">pembimbing</th>
                  </tr>
               </thead>
               <tbody className="text-gray-600 fw-semibold" />
            </Table>
         </Card.Body>
      </Card>
   );
};
export default Lists;
