import React, { useLayoutEffect, useState } from "react";
import { ButtonGroup, Card } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import Switch, { Case, Default } from "react-switch-case";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const StatusTugasAkhir = React.lazy(() => import("./StatusTugasAkhir"));
const Lampiran = React.lazy(() => import("./Lampiran"));
const JadwalDanPembimbing = React.lazy(() => import("./JadwalDanPembimbing"));
const SKPenelitian = React.lazy(() => import("./SKPenelitian"));
const FormsPenetapanSK = React.lazy(() => import("./FormsPenetapanSK"));
const FormsPembimbing = React.lazy(() => import("./FormsPembimbing"));

const Context = () => {
   const { module } = useSelector((e) => e.redux);
   const { openDetail, detailContent } = module;
   const dispatch = useDispatch();

   // bool
   const [isLoading, setIsLoading] = useState(true);

   // string
   const [tabActive, setTabActive] = useState(1);

   const handleClose = () => {
      dispatch(setModule({ ...module, openDetail: false, detailContent: {} }));
      setIsLoading(true);
      setTabActive(1);
   };

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

   const tabMenus = [
      { label: "Lampiran", value: 1 },
      { label: "Jadwal dan Pembimbing Seminar Proposal", value: 2 },
      { label: "SK Penelitian", value: 3 },
   ];

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
         <FormsPenetapanSK />
         <FormsPembimbing />
         {openDetail && <div className="drawer-overlay" />}
         <div className={`bg-white drawer drawer-start ${openDetail ? "drawer-on" : ""}`} style={{ width: window.innerWidth / 2 }}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Detail Proposal</span>
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
                              of={tabMenus}
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
                           <div className="tab-pane fade show active" id="kt_tab_pane_1" role="tabpanel">
                              <Switch condition={tabActive}>
                                 <Case value={2}>
                                    <JadwalDanPembimbing />
                                 </Case>
                                 <Case value={3}>
                                    <SKPenelitian />
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
               {[11, 12, 13].includes(h.parse("status", detailContent)) && tabActive === 3 && (
                  <Card.Footer className="text-end">
                     <ButtonGroup>
                        {h.buttons(`Penetapan SK Penelitian`, false, {
                           onClick: () => dispatch(setModule({ ...module, openFormsPenetpanSK: true })),
                        })}
                        {[12, 13].includes(h.parse("status", detailContent)) &&
                           h.buttons(`Tambah Dosen Pembimbing`, false, {
                              variant: "success",
                              onClick: () => dispatch(setModule({ ...module, openFormsPembimbing: true, pageType: "insert" })),
                           })}
                     </ButtonGroup>
                  </Card.Footer>
               )}
            </Card>
         </div>
      </React.Suspense>
   );
};
export default Context;
