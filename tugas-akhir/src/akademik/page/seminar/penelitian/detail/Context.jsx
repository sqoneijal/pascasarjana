import React, { useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import Switch, { Case } from "react-switch-case";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";
import FormsJadwalSeminar from "./FormsJadwalSeminar";
import FormsLampiranTidakValid from "./FormsLampiranTidakValid";
import FormsPenguji from "./FormsPenguji";
import Identitas from "./Identitas";
import JadwalSeminar from "./JadwalSeminar";
import Lampiran from "./Lampiran";
import SKPenelitian from "./SKPenelitian";
import TimPembimbing from "./TimPembimbing";
import TimPenguji from "./TimPenguji";

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
      { value: 2, label: "SK Penelitian" },
      { value: 3, label: "Tim Pembimbing" },
      { value: 4, label: "Jadwal Seminar Hasil Penelitian" },
      { value: 5, label: "Tim Penguji" },
   ];

   return (
      <React.Fragment>
         {openDetail && <div className="drawer-overlay" />}
         <div className={`bg-white drawer drawer-start min-w-75 ${openDetail ? "drawer-on" : ""}`}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Detail Seminar Hasil Penelitian</span>
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
                  {isLoading ? (
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
                                    <FormsLampiranTidakValid />
                                    <Lampiran />
                                 </Case>
                                 <Case value={2}>
                                    <SKPenelitian />
                                 </Case>
                                 <Case value={3}>
                                    <TimPembimbing />
                                 </Case>
                                 <Case value={4}>
                                    <JadwalSeminar />
                                    <FormsJadwalSeminar />
                                 </Case>
                                 <Case value={5}>
                                    <TimPenguji />
                                    <FormsPenguji />
                                 </Case>
                              </Switch>
                           </div>
                        </div>
                     </React.Fragment>
                  )}
               </Card.Body>
               {tabActive === 4 && (
                  <Card.Footer className="text-end">
                     {h.buttons(`Perbaharui Jadwal Seminar Hasil Penelitian`, false, {
                        onClick: () => dispatch(setModule({ ...module, openFormsJadwalSeminar: true })),
                     })}
                  </Card.Footer>
               )}
               {tabActive === 5 && (
                  <Card.Footer className="text-end">
                     {h.buttons(`Tambah Tim Penguji`, false, {
                        onClick: () => dispatch(setModule({ ...module, openFormsPenguji: true, pageType: "insert" })),
                     })}
                  </Card.Footer>
               )}
            </Card>
         </div>
      </React.Fragment>
   );
};
export default Context;
