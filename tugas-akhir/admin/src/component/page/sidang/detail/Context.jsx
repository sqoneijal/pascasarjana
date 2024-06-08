import React, { useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import Switch, { Case, Default } from "react-switch-case";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const StatusTugasAkhir = React.lazy(() => import("./StatusTugasAkhir"));
const Lampiran = React.lazy(() => import("./Lampiran"));
const JadwalSidang = React.lazy(() => import("./JadwalSidang"));
const PengujiSidang = React.lazy(() => import("./PengujiSidang"));
const FormsJadwalSidang = React.lazy(() => import("./FormsJadwalSidang"));
const Pembimbing = React.lazy(() => import("./Pembimbing"));
const FormsPengujiSidang = React.lazy(() => import("./FormsPengujiSidang"));

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
      setIsLoading(false);
      setTabActive(1);
   };

   const initPage = (nim) => {
      const formData = { nim };

      setIsLoading(true);
      const fetch = h.post(`/getdetailsidang`, formData);
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
      if (openDetail && h.objLength(detailContent)) initPage(h.parse("nim", detailContent));
      return () => {};
   }, [openDetail, detailContent]);

   const tabMenus = [
      { label: "Lampiran", value: 1 },
      { label: "Pembimbing", value: 2 },
      { label: "Jadwal Sidang", value: 3 },
      { label: "Penguji Sidang", value: 4 },
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
         <FormsJadwalSidang />
         <FormsPengujiSidang />
         {openDetail && <div className="drawer-overlay" />}
         <div className={`bg-white drawer drawer-start ${openDetail ? "drawer-on" : ""}`} style={{ width: window.innerWidth / 2 }}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Detail Sidang Munaqasyah</span>
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
                           <div className="tab-pane fade show active" role="tabpanel">
                              <Switch condition={tabActive}>
                                 <Case value={2}>
                                    <Pembimbing />
                                 </Case>
                                 <Case value={3}>
                                    <JadwalSidang />
                                 </Case>
                                 <Case value={4}>
                                    <PengujiSidang />
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
               {openDetail && tabActive === 3 && [23, 24, 25].includes(h.parse("status", detailContent)) && (
                  <Card.Footer className="text-end">
                     {h.buttons(`Tentukan Jadwal Sidang`, false, {
                        onClick: () => dispatch(setModule({ ...module, openFormsJadwalSidang: true })),
                     })}
                  </Card.Footer>
               )}
               {openDetail && tabActive === 4 && [24, 25].includes(h.parse("status", detailContent)) && (
                  <Card.Footer className="text-end">
                     {h.buttons(`Tentukan Tim Penguji`, false, {
                        onClick: () => dispatch(setModule({ ...module, openFormsPengujiSidang: true, pageType: "insert" })),
                     })}
                  </Card.Footer>
               )}
            </Card>
         </div>
      </React.Suspense>
   );
};
export default Context;
