import React from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const DaftarTimPembahasPenelitian = () => {
   const { module } = useSelector((e) => e.redux);
   const { pengujiPenelitian } = module;
   const dispatch = useDispatch();

   return (
      <Table responsive hover className="align-middle table-row-dashed fs-6 mt-5" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th className="text-center">penguji</th>
               <th>nidn/nik</th>
               <th>nama</th>
               <th>kategori kegiatan</th>
               <th style={{ width: `10%` }} />
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            {h.arrLength(pengujiPenelitian) ? (
               <Each
                  of={pengujiPenelitian}
                  render={(row) => (
                     <tr>
                        <td className="text-center">{h.parse("penguji_ke", row)}</td>
                        <td>{h.parse("nidn", row)}</td>
                        <td>{h.parse("nama_dosen", row)}</td>
                        <td>{h.parse("kategori_kegiatan", row)}</td>
                        <td className="text-end">
                           <a
                              href="#"
                              className="btn btn-active-icon-warning btn-active-text-warning btn-sm p-0 m-0"
                              onClick={(e) => {
                                 e.preventDefault();
                                 dispatch(
                                    setModule({ ...module, openFormsPengujiPenelitian: true, pageType: "update", detailPengujiPenelitian: row })
                                 );
                              }}>
                              <i className="ki-outline ki-notepad-edit fs-1" />
                           </a>
                           <a
                              href="#"
                              className="btn btn-active-icon-danger btn-active-text-danger btn-sm p-0 m-0"
                              onClick={(e) => {
                                 e.preventDefault();
                                 h.confirmDelete({
                                    url: "/hapuspenguji",
                                    message: `Apakah anda yakin ingin menghapus penguji ${h.parse("nama_dosen", row)}`,
                                    id: h.parse("id", row),
                                    custom: { id_status_tugas_akhir: h.parse("id_status_tugas_akhir", row) },
                                 }).then((res) => {
                                    const { data } = res;
                                    h.notification(data.status, data.msg_response);

                                    if (data.status) dispatch(setModule({ ...module, pengujiPenelitian: data.content }));
                                 });
                              }}>
                              <i className="ki-outline ki-trash-square fs-1" />
                           </a>
                        </td>
                     </tr>
                  )}
               />
            ) : (
               h.table_empty(5)
            )}
         </tbody>
      </Table>
   );
};
export default DaftarTimPembahasPenelitian;
