import React from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const TimPenguji = () => {
   const { module } = useSelector((e) => e.redux);
   const { tim_penguji_sidang, detailContent } = module;
   const dispatch = useDispatch();

   const status = (status) => {
      return status === "t" ? (
         <i className="ki-outline ki-flag fs-2 fw-bold text-success" />
      ) : (
         <i className="ki-outline ki-flag fs-2 fw-bold text-danger" />
      );
   };

   return (
      <Table responsive hover className="align-middle table-row-dashed fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th className="text-center">ke</th>
               <th>nidn/nik</th>
               <th>nama</th>
               <th>kategori kegiatan</th>
               <th className="text-center">sudah sidang</th>
               <th />
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={tim_penguji_sidang}
               render={(row) => (
                  <tr>
                     <td className="text-center">{h.parse("penguji_ke", row)}</td>
                     <td>{h.parse("nidn", row)}</td>
                     <td>{h.parse("nama_dosen", row)}</td>
                     <td>{h.parse("kategori_kegiatan", row)}</td>
                     <td className="text-center">{status(h.parse("telah_sidang", row))}</td>
                     <td className="text-end">
                        <a
                           href="#"
                           className="btn btn-active-icon-warning btn-active-text-warning btn-sm p-0 m-0"
                           onClick={(e) => {
                              e.preventDefault();
                              dispatch(setModule({ ...module, openFormTimPenguji: true, pageType: "update", detailPenguji: row }));
                           }}>
                           <i className="ki-outline ki-notepad-edit fs-1" />
                        </a>
                        <a
                           href="#"
                           className="btn btn-active-icon-danger btn-active-text-danger btn-sm p-0 m-0"
                           onClick={(e) => {
                              e.preventDefault();
                              h.confirmDelete({
                                 message: `Apakah anda yakin ingin menghapus dosen penguji ${h.parse("nidn", row)} - ${h.parse("nama_dosen", row)}`,
                                 url: "/hapuspenguji",
                                 id: h.parse("id", row),
                                 custom: {
                                    nim: h.parse("nim", detailContent),
                                    id_periode: h.parse("id_periode", detailContent),
                                    id_status_tugas_akhir: h.parse("id_status_tugas_akhir", detailContent),
                                 },
                              }).then((res) => {
                                 const { data } = res;
                                 h.notification(data.status, data.msg_response);
                                 if (data.status) dispatch(setModule({ ...module, tim_penguji_sidang: data.content }));
                              });
                           }}>
                           <i className="ki-outline ki-trash-square fs-1" />
                        </a>
                     </td>
                  </tr>
               )}
            />
         </tbody>
      </Table>
   );
};
export default TimPenguji;
