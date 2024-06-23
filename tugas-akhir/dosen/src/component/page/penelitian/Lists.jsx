import React from "react";
import { Table } from "react-bootstrap";

const Lists = () => {
   return (
      <Table responsive hover id="datatable" className="align-middle table-row-dashed fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th>nim</th>
               <th>nama</th>
               <th className="text-center">angkatan</th>
               <th>progarm studi</th>
               <th>jadwal seminar</th>
               <th>status</th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold" />
      </Table>
   );
};
export default Lists;
