import React, { useLayoutEffect } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

let datatable;

const Lists = () => {
   const { filter, module } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   const renderWajib = (status) => {
      return status === "t"
         ? `<i class="ki-outline ki-check-square fs-2 fw-bold text-success" />`
         : `<i class="ki-outline ki-close-square fs-2 fw-bold text-danger" />`;
   };

   const jenisSyarat = {
      1: "Seminar Proposal",
      2: "Seminar Hasil Penelitian",
      3: "Sidang Munaqasyah",
   };

   const datatable_url = `/getdata?${h.serialize(filter)}`;
   datatable = h.initDatatable({
      show_edit_button: true,
      show_delete_button: true,
      url: datatable_url,
      columns: [
         {
            data: null,
            class: "text-center",
            render: (data) => {
               return renderWajib(h.parse("wajib", data));
            },
         },
         { data: "nama" },
         {
            data: null,
            render: (data) => {
               return jenisSyarat[h.parse("syarat", data)];
            },
         },
         {
            data: null,
            render: (data) => {
               return `<a href="${h.getDriveFile(h.parse("id_google_drive", data))}" target="_blank">${h.parse("nama_lampiran", data)}</a>`;
            },
         },
         { data: null },
      ],
      columnDefs: true,
      createdRow: (row, data) => {
         const _edit = row.querySelector("#edit");
         if (_edit) {
            _edit.onclick = (e) => {
               e.preventDefault();
               dispatch(setModule({ ...module, openForms: true, detailContent: data, pageType: "update" }));
            };
         }

         const _delete = row.querySelector("#delete");
         if (_delete) {
            _delete.onclick = (e) => {
               e.preventDefault();
               h.confirmDelete({
                  url: "/hapus",
                  id: data.id,
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
      <Table responsive hover id="datatable" className="align-middle table-row-dashed fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th className="text-center">wajib</th>
               <th>keterangan</th>
               <th>jenis</th>
               <th>format lampiran</th>
               <th />
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold" />
      </Table>
   );
};
export default Lists;
