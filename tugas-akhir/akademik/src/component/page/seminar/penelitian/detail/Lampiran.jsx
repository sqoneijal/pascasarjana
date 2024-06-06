import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const Lampiran = () => {
   const { module } = useSelector((e) => e.redux);
   const { lampiran, statusApproveLampiran, statusTugasAkhir, keteranganApproveLampiran } = module;

   const unsetFieldLampiran = ["id", "id_status_tugas_akhir"];

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
                                 disabled: true,
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
                                 disabled: true,
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
