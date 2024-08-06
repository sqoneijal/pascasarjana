import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const Lists = () => {
   const { module } = useSelector((e) => e.redux);
   const { lampiran } = module;
   const dispatch = useDispatch();

   // object
   const [uploadProgres, setUploadProgres] = useState({});

   const handleUpload = (file, id) => {
      const formData = { file, id };

      const config = {
         onUploadProgress(progressEvent) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgres({ [id]: percentCompleted });
         },
      };

      const fetch = h.post(`/submit`, formData, config);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         h.notification(data.status, data.msg_response);

         if (!data.status) return;
         dispatch(setModule({ ...module, lampiran: data.content }));
      });
      fetch.finally(() => {
         setUploadProgres({ [id]: 0 });
      });
   };

   return (
      <Table responsive hover id="datatable" className="align-middle table-row-dashed fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th>keterangan</th>
               <th>lampiran</th>
               <th style={{ width: "10%" }} />
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={lampiran}
               render={(row) => (
                  <tr>
                     <td>{h.parse("nama", row)}</td>
                     <td>
                        <a href={h.getDriveFile(h.parse("id_google_drive", row))} target="_blank">
                           {h.parse("nama_lampiran", row)}
                        </a>
                     </td>
                     <td className="text-end">
                        {h.parse(row.id, uploadProgres) && h.toInt(row.id) > 0 ? (
                           `${h.parse(row.id, uploadProgres)}%`
                        ) : (
                           <label
                              htmlFor={`button_${h.parse("id", row)}`}
                              className="btn btn-active-icon-primary btn-active-text-primary btn-sm p-0 m-0">
                              <input
                                 id={`button_${h.parse("id", row)}`}
                                 type="file"
                                 style={{ display: "none" }}
                                 onChange={(e) => {
                                    const file = e.target.files;
                                    if (h.arrLength(file)) {
                                       handleUpload(file[0], h.parse("id", row));
                                    }
                                 }}
                              />
                              <i className="ki-outline ki-file-up fs-1" />
                           </label>
                        )}
                     </td>
                  </tr>
               )}
            />
         </tbody>
      </Table>
   );
};
export default Lists;
