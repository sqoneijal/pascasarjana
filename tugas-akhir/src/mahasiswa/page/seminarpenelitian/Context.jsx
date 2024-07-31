import React, { useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const Lists = React.lazy(() => import("./Lists"));
const Informasi = React.lazy(() => import("./Informasi"));
const DaftarPembimbing = React.lazy(() => import("./DaftarPembimbing"));
const DaftarTimPembahas = React.lazy(() => import("./DaftarTimPembahas"));
const JadwalSeminarHasilPenelitian = React.lazy(() => import("./JadwalSeminarHasilPenelitian"));
const JudulProposal = React.lazy(() => import("./JudulProposal"));

const Context = () => {
   const { init, module } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   // bool
   const [isLoading, setIsLoading] = useState(true);
   const [isLoadingButton, setIsLoadingButton] = useState(false);

   // string
   const [jumlahUploadLampiran, setJumlahUploadLampiran] = useState(0);
   const [jumlahWajibUpload, setJumlahWajibUpload] = useState(0);

   const initPage = (nim) => {
      const formData = { nim };

      setIsLoading(true);
      const fetch = h.post(`/getdetailseminarpenelitian`, formData);
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
      initPage(h.parse("username", init));
      return () => {};
   }, [init]);

   useLayoutEffect(() => {
      if (!isLoading) {
         const { lampiranUpload } = module;
         const { syarat } = init;

         setJumlahWajibUpload(syarat.filter((e) => h.parse("wajib", e) === "t" && h.parse("syarat", e) === 2).length);

         let jumlah = 0;
         syarat
            .filter((e) => h.parse("wajib", e) === "t" && h.parse("syarat", e) === 2)
            .map((row) => {
               if (h.parse(h.parse("id", row), lampiranUpload)) {
                  jumlah++;
               }
            });
         setJumlahUploadLampiran(jumlah);
      }
      return () => {};
   }, [module, isLoading, init]);

   const updateStatusTugasAkhir = (status) => {
      const formData = { id_status_tugas_akhir: module.statusTugasAkhir.id, status };

      setIsLoadingButton(true);
      const fetch = h.post(`/updatestatustugasakhir`, formData);
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
         <div id="kt_content_container" className="d-flex flex-column-fluid align-items-start container-xxl">
            <div className="content flex-row-fluid" id="kt_content">
               <Card className="shadow-sm card-bordered">
                  <Card.Header>
                     <h3 className="card-title">PERSYARATAN SEMINAR HASIL PENELITIAN</h3>
                  </Card.Header>
                  <Card.Body>
                     <Informasi />
                     {[14, 15, 16, 17, 18, 19, 20].includes(h.parse("status", init)) && <DaftarPembimbing />}
                     {[17, 18, 19, 20].includes(h.parse("status", init)) && (
                        <React.Fragment>
                           <JadwalSeminarHasilPenelitian />
                           <DaftarTimPembahas />
                        </React.Fragment>
                     )}
                     <JudulProposal />
                     <Lists />
                  </Card.Body>
                  {jumlahUploadLampiran >= 7 && [13].includes(h.parse("status", init)) && (
                     <Card.Footer>
                        {h.buttons(`Daftar Seminar Hasil Penelitian`, isLoadingButton, {
                           onClick: () => (isLoadingButton ? null : updateStatusTugasAkhir(14)),
                        })}
                     </Card.Footer>
                  )}
                  {jumlahUploadLampiran >= 7 && [17].includes(h.parse("status", init)) && (
                     <Card.Footer>
                        {h.buttons(`Saya Telah Melaksanakan Seminar Hasil Penelitian`, isLoadingButton, {
                           onClick: () => {
                              const confirm = h.confirm("Apakah benar anda telah melaksanakan seminar hasil penelitian?");
                              confirm.then((res) => {
                                 if (!res.isConfirmed) return;
                                 updateStatusTugasAkhir(18);
                              });
                           },
                        })}
                     </Card.Footer>
                  )}
                  {jumlahUploadLampiran >= jumlahWajibUpload && [19].includes(h.parse("status", init)) && (
                     <Card.Footer>
                        {h.buttons(`Saya Telah Memperbaiki`, isLoadingButton, {
                           onClick: () => {
                              const confirm = h.confirm("Apakah benar anda telah memperbaikinya?");
                              confirm.then((res) => {
                                 if (!res.isConfirmed) return;
                                 updateStatusTugasAkhir(20);
                              });
                           },
                        })}
                     </Card.Footer>
                  )}
               </Card>
            </div>
         </div>
      </React.Suspense>
   );
};
export default Context;
