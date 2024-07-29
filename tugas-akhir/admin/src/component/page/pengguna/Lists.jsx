import React, { useLayoutEffect } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { buttonConfig, setModule } from "~/redux";

let datatable;

const Lists = () => {
   const { filter, init, module } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   const datatable_url = `/getdata?${h.serialize(filter)}`;
   datatable = h.initDatatable({
      show_edit_button: true,
      show_delete_button: true,
      url: datatable_url,
      filter: { username: h.parse("username", init) },
      columns: [
         {
            data: null,
            orderable: false,
            class: "text-center",
            render: (data) => {
               const avatarPath = `/profile/avatar?name=${h.parse("avatar", data)}`;
               return `<img src="${avatarPath}" alt="${h.parse("nama", data)}" class="img-fluid rounded-3 w-50px h-50px" />`;
            },
         },
         { data: "nama" },
         { data: "username" },
         { data: "email" },
         {
            data: null,
            render: (data) => {
               return h.userRole(h.parse("role", data));
            },
         },
         { data: null },
      ],
      order: [[1, "asc"]],
      columnDefs: true,
      createdRow: (row, data) => {
         const _edit = row.querySelector("#edit");
         if (_edit) {
            _edit.onclick = (e) => {
               e.preventDefault();
               dispatch(setModule({ ...module, openForms: true, pageType: "update", detailContent: data }));
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
      dispatch(
         buttonConfig({
            label: `Tambah ${document.title}`,
            variant: "primary",
            init: {
               openForms: true,
               pageType: "insert",
            },
         })
      );
      return () => {};
   }, []);

   return (
      <Table responsive hover id="datatable" className="align-middle table-row-dashed fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th style={{ width: "5%" }} />
               <th>nama</th>
               <th>username</th>
               <th>email</th>
               <th>role</th>
               <th />
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold" />
      </Table>
   );
};
export default Lists;
