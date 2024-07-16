import React from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const Lampiran = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { syarat, detailContent, lampiran_upload } = module;
   const dispatch = useDispatch();

   const renderWajib = (row) => {
      return h.parse("wajib", row) === "t" ? (
         <i className="ki-outline ki-check-square fs-2 fw-bold text-success" />
      ) : (
         <i className="ki-outline ki-close-square fs-2 fw-bold text-danger" />
      );
   };

   const renderBukti = (id_syarat, lampiran) => {
      if (h.parse(id_syarat, lampiran)) {
         return (
            <button
               onClick={(e) => {
                  e.preventDefault();
                  window.open(h.getDriveFile(h.parse("id_google_drive", lampiran[id_syarat])), "_blank");
               }}>
               {h.parse("lampiran", lampiran[id_syarat])}
            </button>
         );
      }
   };

   const handleChangeValidStatus = (row) => {
      const formData = {
         id_syarat: h.parse("id", row),
         nim: h.parse("nim", detailContent),
         id_periode: h.parse("id_periode", detailContent),
         user_modified: h.parse("username", init),
      };

      const fetch = h.post(`/submitvalidlampiran`, formData);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         h.notification(data.status, data.msg_response);

         if (!data.status) return;

         dispatch(setModule({ ...module, lampiran_upload: data.content }));
      });
   };

   return (
      <Table responsive hover id="datatable" className="align-middle table-row-dashed fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th rowSpan={2} className="align-middle">
                  keterangan
               </th>
               <th rowSpan={2} className="align-middle">
                  bukti
               </th>
               <th className="text-center align-middle" rowSpan={2}>
                  wajib
               </th>
               <th className="text-center align-middle" colSpan={2}>
                  status
               </th>
            </tr>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th>valid</th>
               <th>tidak valid</th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={syarat}
               render={(row) => (
                  <React.Fragment>
                     <tr>
                        <td>{h.parse("nama", row)}</td>
                        <td>{renderBukti(h.parse("id", row), lampiran_upload)}</td>
                        <td className="text-center">{renderWajib(row)}</td>
                        <td className="text-center">
                           {h.form_check_switch(
                              null,
                              h.parse("id", row),
                              {
                                 onChange: (e) => handleChangeValidStatus(row),
                                 checked: h.parse("valid", lampiran_upload[h.parse("id", row)]) === "t",
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
                                 onChange: (e) => dispatch(setModule({ ...module, openFormTidakValidLampiran: true, detailSyarat: row })),
                                 checked: h.parse("valid", lampiran_upload[h.parse("id", row)]) === "f",
                              },
                              "danger",
                              "h-20px w-30px"
                           )}
                        </td>
                     </tr>
                     {h.parse("valid", lampiran_upload[h.parse("id", row)]) === "f" && (
                        <tr>
                           <td colSpan={5} className="text-danger fs-7" style={{ fontStyle: "italic" }}>
                              {h.parse("keterangan", lampiran_upload[h.parse("id", row)])}
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
export default Lampiran;
