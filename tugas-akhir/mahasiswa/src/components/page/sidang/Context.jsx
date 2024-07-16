import React, { useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const Lists = React.lazy(() => import("./Lists"));
const Informasi = React.lazy(() => import("./Informasi"));
const DaftarPembimbing = React.lazy(() => import("./DaftarPembimbing"));
const DaftarPenguji = React.lazy(() => import("./DaftarPenguji"));
const JudulProposal = React.lazy(() => import("./JudulProposal"));

const Context = () => {
   const { init, module } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   // bool
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmit, setIsSubmit] = useState(false);

   // string
   const [jumlahSyaratWajib, setJumlahSyaratWajib] = useState(0);
   const [jumlahSyaratDiUpload, setJumlahSyaratDiUpload] = useState(0);

   useLayoutEffect(() => {
      if (!isLoading) {
         const { lampiranUpload } = module;
         const { syarat } = init;

         setJumlahSyaratWajib(syarat.filter((e) => h.parse("syarat", e) === 3 && h.parse("wajib", e) === "t").length);
         let jumlahUpload = 0;
         syarat
            .filter((e) => h.parse("syarat", e) === 3 && h.parse("wajib", e) === "t")
            .map((row) => {
               if (h.parse(h.parse("id", row), lampiranUpload)) {
                  jumlahUpload++;
               }
            });
         setJumlahSyaratDiUpload(jumlahUpload);
      }
      return () => {};
   }, [module, isLoading, init]);

   const initPage = (nim) => {
      const formData = { nim };

      setIsLoading(true);
      const fetch = h.post(`/getdetailmunaqasyah`, formData, {}, true);
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

   const submit = (id_status_tugas_akhir, status) => {
      const formData = { id_status_tugas_akhir, status };

      setIsSubmit(true);
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
         setIsSubmit(false);
      });
   };

   return (
      !isLoading && (
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
                        <h3 className="card-title">PERSYARATAN MUNAQASYAH TESIS/DISERTASI</h3>
                     </Card.Header>
                     <Card.Body>
                        <Informasi />
                        {[22, 23, 24, 25, 26, 27, 28, 29].includes(h.parse("status", init)) && <DaftarPembimbing />}
                        {[25, 26, 27, 28, 29].includes(h.parse("status", init)) && <DaftarPenguji />}
                        <JudulProposal />
                        <Lists />
                     </Card.Body>
                     {!isLoading && [21].includes(h.parse("status", init)) && jumlahSyaratDiUpload >= jumlahSyaratWajib && (
                        <Card.Footer>
                           {h.buttons(`Daftar Sidang Munaqasyah`, isSubmit, {
                              onClick: () => (isSubmit ? null : submit(module.statusTugasAkhir.id, 22)),
                           })}
                        </Card.Footer>
                     )}
                     {!isLoading && [25].includes(h.parse("status", init)) && (
                        <Card.Footer>
                           {h.buttons(`Saya Telah Melaksanakan Sidang Munaqasyah`, isSubmit, {
                              onClick: () => {
                                 h.confirm("Apakah benar anda telah melaksanakan sidang munaqasyah?").then((res) => {
                                    const { isConfirmed } = res;
                                    if (isConfirmed) submit(module.statusTugasAkhir.id, 26);
                                 });
                              },
                           })}
                        </Card.Footer>
                     )}
                     {!isLoading && [27].includes(h.parse("status", init)) && (
                        <Card.Footer>
                           {h.buttons(`Saya Telah Memperbaiki Tesis/Disertasi`, isSubmit, {
                              onClick: () => {
                                 h.confirm("Apakah benar anda telah memperbaiki tesis/disertasi?").then((res) => {
                                    const { isConfirmed } = res;
                                    if (isConfirmed) submit(module.statusTugasAkhir.id, 28);
                                 });
                              },
                           })}
                        </Card.Footer>
                     )}
                     {!isLoading && [30].includes(h.parse("status", init)) && (
                        <Card.Footer>
                           {h.buttons(`Saya Telah Memperbaiki`, isSubmit, {
                              onClick: () => {
                                 h.confirm("Apakah benar anda telah memperbaiki lampiran yang diminta?").then((res) => {
                                    const { isConfirmed } = res;
                                    if (isConfirmed) submit(module.statusTugasAkhir.id, 31);
                                 });
                              },
                           })}
                        </Card.Footer>
                     )}
                  </Card>
               </div>
            </div>
         </React.Suspense>
      )
   );
};
export default Context;
