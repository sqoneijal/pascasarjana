import React, { useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Switch, { Case } from "react-switch-case";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";
import Identitas from "./Identitas";
import Lampiran from "./Lampiran";
import SKPenelitian from "./SKPenelitian";
import TimPembimbing from "./TimPembimbing";
import TimPenguji from "./TimPenguji";

const Context = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openDetail, detailContent } = module;
   const dispatch = useDispatch();

   // bool
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmit, setIsSubmit] = useState(false);

   // string
   const [tabActive, setTabActive] = useState(1);

   const clearProps = () => {
      setIsLoading(true);
      setTabActive(1);
      setIsSubmit(false);
   };

   const handleClose = () => {
      dispatch(setModule({ ...module, openDetail: false, detailContent: {} }));
      clearProps();
   };

   const getDetail = (nim, id_periode) => {
      const formData = { nim, id_periode };

      setIsLoading(true);
      const fetch = h.post(`/getdetail`, formData);
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
      if (openDetail && h.objLength(detailContent)) getDetail(h.parse("nim", detailContent), h.parse("id_periode", detailContent));
      return () => {};
   }, [openDetail, detailContent]);

   const submit = (e) => {
      e.preventDefault();
      const formData = {
         nim: h.parse("nim", detailContent),
         id_periode: h.parse("id_periode", detailContent),
         id_status_tugas_akhir: h.parse("id_status_tugas_akhir", detailContent),
         status: h.parse("status", detailContent),
         nidn: init.username,
      };

      setIsSubmit(true);
      const fetch = h.post(`/submitlanjutsidang`, formData);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         h.notification(data.status, data.msg_response);

         if (!data.status) return;

         if (data.status_tesis === 23) {
            dispatch(setModule({ ...module, openDetail: false, detailContent: {} }));
            clearProps();
            h.dtReload();
            return;
         }

         dispatch(setModule({ ...module, pembimbing: data.content, detailContent: { ...detailContent, status: data.status_tesis } }));
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   const tabMenus = [
      { value: 1, label: "Lampiran" },
      { value: 2, label: "SK Penelitian" },
      { value: 3, label: "Tim Pembimbing" },
      { value: 4, label: "Tim Penguji" },
   ];

   return (
      <React.Fragment>
         {openDetail && <div className="drawer-overlay" />}
         <div className={`bg-white drawer drawer-start min-w-75 ${openDetail ? "drawer-on" : ""}`}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Detail Pengajuan Sidang Munaqasyah</span>
                     </div>
                  </div>
                  <div className="card-toolbar">
                     <button className="btn btn-sm btn-icon btn-active-light-primary" onClick={handleClose}>
                        <i className="ki-duotone ki-cross fs-2">
                           <span className="path1" />
                           <span className="path2" />
                        </i>
                     </button>
                  </div>
               </Card.Header>
               <Card.Body className="hover-scroll-overlay-y">
                  {!isLoading && (
                     <React.Fragment>
                        <Identitas />
                        <div className="mb-5 hover-scroll-x mt-5">
                           <div className="d-grid">
                              <ul className="nav nav-tabs flex-nowrap text-nowrap">
                                 <Each
                                    of={tabMenus}
                                    render={(row) => (
                                       <li className="nav-item">
                                          <a
                                             className={`nav-link btn btn-color-gray-600 fw-bold rounded-bottom-0 ${
                                                tabActive === h.parse("value", row) ? "btn-active-light btn-active-color-primary" : ""
                                             }`}
                                             data-bs-toggle="tab"
                                             href="#"
                                             onClick={(e) => {
                                                e.preventDefault();
                                                setTabActive(h.parse("value", row));
                                             }}>
                                             {h.parse("label", row)}
                                          </a>
                                       </li>
                                    )}
                                 />
                              </ul>
                           </div>
                        </div>
                        <div className="tab-content">
                           <div className="tab-pane fade show active" role="tabpanel">
                              <Switch condition={tabActive}>
                                 <Case value={1}>
                                    <Lampiran />
                                 </Case>
                                 <Case value={2}>
                                    <SKPenelitian />
                                 </Case>
                                 <Case value={3}>
                                    <TimPembimbing />
                                 </Case>
                                 <Case value={4}>
                                    <TimPenguji />
                                 </Case>
                              </Switch>
                           </div>
                        </div>
                     </React.Fragment>
                  )}
               </Card.Body>
               <Card.Footer className="text-end">
                  {h.buttons(`Setujui Untuk Lanjut Sidang`, isSubmit, {
                     onClick: isSubmit ? null : submit,
                  })}
               </Card.Footer>
            </Card>
         </div>
      </React.Fragment>
   );
};
export default Context;
