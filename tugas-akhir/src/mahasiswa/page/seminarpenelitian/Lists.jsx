import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const Lists = () => {
   const { init, module } = useSelector((e) => e.redux);
   const { statusTugasAkhir, lampiranUpload } = module;
   const { syarat } = init;
   const dispatch = useDispatch();

   // object
   const [uploadProgres, setUploadProgres] = useState({});

   const handleUploadFile = (fileInput, id_syarat) => {
      if (!h.arrLength(fileInput.files)) {
         h.notification(false, "Silahkan pilih lampiran terlebih dahulu.");
         return;
      }

      const config = {
         onUploadProgress(progressEvent) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgres({ [fileInput.id]: percentCompleted });
         },
      };

      const formData = {
         id_status_tugas_akhir: h.parse("id", statusTugasAkhir),
         nim: h.parse("username", init),
         file: fileInput.files[0],
         name: fileInput.id,
         id_syarat,
      };

      const fetch = h.post(`/uploadlampiran`, formData, config, true);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         h.notification(data.status, data.msg_response);

         if (!data.status) return;

         dispatch(
            setModule({
               ...module,
               lampiranUpload: {
                  ...lampiranUpload,
                  [id_syarat]: {
                     id_google_drive: h.parse("id", data.googleFile),
                     lampiran: h.parse("name", data.googleFile),
                  },
               },
            })
         );
      });
      fetch.finally(() => {
         setUploadProgres({});
      });
   };

   const renderLampiran = (lampiranUpload, idSyarat) => {
      if (h.parse(idSyarat, lampiranUpload)) {
         return (
            <a href={h.getDriveFile(h.parse("id_google_drive", lampiranUpload[idSyarat]))} target="_blank">
               {h.parse("lampiran", lampiranUpload[idSyarat])}
            </a>
         );
      }
   };

   const renderCatatanPerbaikan = (dataObject, idSyarat) => {
      if (h.parse(idSyarat, dataObject) && h.parse("valid", dataObject[idSyarat]) === "f" && h.parse("keterangan", dataObject[idSyarat])) {
         return (
            <React.Fragment>
               <br />
               <span style={{ fontStyle: "italic", color: "red", fontSize: 12 }}>{h.parse("keterangan", dataObject[idSyarat])}</span>
            </React.Fragment>
         );
      }
   };

   const renderDownloadTemplate = (data) => {
      if (h.parse("ada_lampiran", data) === "t" && h.parse("id_google_drive", data)) {
         return (
            <React.Fragment>
               <br />
               <a href={h.getDriveFile(h.parse("id_google_drive", data))} target="_blank">
                  Download Template
               </a>
            </React.Fragment>
         );
      }
   };

   const statusWajib = (status) => {
      return status === "t" && <i className="ki-outline ki-check-circle fs-4 fw-bold text-success" />;
   };

   return (
      <Table responsive hover className="align-middle table-row-dashed fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th className="text-center" style={{ width: "5%" }}>
                  wajib
               </th>
               <th colSpan={3}>daftar lampiran</th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={syarat.filter((e) => h.parse("syarat", e) === 2)}
               render={(row) => (
                  <tr>
                     <td className="text-center">{statusWajib(h.parse("wajib", row))}</td>
                     <td className="text-middle">
                        {h.parse("nama", row)}
                        {renderCatatanPerbaikan(lampiranUpload, h.parse("id", row))}
                        {renderDownloadTemplate(row)}
                     </td>
                     <td className="text-end text-middle">{renderLampiran(lampiranUpload, h.parse("id", row))}</td>
                     <td className="text-end" style={{ width: `5%` }}>
                        {h.parse(h.parse("id", row), uploadProgres) && `${h.parse(h.parse("id", row), uploadProgres)}%`}
                        {[13].includes(h.parse("status", init)) && (
                           <label
                              className="fw-bold"
                              htmlFor={h.parse("id", row)}
                              style={{ display: h.parse(h.parse("id", row), uploadProgres) ? "none" : "" }}>
                              Upload{" "}
                              <input
                                 type="file"
                                 style={{ display: "none" }}
                                 id={h.parse("id", row)}
                                 onChange={(e) => handleUploadFile(e.target, h.parse("id", row))}
                              />
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
