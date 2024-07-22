import React, { useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";
import FormsJudulProposal from "./FormsJudulProposal";
import Informasi from "./Informasi";
import JadwalDanPembimbingSeminarProposal from "./JadwalDanPembimbingSeminarProposal";
import JudulProposalDisetujui from "./JudulProposalDisetujui";
import Lists from "./Lists";

const Context = () => {
   const { init, module } = useSelector((e) => e.redux);
   const { syarat } = init;
   const dispatch = useDispatch();

   // bool
   const [isLoading, setIsLoading] = useState(true);
   const [isLoadingButton, setIsLoadingButton] = useState(false);

   // object
   const [input, setInput] = useState({});
   const [errors, setErrors] = useState({});

   // string
   const [jumlahUploadLampiran, setJumlahUploadLampiran] = useState(0);

   const initPage = (nim) => {
      const formData = { nim };

      setIsLoading(true);
      const fetch = h.post(`/getdetailseminarproposal`, formData, {}, true);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         dispatch(setModule({ ...module, ...data }));
      });
      fetch.finally(() => {
         setIsLoading(false);
      });
   };

   useLayoutEffect(() => {
      initPage(h.parse("nim", init));
      return () => {};
   }, [init]);

   useLayoutEffect(() => {
      if (!isLoading) {
         const { judulProposal } = module;
         setInput({ ...judulProposal });
         setJumlahUploadLampiran(Object.keys(module.lampiranUpload).length);
      }
      return () => {};
   }, [syarat, module, isLoading]);

   const submitDaftarSeminarProposal = (e) => {
      e.preventDefault();

      const formData = { id_status_tugas_akhir: module.statusTugasAkhir.id, status: h.parse("status", init) };
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsLoadingButton(true);
      const fetch = h.post(`/submitdaftarseminarproposal`, formData, {}, true);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         setErrors(data.errors);
         h.notification(data.status, data.msg_response);

         if (!data.status) return;

         window.location.reload();
      });
      fetch.finally(() => {
         setIsLoadingButton(false);
      });
   };

   const updateStatusTugasAkhir = (status) => {
      const formData = { id_status_tugas_akhir: module.statusTugasAkhir.id, status };

      setIsLoadingButton(true);
      const fetch = h.post(`/updatestatustugasakhir`, formData, {}, true);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         h.notification(data.status, data.msg_response);

         if (!data.status) return;

         window.location.reload();
      });
      fetch.finally(() => {
         setIsLoadingButton(false);
      });
   };

   const props = { input, setInput, errors };

   return isLoading ? (
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
   ) : (
      <div id="kt_content_container" className="d-flex flex-column-fluid align-items-start container-xxl">
         <div className="content flex-row-fluid" id="kt_content">
            <Card className="shadow-sm card-bordered">
               <Card.Header>
                  <h3 className="card-title">PERSYARATAN SEMINAR PROPOSAL TESIS</h3>
               </Card.Header>
               <Card.Body>
                  <Informasi />
                  {[7, 8, 9, 10].includes(h.parse("status", init)) && <JadwalDanPembimbingSeminarProposal />}
                  <FormsJudulProposal {...props} />
                  <JudulProposalDisetujui />
                  <Lists />
               </Card.Body>
               {jumlahUploadLampiran >= syarat.filter((e) => h.parse("syarat", e) === 1 && h.parse("wajib", e) === "t").length &&
                  ["", 3].includes(h.parse("status", init)) && (
                     <Card.Footer>
                        {h.buttons(`Daftar Seminar Proposal`, isLoadingButton, {
                           onClick: isLoadingButton ? null : submitDaftarSeminarProposal,
                        })}
                     </Card.Footer>
                  )}
               {jumlahUploadLampiran >= syarat.filter((e) => h.parse("syarat", e) === 1 && h.parse("wajib", e) === "t").length &&
                  [7].includes(h.parse("status", init)) && (
                     <Card.Footer>
                        {h.buttons(`Saya Sudah Menyelesaikan Seminar Proposal`, isLoadingButton, {
                           onClick: () => {
                              const confirm = h.confirm("Apakah benar anda telah melakukan seminar proposal?");
                              confirm.then((res) => {
                                 if (!res.isConfirmed) return;
                                 updateStatusTugasAkhir(8);
                              });
                           },
                        })}
                     </Card.Footer>
                  )}
               {jumlahUploadLampiran >= syarat.filter((e) => h.parse("syarat", e) === 1 && h.parse("wajib", e) === "t").length &&
                  [9].includes(h.parse("status", init)) && (
                     <Card.Footer>
                        {h.buttons(`Tandai Sudah Memperbaiki Seminar Proposal`, isLoadingButton, {
                           onClick: () => {
                              const confirm = h.confirm("Apakah anda yakin telah memperbaiki proposal?");
                              confirm.then((res) => {
                                 if (!res.isConfirmed) return;
                                 updateStatusTugasAkhir(10);
                              });
                           },
                        })}
                     </Card.Footer>
                  )}
            </Card>
         </div>
      </div>
   );
};
export default Context;
