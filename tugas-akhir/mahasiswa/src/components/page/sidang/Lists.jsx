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
         nim: h.parse("nim", init),
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
               lampiranUpload: { ...lampiranUpload, [id_syarat]: { id_google_drive: data.googleFile.id, lampiran: data.googleFile.name } },
            })
         );
      });
      fetch.finally(() => {
         setUploadProgres({});
      });
   };

   const renderLampiranPermalink = (dataObject, idSyarat) => {
      if (h.parse(idSyarat, dataObject)) {
         return (
            <a href={h.getDriveFile(h.parse("id_google_drive", dataObject[idSyarat]))} target="_blank">
               {h.parse("lampiran", dataObject[idSyarat])}
            </a>
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
               <th>daftar lampiran</th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={syarat.filter((e) => h.parse("syarat", e) === 3)}
               render={(row) => (
                  <React.Fragment>
                     <tr>
                        <td className="text-center">{statusWajib(h.parse("wajib", row))}</td>
                        <td>{h.parse("nama", row)}</td>
                        <td>{renderLampiranPermalink(lampiranUpload, h.parse("id", row))}</td>
                        <td className="text-end" style={{ width: `5%` }}>
                           {h.parse(h.parse("id", row), uploadProgres) && `${h.parse(h.parse("id", row), uploadProgres)}%`}
                           {[21].includes(h.parse("status", init)) && (
                              <label
                                 className="fw-bold"
                                 htmlFor={h.parse("id", row)}
                                 style={{ cursor: "pointer", display: h.parse(h.parse("id", row), uploadProgres) ? "none" : "" }}>
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
                     {h.parse(h.parse("id", row), lampiranUpload) && h.parse("valid", lampiranUpload[h.parse("id", row)]) === "f" && (
                        <tr>
                           <td className="text-danger fs-6" style={{ fontStyle: "italic" }} colSpan={3}>
                              {h.parse("keterangan", lampiranUpload[h.parse("id", row)])}
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
export default Lists;
