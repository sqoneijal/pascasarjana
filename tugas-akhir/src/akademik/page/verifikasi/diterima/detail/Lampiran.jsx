import React from "react";
import { Table } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const Lampiran = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { lampiranUpload } = module;
   const { syarat } = init;

   const renderCatatanTidakValid = (row) => {
      if (h.parse("valid", row) === "f") {
         return (
            <React.Fragment>
               <br />
               <span style={{ display: "block", fontSize: 12, fontStyle: "italic", color: "#f82859" }}>{h.parse("keterangan", row)}</span>
            </React.Fragment>
         );
      }
   };

   return (
      <React.Suspense
         fallback={
            <Bars
               visible={true}
               color="#4fa94d"
               radius="9"
               wrapperStyle={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
               }}
               wrapperClass="page-loader flex-column bg-dark bg-opacity-25"
            />
         }>
         <Table responsive hover className="align-middle table-row-dashed fs-6" size="sm">
            <thead>
               <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                  <th rowSpan={2} className="align-middle">
                     keterangan
                  </th>
                  <th rowSpan={2} className="align-middle text-center">
                     lampiran
                  </th>
                  <th colSpan={2} className="text-center" style={{ width: "10%" }}>
                     valid
                  </th>
               </tr>
               <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                  <th className="text-center">iya</th>
                  <th className="text-center">tidak</th>
               </tr>
            </thead>
            <tbody className="text-gray-600 fw-semibold">
               <Each
                  of={syarat.filter((e) => h.parse("syarat", e) === 1)}
                  render={(row) => (
                     <tr>
                        <td>
                           {h.parse("nama", row)}
                           {renderCatatanTidakValid(lampiranUpload[h.parse("id", row)])}
                        </td>
                        <td className="text-end">
                           <a
                              href={h.getDriveFile(h.parse("id_google_drive", lampiranUpload[h.parse("id", row)]))}
                              target="_blank"
                              className="btn btn-active-icon-primary btn-active-text-primary btn-sm p-0 m-0">
                              {h.parse("lampiran", lampiranUpload[h.parse("id", row)])}
                           </a>
                        </td>
                        <td className="text-center">
                           {h.form_check_switch(
                              null,
                              h.parse("id", row),
                              {
                                 disabled: true,
                                 checked: h.parse("valid", lampiranUpload[h.parse("id", row)]) === "t",
                              },
                              "success",
                              "h-20px w-30px"
                           )}
                        </td>
                        <td className="text-center">
                           {h.form_check_switch(
                              null,
                              h.parse("id", row),
                              {
                                 disabled: true,
                                 checked: h.parse("valid", lampiranUpload[h.parse("id", row)]) === "f",
                              },
                              "success",
                              "h-20px w-30px"
                           )}
                        </td>
                     </tr>
                  )}
               />
            </tbody>
         </Table>
      </React.Suspense>
   );
};
export default Lampiran;
