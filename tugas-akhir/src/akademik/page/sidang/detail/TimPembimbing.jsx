import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const TimPembimbing = () => {
   const { module } = useSelector((e) => e.redux);
   const { tim_pembimbing } = module;

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
               <th rowSpan={2} className="text-center">
                  ke
               </th>
               <th rowSpan={2}>nidn/nik</th>
               <th rowSpan={2}>nama</th>
               <th rowSpan={2}>kategori kegiatan</th>
               <th className="text-center" colSpan={2}>
                  status
               </th>
            </tr>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th className="text-center">seminar hasil</th>
               <th className="text-center">sidang</th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={tim_pembimbing}
               render={(row) => (
                  <React.Fragment>
                     <tr>
                        <td className="text-center">{h.parse("pembimbing_ke", row)}</td>
                        <td>{h.parse("nidn", row)}</td>
                        <td>{h.parse("nama_dosen", row)}</td>
                        <td>{h.parse("kategori_kegiatan", row)}</td>
                        <td className="text-center">{status(h.parse("boleh_sidang", row))}</td>
                        <td className="text-center">{status(h.parse("sudah_sidang", row))}</td>
                     </tr>
                     {h.parse("sudah_sidang", row) === "f" && (
                        <tr>
                           <td />
                           <td className="text-danger fs-7" style={{ fontStyle: "italic" }} colSpan={5}>
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
export default TimPembimbing;
