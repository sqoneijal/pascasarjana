import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const TimPembimbing = () => {
   const { module } = useSelector((e) => e.redux);
   const { pembimbing } = module;

   const status = (row) => {
      return h.parse("boleh_seminar", row) === "t" ? (
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
               <th className="text-center" style={{ width: "5%" }}>
                  status
               </th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={pembimbing}
               render={(row) => (
                  <tr>
                     <td className="text-center">{h.parse("pembimbing_ke", row)}</td>
                     <td>{h.parse("nidn", row)}</td>
                     <td>{h.parse("nama_dosen", row)}</td>
                     <td>{h.parse("kategori_kegiatan", row)}</td>
                     <td className="text-center">{status(row)}</td>
                  </tr>
               )}
            />
         </tbody>
      </Table>
   );
};
export default TimPembimbing;
