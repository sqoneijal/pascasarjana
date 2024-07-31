import React from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const Lampiran = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { syarat, lampiran, detailContent } = module;
   const dispatch = useDispatch();

   const renderWajib = (row) => {
      return h.parse("wajib", row) === "t" ? (
         <i className="ki-outline ki-check-square fs-2 fw-bold text-success" />
      ) : (
         <i className="ki-outline ki-close-square fs-2 fw-bold text-danger" />
      );
   };

   const renderLampiran = (lampiran, row) => {
      if (h.parse(h.parse("id", row), lampiran)) {
         return (
            <button
               onClick={(e) => {
                  e.preventDefault();
                  window.open(h.getDriveFile(h.parse("id_google_drive", lampiran[h.parse("id", row)])), "_blank");
               }}>
               {h.parse("lampiran", lampiran[h.parse("id", row)])}
            </button>
         );
      }
   };

   const handleChangeValidStatus = (target) => {
      const formData = {
         user_modified: h.parse("username", init),
         id: target.name,
         nim: h.parse("nim", detailContent),
         id_periode: h.parse("id_periode", detailContent),
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
         dispatch(setModule({ ...module, lampiran: { ...lampiran, ...data.content } }));
      });
   };

   const handleChangeTidakValidStatus = (data) => {
      dispatch(setModule({ ...module, openFormsTidakValidLampiran: true, detailLampiran: data }));
   };

   const renderCatatan = (row) => {
      if (h.parse("valid", row) === "f" && h.parse("keterangan", row)) {
         return (
            <React.Fragment>
               <br />
               <span className="text-danger" style={{ fontStyle: "italic" }}>
                  {h.parse("keterangan", row)}
               </span>
            </React.Fragment>
         );
      }
   };

   return (
      <Table responsive hover className="align-middle table-row-dashed fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th rowSpan={2}>keterangan</th>
               <th rowSpan={2}>bukti</th>
               <th className="text-center" rowSpan={2}>
                  wajib
               </th>
               <th className="text-center" colSpan={2}>
                  status
               </th>
            </tr>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th className="text-center">valid</th>
               <th className="text-center">tidak</th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={syarat}
               render={(row) => (
                  <tr>
                     <td>
                        {h.parse("nama", row)}
                        {renderCatatan(lampiran[h.parse("id", row)])}
                     </td>
                     <td>{renderLampiran(lampiran, row)}</td>
                     <td className="text-center">{renderWajib(row)}</td>
                     <td className="text-center">
                        {h.form_check_switch(
                           null,
                           h.parse("id", lampiran[h.parse("id", row)]),
                           {
                              onChange: (e) => handleChangeValidStatus(e.target),
                              checked: h.parse("valid", lampiran[h.parse("id", row)]) === "t",
                           },
                           "success",
                           "h-20px w-30px"
                        )}
                     </td>
                     <td className="text-center">
                        {h.form_check_switch(
                           null,
                           h.parse("id", lampiran[h.parse("id", row)]),
                           {
                              onChange: (e) => handleChangeTidakValidStatus(lampiran[h.parse("id", row)]),
                              checked: h.parse("valid", lampiran[h.parse("id", row)]) === "f",
                           },
                           "danger",
                           "h-20px w-30px"
                        )}
                     </td>
                  </tr>
               )}
            />
         </tbody>
      </Table>
   );
};
export default Lampiran;
