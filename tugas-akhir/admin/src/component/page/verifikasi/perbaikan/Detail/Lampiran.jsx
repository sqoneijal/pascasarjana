import React from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const Lampiran = () => {
   const { module } = useSelector((e) => e.redux);
   const { lampiran, statusApproveLampiran, statusTugasAkhir, keteranganApproveLampiran } = module;
   const dispatch = useDispatch();

   const unsetFieldLampiran = ["id", "id_status_tugas_akhir"];

   const handleChangeValidStatus = (target, status, catatan = null) => {
      const formData = {
         id_lampiran: h.parse("id_lampiran", statusApproveLampiran),
         id: h.parse("id", statusApproveLampiran),
         field: target.name,
         status,
         checked: target.checked,
         catatan,
      };

      const fetch = h.post(`/submitchangevalidstatus`, formData);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         h.notification(data.status, data.msg_response);

         if (!data.status) return;

         dispatch(setModule({ ...module, ...data.content, openModalTidakValid: false, keyCatatan: "" }));
      });
   };

   const renderKeterangan = (field, keteranganApproveLampiran) => {
      return (
         h.parse(field, keteranganApproveLampiran) && (
            <span style={{ display: "block", fontSize: 12, fontStyle: "italic", color: "#f82859" }}>{h.parse(field, keteranganApproveLampiran)}</span>
         )
      );
   };

   return (
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
                  status valid
               </th>
            </tr>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th className="text-center">iya</th>
               <th className="text-center">tidak</th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={Object.keys(lampiran)}
               render={(key) =>
                  !unsetFieldLampiran.includes(key) && (
                     <tr>
                        <td>
                           {h.keteranganLampiran(key)}
                           {h.parse(key, statusApproveLampiran) === "f" && renderKeterangan(key, keteranganApproveLampiran)}
                        </td>
                        <td className="text-center">
                           <a
                              href={h.getFile(h.parse(key, lampiran), h.parse("nim", statusTugasAkhir))}
                              target="_blank"
                              className="btn btn-active-icon-primary btn-active-text-primary btn-sm p-0 m-0">
                              Lihat
                           </a>
                        </td>
                        <td className="text-center">
                           {h.form_check_switch(
                              null,
                              key,
                              {
                                 onChange: (e) => handleChangeValidStatus(e.target, "valid"),
                                 checked: h.parse(key, statusApproveLampiran) === "t",
                              },
                              "success",
                              "h-20px w-30px"
                           )}
                        </td>
                        <td className="text-center">
                           {h.form_check_switch(
                              null,
                              key,
                              {
                                 onChange: (e) =>
                                    e.target.checked
                                       ? dispatch(setModule({ ...module, openModalTidakValid: true, keyCatatan: key }))
                                       : handleChangeValidStatus(e.target, "not_valid"),
                                 checked: h.parse(key, statusApproveLampiran) === "f",
                              },
                              "danger",
                              "h-20px w-30px"
                           )}
                        </td>
                     </tr>
                  )
               }
            />
         </tbody>
      </Table>
   );
};
export default Lampiran;
