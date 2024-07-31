import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const DaftarPenguji = () => {
   const { module } = useSelector((e) => e.redux);
   const { penguji } = module;

   const renderStatus = (row) => {
      if (h.parse("telah_sidang", row)) {
         if (h.parse("telah_sidang", row) === "t") {
            return <i className="ki-outline ki-like fs-4 fw-bold text-success m-2" />;
         } else if (h.parse("telah_sidang", row) === "f") {
            return <i className="ki-outline ki-dislike fs-4 fw-bold text-danger m-2" />;
         }
      }
   };

   return (
      <Table responsive hover className="align-middle fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th colSpan={4} className="text-dark">
                  penguji
               </th>
            </tr>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th className="text-center">ke</th>
               <th>dosen</th>
               <th>kategori kegiatan</th>
               <th className="text-center">status</th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={penguji}
               render={(row) => (
                  <React.Fragment>
                     <tr>
                        <td className="text-center">{h.parse("penguji_ke", row)}</td>
                        <td>
                           {row.nidn} - {h.parse("nama_dosen", row)}
                        </td>
                        <td>{h.parse("kategori_kegiatan", row)}</td>
                        <td className="text-center">{renderStatus(row)}</td>
                     </tr>
                     {h.parse("telah_sidang", row) === "f" && (
                        <tr>
                           <td />
                           <td colSpan={3} className="text-danger fs-7" style={{ fontStyle: "italic" }}>
                              {h.parse("keterangan_perbaikan", row)}
                           </td>
                        </tr>
                     )}
                  </React.Fragment>
               )}
            />
         </tbody>
      </Table>
   );
};
export default DaftarPenguji;
