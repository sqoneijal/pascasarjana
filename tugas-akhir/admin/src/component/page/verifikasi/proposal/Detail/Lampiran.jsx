import React from "react";
import { Table } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";
import ModalKeteranganTidakValid from "./ModalKeteranganTidakValid";

const Lampiran = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { lampiranUpload, detailContent } = module;
   const { syarat } = init;
   const dispatch = useDispatch();

   const handleChangeLampiranStatus = (id_lampiran_upload, status, keterangan = null) => {
      const formData = {
         id_lampiran_upload,
         status,
         user_modified: h.parse("username", init),
         nim: h.parse("nim", detailContent),
         id_periode: h.parse("id_periode", detailContent),
         keterangan,
      };

      const fetch = h.post(`/submitstatuslampiran`, formData);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         h.notification(data.status, data.msg_response);

         if (!data.status) return;

         dispatch(setModule({ ...module, openModalTidakValid: false, detailLampiran: {}, lampiranUpload: { ...lampiranUpload, ...data.content } }));
      });
   };

   const props = { handleChangeLampiranStatus };

   const renderCatatanTidakValid = (row) => {
      if (h.parse("valid", row) === "f") {
         return (
            <React.Fragment>
               <br />
               <span style={{ display: "block", fontSize: 12, fontStyle: "italic", color: "#f82859" }}>{h.parse("keterangan", row)}</span>
            </React.Fragment>
         );
      }
   };

   return (
      <React.Suspense
         fallback={
            <Bars
               visible={true}
               color="#4fa94d"
               radius="9"
               wrapperStyle={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
               }}
               wrapperClass="page-loader flex-column bg-dark bg-opacity-25"
            />
         }>
         <ModalKeteranganTidakValid {...props} />
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
                     valid
                  </th>
               </tr>
               <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                  <th className="text-center">iya</th>
                  <th className="text-center">tidak</th>
               </tr>
            </thead>
            <tbody className="text-gray-600 fw-semibold">
               <Each
                  of={syarat.filter((e) => h.parse("syarat", e) === 1)}
                  render={(row) => (
                     <tr>
                        <td>
                           {h.parse("nama", row)}
                           {renderCatatanTidakValid(lampiranUpload[h.parse("id", row)])}
                        </td>
                        <td className="text-end">
                           <a
                              href={h.getDriveFile(h.parse("id_google_drive", lampiranUpload[h.parse("id", row)]))}
                              target="_blank"
                              className="btn btn-active-icon-primary btn-active-text-primary btn-sm p-0 m-0">
                              {h.parse("lampiran", lampiranUpload[h.parse("id", row)])}
                           </a>
                        </td>
                        <td className="text-center">
                           {h.form_check_switch(
                              null,
                              h.parse("id", row),
                              {
                                 onChange: (e) => handleChangeLampiranStatus(h.parse("id", lampiranUpload[h.parse("id", row)]), "valid"),
                                 checked: h.parse("valid", lampiranUpload[h.parse("id", row)]) === "t",
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
                                 onChange: (e) =>
                                    dispatch(
                                       setModule({
                                          ...module,
                                          openModalTidakValid: true,
                                          detailLampiran: { ...row, id_lampiran_upload: h.parse("id", lampiranUpload[h.parse("id", row)]) },
                                       })
                                    ),
                                 checked: h.parse("valid", lampiranUpload[h.parse("id", row)]) === "f",
                              },
                              "success",
                              "h-20px w-30px"
                           )}
                        </td>
                     </tr>
                  )}
               />
               {/* <Each
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
               /> */}
            </tbody>
         </Table>
      </React.Suspense>
   );
};
export default Lampiran;
