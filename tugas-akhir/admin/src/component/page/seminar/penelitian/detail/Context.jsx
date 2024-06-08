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
const JadwalSeminarPenelitian = React.lazy(() => import("./JadwalSeminarPenelitian"));
const ModalJadwalSeminarPenelitian = React.lazy(() => import("./ModalJadwalSeminarPenelitian"));
const FormsPenguji = React.lazy(() => import("./FormsPenguji"));

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

   const handleClose = () => {
      dispatch(setModule({ ...module, openDetail: false, detailContent: {} }));
      setIsLoading(true);
      setTabActive(1);
   };

   useLayoutEffect(() => {
      if (openDetail && h.objLength(detailContent)) getDetail(h.parse("id", detailContent));
      return () => {};
   }, [openDetail, detailContent]);

   const tabMenus = [
      { label: "Lampiran", value: 1 },
      { label: "Jadwal dan Pembimbing Seminar Proposal", value: 2 },
      { label: "SK Penelitian", value: 3 },
      { label: "Jadwal dan Tim Penguji Penelitian", value: 4 },
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
         <ModalJadwalSeminarPenelitian />
         <FormsPenguji />
         {openDetail && <div className="drawer-overlay" />}
         <div className={`bg-white drawer drawer-start ${openDetail ? "drawer-on" : ""}`} style={{ width: `80%` }}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Detail Penelitian</span>
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
                                    <JadwalDanPembimbing />
                                 </Case>
                                 <Case value={3}>
                                    <SKPenelitian />
                                 </Case>
                                 <Case value={4}>
                                    <JadwalSeminarPenelitian />
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
               {tabActive === 4 && (
                  <Card.Footer className="text-end">
                     <ButtonGroup>
                        {[15, 16, 17].includes(h.parse("status", detailContent)) &&
                           h.buttons(`Penentuan Jadwal`, false, {
                              variant: "success",
                              onClick: () => dispatch(setModule({ ...module, openModalJadwalSeminarPenelitian: true })),
                           })}
                        {[16, 17].includes(h.parse("status", detailContent)) &&
                           h.buttons(`Tambah Tim Penguji`, false, {
                              onClick: () => dispatch(setModule({ ...module, openFormsPengujiPenelitian: true, pageType: "insert" })),
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
