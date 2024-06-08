import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const Pembimbing = () => {
   const { module } = useSelector((e) => e.redux);
   const { pembimbing } = module;

   return (
      <Table responsive hover className="align-middle table-row-dashed fs-6 mt-5" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th className="text-center">pembimbing</th>
               <th>nidn/nik</th>
               <th>nama</th>
               <th>kategori kegiatan</th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            {h.arrLength(pembimbing) ? (
               <Each
                  of={pembimbing}
                  render={(row) => (
                     <tr>
                        <td className="text-center">{h.parse("pembimbing_ke", row)}</td>
                        <td>{h.parse("nidn", row)}</td>
                        <td>{h.parse("nama_dosen", row)}</td>
                        <td>{h.parse("kategori_kegiatan", row)}</td>
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
export default Pembimbing;
