import React, { useState } from "react";
import { Card, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const Forms = () => {
   const { module } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   // object
   const [uploadProgres, setUploadProgres] = useState({});

   const array = [
      { label: "Lampiran Permohonan Kepada Direktur", value: "template_permohonan" },
      { label: "Lampiran Persetujuan Penasehat Akademik (KA. Prodi)", value: "template_pengesahan" },
   ];

   const handleUpload = (file, field) => {
      const formData = { file, field };

      const config = {
         onUploadProgress(progressEvent) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgres({ [field]: percentCompleted });
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

         dispatch(setModule({ ...module, ...data.content }));
      });
      fetch.finally(() => {
         setUploadProgres({ [field]: 0 });
      });
   };

   return (
      <Card className="shadow-sm card-bordered">
         <Card.Header>
            <h3 className="card-title">Daftar {document.title}</h3>
         </Card.Header>
         <Card.Body>
            <Table responsive hover className="align-middle table-row-dashed fs-6" size="sm">
               <thead>
                  <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                     <th>nama lampiran</th>
                     <th>file lampiran</th>
                     <th />
                  </tr>
               </thead>
               <tbody className="text-gray-600 fw-semibold">
                  <Each
                     of={array}
                     render={(row) => (
                        <tr>
                           <td>{h.parse("label", row)}</td>
                           <td>
                              <a href={h.getFile(h.parse(h.parse("value", row), module))} target="_blank">
                                 {h.parse(h.parse("value", row), module)}
                              </a>
                           </td>
                           <td className="text-end">
                              {h.parse(row.value, uploadProgres) && h.toInt(row.value) > 0 ? (
                                 `${h.parse(row.value, uploadProgres)}%`
                              ) : (
                                 <label htmlFor={h.parse("value", row)}>
                                    <input
                                       id={h.parse("value", row)}
                                       type="file"
                                       style={{ display: "none" }}
                                       onChange={(e) => {
                                          const file = e.target.files;
                                          if (h.arrLength(file)) {
                                             handleUpload(file[0], h.parse("value", row));
                                          }
                                       }}
                                    />{" "}
                                    Upload File
                                 </label>
                              )}
                           </td>
                        </tr>
                     )}
                  />
               </tbody>
            </Table>
         </Card.Body>
      </Card>
   );
};
export default Forms;
