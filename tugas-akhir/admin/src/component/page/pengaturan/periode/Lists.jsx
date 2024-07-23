import React, { useLayoutEffect } from "react";
import { Card, Table } from "react-bootstrap";
import * as h from "~/Helpers";

let datatable;

const Lists = () => {
   const renderStatus = (key) => {
      return key === "t" ? `<span class="badge badge-success">Aktif</span>` : `<span class="badge badge-danger">Tidak Aktif</span>`;
   };

   const datatable_url = `/getdata`;
   datatable = h.initDatatable({
      show_edit_button: false,
      show_delete_button: true,
      url: datatable_url,
      columns: [
         {
            data: null,
            render: (data) => {
               return h.periode(h.parse("periode", data));
            },
         },
         {
            data: null,
            render: (data) => {
               return renderStatus(h.parse("status", data));
            },
         },
         { data: null },
      ],
      columnDefs: true,
      createdRow: (row, data) => {
         const _delete = row.querySelector("#delete");
         if (_delete) {
            _delete.onclick = (e) => {
               e.preventDefault();
               h.confirmDelete({
                  url: "/hapus",
                  id: data.id,
                  custom: { periode: h.parse("periode", data) },
               }).then((res) => {
                  if (typeof res === "undefined") return;
                  const { data } = res;
                  h.notification(data.status, data.msg_response);
                  data.status && datatable.reload();
               });
            };
         }
      },
   });

   useLayoutEffect(() => {
      datatable.init();
      return () => {};
   }, []);

   return (
      <Card className="shadow-sm card-bordered">
         <Card.Body>
            <Table responsive hover id="datatable" className="align-middle table-row-dashed fs-6" size="sm">
               <thead>
                  <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                     <th>periode</th>
                     <th>status</th>
                     <th />
                  </tr>
               </thead>
               <tbody className="text-gray-600 fw-semibold" />
            </Table>
         </Card.Body>
      </Card>
   );
};
export default Lists;
