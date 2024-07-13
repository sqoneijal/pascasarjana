import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const Lampiran = () => {
   const { module } = useSelector((e) => e.redux);
   const { syarat, lampiran_upload } = module;

   const renderLampiran = (id, lampiran) => {
      if (h.parse(id, lampiran)) {
         return (
            <a href={h.getDriveFile(h.parse("id_google_drive", lampiran[id]))} target="_blank">
               {h.parse("lampiran", lampiran[id])}
            </a>
         );
      }
   };

   return (
      <Table responsive hover className="align-middle table-row-dashed fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th>keterangan</th>
               <th>bukti</th>
               <th className="text-center">wajib</th>
            </tr>
         </thead>
         <tbody>
            <Each
               of={syarat}
               render={(row) => (
                  <tr>
                     <td className="text-start fw-bold fs-7 gs-0">{h.parse("nama", row)}</td>
                     <td className="text-end">{renderLampiran(h.parse("id", row), lampiran_upload)}</td>
                  </tr>
               )}
            />
         </tbody>
      </Table>
   );
};
export default Lampiran;
