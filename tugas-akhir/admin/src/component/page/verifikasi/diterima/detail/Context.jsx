import React, { useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Switch, { Case } from "react-switch-case";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";
import DaftarPembimbing from "./DaftarPembimbing";
import FormsJadwalSeminar from "./FormsJadwalSeminar";
import FormsPembimbing from "./FormsPembimbing";
import JadwalSeminar from "./JadwalSeminar";
import Lampiran from "./Lampiran";
import StatusTugasAkhir from "./StatusTugasAkhir";

const Context = () => {
   const { module } = useSelector((e) => e.redux);
   const { openDetail, detailContent } = module;
   const dispatch = useDispatch();

   // bool
   const [isLoading, setIsLoading] = useState(true);

   // string
   const [tabActive, setTabActive] = useState(1);

   const getDetail = (id_status_tugas_akhir) => {
      const formData = { id_status_tugas_akhir };

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
      if (openDetail && h.objLength(detailContent)) getDetail(h.parse("id", detailContent));
      return () => {};
   }, [openDetail, detailContent]);

   const handleClose = () => {
      dispatch(setModule({ ...module, openDetail: false, detailContent: {} }));
      setIsLoading(true);
      setTabActive(1);
   };

   const arrayTabs = [
      { value: 1, label: "Lampiran" },
      { value: 2, label: "Tim Pembimbing" },
      { value: 3, label: "Jadwal Seminar" },
   ];

   return (
      <React.Fragment>
         <FormsPembimbing />
         <FormsJadwalSeminar />
         {openDetail && <div className="drawer-overlay" />}
         <div className={`bg-white drawer drawer-start ${openDetail ? "drawer-on" : ""}`} style={{ width: window.innerWidth - 400 }}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Detail Verifikasi Proposal</span>
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
                        <StatusTugasAkhir />
                        <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6 mt-5">
                           <Each
                              of={arrayTabs}
                              render={(row) => (
                                 <li className="nav-item">
                                    <a
                                       className={`nav-link ${tabActive === h.parse("value", row) ? "active" : ""}`}
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
                        <div className="tab-content">
                           <div className="tab-pane fade show active" role="tabpanel">
                              <Switch condition={tabActive}>
                                 <Case value={1}>
                                    <Lampiran />
                                 </Case>
                                 <Case value={2}>
                                    <DaftarPembimbing />
                                 </Case>
                                 <Case value={3}>
                                    <JadwalSeminar />
                                 </Case>
                              </Switch>
                           </div>
                        </div>
                     </React.Fragment>
                  )}
               </Card.Body>
               {!isLoading && (
                  <Switch condition={tabActive}>
                     <Case value={2}>
                        <Card.Footer className="text-end">
                           {h.buttons(`Tambah Tim Pembimbing`, false, {
                              onClick: () => dispatch(setModule({ ...module, openFormsPembimbing: true, pageType: "insert" })),
                           })}
                        </Card.Footer>
                     </Case>
                     <Case value={3}>
                        <Card.Footer className="text-end">
                           {h.buttons(`Perbaharui Jadwal Seminar`, false, {
                              onClick: () => dispatch(setModule({ ...module, openFormsJadwalSeminar: true })),
                           })}
                        </Card.Footer>
                     </Case>
                  </Switch>
               )}
            </Card>
         </div>
      </React.Fragment>
   );
};
export default Context;
