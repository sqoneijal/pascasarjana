import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const TimPenguji = () => {
   const { module } = useSelector((e) => e.redux);
   const { tim_penguji } = module;

   const sudahSidang = (row) => {
      return h.parse("telah_sidang", row) === "t" ? (
         <i className="ki-outline ki-flag fs-2 fw-bold text-success" />
      ) : (
         <i className="ki-outline ki-flag fs-2 fw-bold text-danger" />
      );
   };

   const renderCatatan = (row) => {
      if (h.parse("telah_sidang", row) === "f") {
         return (
            <tr>
               <td />
               <td className="text-danger fs-7" style={{ fontStyle: "italic" }} colSpan={5}>
                  {h.parse("keterangan_perbaikan", row)}
               </td>
            </tr>
         );
      }
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
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={tim_penguji}
               render={(row) => (
                  <React.Fragment>
                     <tr>
                        <td className="text-center">{h.parse("penguji_ke", row)}</td>
                        <td>{row.nidn}</td>
                        <td>{h.parse("nama_dosen", row)}</td>
                        <td>{h.parse("kategori_kegiatan", row)}</td>
                        <td className="text-center">{sudahSidang(row)}</td>
                     </tr>
                     {renderCatatan(row)}
                  </React.Fragment>
               )}
            />
         </tbody>
      </Table>
   );
};
export default TimPenguji;
