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

      const file = fileInput.files[0];
      const fileType = file.type;
      const fileSize = file.size;
      const maxSize = 20 * 1024 * 1024;

      if (fileType !== "application/pdf") {
         h.notification(false, "Hanya file PDF yang diizinkan.");
         fileInput.value = "";
         return;
      }

      if (fileSize > maxSize) {
         h.notification(false, "Ukuran file melebihi batas maksimum 2 MB.");
         fileInput.value = "";
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

         dispatch(setModule({ ...module, lampiranUpload: { ...lampiranUpload, ...data.content, [id_syarat]: { lampiran: data.fileName } } }));
      });
      fetch.finally(() => {
         setUploadProgres({});
      });
   };

   const renderLampiranPermalink = (dataObject, idSyarat) => {
      if (h.parse(idSyarat, dataObject)) {
         return (
            <a href={h.cdn(`media/${h.parse("nim", init)}/${h.parse("lampiran", dataObject[idSyarat])}`)} target="_blank">
               lihat
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

   const renderStatusApprove = (dataObject, idSyarat) => {
      if (h.parse(idSyarat, dataObject)) {
         if (h.parse("valid", dataObject[idSyarat]) === "") {
            return <i className="ki-outline ki-archive fs-4 fw-bold text-end float-end text-warning" />;
         } else if (h.parse("valid", dataObject[idSyarat]) === "t") {
            return <i className="ki-outline ki-like fs-4 fw-bold text-end float-end text-success" />;
         } else if (h.parse("valid", dataObject[idSyarat]) === "f") {
            return <i className="ki-outline ki-dislike fs-4 fw-bold text-end float-end text-danger" />;
         }
      }
   };

   return (
      <Table responsive hover className="align-middle table-row-dashed fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th>daftar lampiran</th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={syarat.filter((e) => h.parse("syarat", e) === 3)}
               render={(row) => (
                  <tr>
                     <td>
                        {h.parse("nama", row)}
                        {renderCatatanPerbaikan(lampiranUpload, h.parse("id", row))}
                        {renderStatusApprove(lampiranUpload, h.parse("id", row))}
                     </td>
                     <td className="text-end" style={{ width: `5%` }}>
                        {renderLampiranPermalink(lampiranUpload, h.parse("id", row))}
                     </td>
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
               )}
            />
         </tbody>
      </Table>
   );
};
export default Lists;
