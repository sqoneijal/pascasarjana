import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const JadwalSidang = () => {
   const { module } = useSelector((e) => e.redux);
   const { jadwalSidang } = module;

   return (
      <Table responsive hover className="align-middle fs-6" size="sm">
         <thead>
            <tr className="text-start text-dark fw-bold fs-7 text-uppercase gs-0">
               <th colSpan={2}>jadwal sidang munaqasyah</th>
            </tr>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th>tanggal sidang</th>
               <th>jam sidang</th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <tr>
               <td>{h.parse("tanggal", jadwalSidang, "date")}</td>
               <td>{h.parse("jam", jadwalSidang, "jam")}</td>
            </tr>
         </tbody>
      </Table>
   );
};
export default JadwalSidang;
