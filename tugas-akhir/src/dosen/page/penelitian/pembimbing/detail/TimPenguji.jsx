import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const TimPenguji = () => {
   const { module } = useSelector((e) => e.redux);
   const { penguji } = module;

   const status = (row) => {
      return h.parse("lanjut_sidang", row) === "t" ? (
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
               <th className="text-center">lanjut sidang</th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={penguji}
               render={(row) => (
                  <tr>
                     <td className="text-center">{h.parse("penguji_ke", row)}</td>
                     <td>{row.nidn}</td>
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
export default TimPenguji;
