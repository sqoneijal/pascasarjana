import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const Lampiran = () => {
   const { module } = useSelector((e) => e.redux);
   const { syarat, lampiran_upload } = module;

   const renderWajib = (status) => {
      return status === "t" ? (
         <i className="ki-outline ki-check-square fs-2 fw-bold text-success" />
      ) : (
         <i className="ki-outline ki-close-square fs-2 fw-bold text-danger" />
      );
   };

   return (
      <Table responsive hover id="datatable" className="align-middle table-row-dashed fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th>keterangan</th>
               <th>bukti</th>
               <th className="text-center">wajib</th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={syarat}
               render={(row) => (
                  <tr>
                     <td>{h.parse("nama", row)}</td>
                     <td>
                        <button
                           onClick={(e) => {
                              e.preventDefault();
                              window.open(h.getDriveFile(h.parse("id_google_drive", lampiran_upload[h.parse("id", row)])), "_blank");
                           }}>
                           {h.parse("lampiran", lampiran_upload[h.parse("id", row)])}
                        </button>
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
