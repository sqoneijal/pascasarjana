import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const Lists = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { pembimbingSeminarProposal, lampiranUpload } = module;
   const { syarat } = init;
   const dispatch = useDispatch();

   // object
   const [uploadProgres, setUploadProgres] = useState({});

   const handleUploadFile = (fileInput, row) => {
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
         nim: h.parse("nim", init),
         file: fileInput.files[0],
         id_syarat: h.parse("id", row),
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

         if (data.status) {
            dispatch(
               setModule({
                  ...module,
                  lampiranUpload: {
                     ...lampiranUpload,
                     [h.parse("id", row)]: {
                        id_google_drive: data.googleFile.id,
                        lampiran: data.googleFile.name,
                     },
                  },
               })
            );
         } else {
            setUploadProgres({});
         }
      });
      fetch.finally(() => {
         setUploadProgres({});
      });
   };

   const statusWajib = (status) => {
      return status === "t" && <i className="ki-outline ki-check-circle fs-4 fw-bold text-success" />;
   };

   const statusValidasiLampiran = {
      "": "",
      t: "text-success fw-bold",
      f: "text-danger fw-bold",
   };

   return (
      <React.Fragment>
         <div className="alert alert-dismissible bg-light-primary d-flex flex-column flex-sm-row p-5">
            <i className="ki-outline ki-notification-bing fs-2hx text-primary me-4 mb-5 mb-sm-0" />
            <div className="d-flex flex-column mb-0 p-0">
               <h4 className="fw-semibold">Keterangan Warna Pada Daftar Lampiran</h4>
               <ul className="mb-0">
                  <li className="fw-bold">Lampiran belum di verifikasi.</li>
                  <li className="text-danger fw-bold">Lampiran di tolak.</li>
                  <li className="text-success fw-bold">Lampiran di terima.</li>
               </ul>
            </div>
         </div>
         <Table responsive hover className={`align-middle fs-6 ${h.arrLength(pembimbingSeminarProposal) ? "mt-5" : ""}`} size="sm">
            <thead>
               <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                  <th className="text-center">wajib</th>
                  <th colSpan={3}>daftar lampiran</th>
               </tr>
            </thead>
            <tbody className="text-gray-600 fw-semibold">
               <Each
                  of={syarat.filter((e) => h.parse("syarat", e) === 1)}
                  render={(row) => (
                     <React.Fragment>
                        <tr>
                           <td className="text-center">{statusWajib(h.parse("wajib", row))}</td>
                           <td className={statusValidasiLampiran[h.parse("valid", lampiranUpload[h.parse("id", row)])]}>{h.parse("nama", row)}</td>
                           <td className="text-end">
                              {h.renderGoogleDrivePermalink(
                                 h.parse("id_google_drive", lampiranUpload[h.parse("id", row)]),
                                 h.parse("lampiran", lampiranUpload[h.parse("id", row)])
                              )}
                           </td>
                           <td className="text-end" style={{ width: `5%` }}>
                              {h.parse(h.parse("id", row), uploadProgres) && `${h.parse(h.parse("id", row), uploadProgres)}%`}
                              {["", 3].includes(h.parse("status", init)) && (
                                 <label
                                    className="fw-bold"
                                    htmlFor={h.parse("id", row)}
                                    style={{ display: h.parse(h.parse("id", row), uploadProgres) ? "none" : "" }}>
                                    Upload{" "}
                                    <input
                                       type="file"
                                       style={{ display: "none" }}
                                       id={h.parse("id", row)}
                                       onChange={(e) => handleUploadFile(e.target, row)}
                                    />
                                 </label>
                              )}
                           </td>
                        </tr>
                        {h.parse("valid", lampiranUpload[h.parse("id", row)]) === "f" && (
                           <tr>
                              <td />
                              <td className="text-danger fs-7" style={{ fontStyle: "italic" }}>
                                 {h.parse("keterangan", lampiranUpload[h.parse("id", row)])}
                              </td>
                           </tr>
                        )}
                     </React.Fragment>
                  )}
               />
            </tbody>
         </Table>
      </React.Fragment>
   );
};
export default Lists;
