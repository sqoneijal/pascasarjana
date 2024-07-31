import React, { useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Switch, { Case, Default } from "react-switch-case";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";
import JadwalSeminar from "./JadwalSeminar";
import Lampiran from "./Lampiran";
import Pembimbing from "./Pembimbing";
import StatusTugasAkhir from "./StatusTugasAkhir";

const Context = () => {
   const { module } = useSelector((e) => e.redux);
   const { openDetail, detailContent } = module;
   const dispatch = useDispatch();

   // bool
   const [isLoading, setIsLoading] = useState(true);

   // string
   const [tabActive, setTabActive] = useState(1);

   const clearProps = () => {
      setIsLoading(true);
      setTabActive(1);
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

   const tabMenus = [
      { value: 1, label: "Lampiran" },
      { value: 2, label: "Jadwal Seminar Proposal" },
      { value: 3, label: "Pembimbing Seminar Proposal" },
   ];

   const renderCardFooter = (tabActive) => {
      return (
         <Switch condition={tabActive}>
            <Case value={2}>
               <Card.Footer className="text-end">
                  {h.buttons(`Perbaharui Jadwal Seminar`, false, {
                     onClick: () => dispatch(setModule({ ...module, openFormsJadwalSeminar: true })),
                  })}
               </Card.Footer>
            </Case>
            <Case value={3}>
               {h.objLength(module.jadwalSeminarProposal) && (
                  <Card.Footer className="text-end">
                     {h.buttons(`Tambah Pembimbing`, false, {
                        onClick: () => dispatch(setModule({ ...module, openFormsPembimbing: true, pageType: "insert" })),
                     })}
                  </Card.Footer>
               )}
            </Case>
         </Switch>
      );
   };

   return (
      <React.Fragment>
         {openDetail && <div className="drawer-overlay" />}
         <div className={`bg-white drawer drawer-start min-w-75 ${openDetail ? "drawer-on" : ""}`}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Detail Verifikasi Proposal Diterima</span>
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
                        <div className="mb-5 hover-scroll-x mt-5">
                           <div className="d-grid">
                              <ul className="nav nav-tabs flex-nowrap text-nowrap">
                                 <Each
                                    of={tabMenus}
                                    render={(row) => (
                                       <li className="nav-item">
                                          <a
                                             className={`nav-link btn btn-color-gray-600 rounded-bottom-0 fw-bold ${
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
                                 <Case value={2}>
                                    <JadwalSeminar />
                                 </Case>
                                 <Case value={3}>
                                    <Pembimbing />
                                 </Case>
                                 <Default>
                                    <Lampiran />
                                 </Default>
                              </Switch>
                           </div>
                        </div>
                     </React.Fragment>
                  )}
               </Card.Body>
               {renderCardFooter(tabActive)}
            </Card>
         </div>
      </React.Fragment>
   );
};
export default Context;
