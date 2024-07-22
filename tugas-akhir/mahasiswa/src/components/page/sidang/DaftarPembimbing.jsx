import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const DaftarPembimbing = () => {
   const { module } = useSelector((e) => e.redux);
   const { pembimbing } = module;

   const renderStatus = (status) => {
      return status === "t" ? (
         <i className="ki-outline ki-like fs-4 fw-bold text-success m-2" />
      ) : (
         <i className="ki-outline ki-dislike fs-4 fw-bold text-danger m-2" />
      );
   };

   return (
      <Table responsive hover className="align-middle fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th colSpan={4} className="text-dark">
                  pembimbing
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
               of={pembimbing}
               render={(row) => (
                  <React.Fragment>
                     <tr>
                        <td className="text-center">{h.parse("pembimbing_ke", row)}</td>
                        <td>
                           {row.nidn} - {h.parse("nama_dosen", row)}
                        </td>
                        <td>{h.parse("kategori_kegiatan", row)}</td>
                        <td className="text-center">{renderStatus(h.parse("sudah_sidang", row))}</td>
                     </tr>
                     {h.parse("sudah_sidang", row) === "f" && (
                        <tr>
                           <td />
                           <td className="text-danger fs-7" style={{ fontStyle: "italic" }} colSpan={3}>
                              {h.parse("catatan", row)}
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
export default DaftarPembimbing;
