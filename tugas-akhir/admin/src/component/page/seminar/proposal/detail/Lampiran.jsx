import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const Lampiran = () => {
   const { module } = useSelector((e) => e.redux);
   const { syarat, lampiranUpload } = module;

   const renderWajib = (status) => {
      return status === "t" ? (
         <i className="ki-outline ki-check-square fs-2 fw-bold text-success" />
      ) : (
         <i className="ki-outline ki-close-square fs-2 fw-bold text-danger" />
      );
   };

   return (
      <Table responsive hover className="align-middle table-row-dashed fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th>keterangan</th>
               <th>bukti</th>
               <th className="text-center" style={{ width: "5%" }}>
                  wajib?
               </th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={syarat}
               render={(row) => (
                  <tr>
                     <td>{h.parse("nama", row)}</td>
                     <td>
                        {h.parse(h.parse("id", row), lampiranUpload) && (
                           <a href={h.getDriveFile(h.parse("id_google_drive", lampiranUpload[h.parse("id", row)]))} target="_blank">
                              {h.parse("lampiran", lampiranUpload[h.parse("id", row)])}
                           </a>
                        )}
                     </td>
                     <td className="text-center">{renderWajib(h.parse("wajib", row))}</td>
                  </tr>
               )}
            />
         </tbody>
      </Table>
   );
};
export default Lampiran;
