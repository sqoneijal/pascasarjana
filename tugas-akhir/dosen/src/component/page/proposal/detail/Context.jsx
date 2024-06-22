import moment from "moment";
import React, { useLayoutEffect, useState } from "react";
import { ButtonGroup, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Switch, { Case } from "react-switch-case";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";
import FormsPerbaiki from "./FormsPerbaiki";
import FormsSudahSeminar from "./FormsSudahSeminar";
import JadwalSeminar from "./JadwalSeminar";
import Lampiran from "./Lampiran";
import StatusTugasAkhir from "./StatusTugasAkhir";
import TimPembimbing from "./TimPembimbing";

const Context = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openDetail, detailContent, pembimbing } = module;
   const dispatch = useDispatch();

   // bool
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmit, setIsSubmit] = useState(false);

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
      { value: 2, label: "Jadwal Seminar" },
      { value: 3, label: "Tim Pembimbing" },
   ];

   const submit = (e) => {
      e.preventDefault();
      const findRow = {};
      pembimbing.forEach((row) => {
         if (row.nidn === init.username) {
            Object.assign(findRow, row);
         }
      });

      if (h.parse("pembimbing_ke", findRow) === 1) {
         dispatch(setModule({ ...module, openFormsSudahSeminar: true }));
         return;
      }

      const formData = {
         nim: h.parse("nim", detailContent),
         id_periode: h.parse("id_periode", detailContent),
         nidn: h.parse("username", init),
         id_status_tugas_akhir: h.parse("id_status_tugas_akhir", detailContent),
      };

      setIsSubmit(true);
      const fetch = h.post(`/updatestatustesis`, formData);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         h.notification(data.status, data.msg_response);

         if (!data.status) return;

         dispatch(setModule({ ...module, status_tugas_akhir: data.content }));
         h.dtReload();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <React.Fragment>
         {openDetail && <div className="drawer-overlay" />}
         <div className={`bg-white drawer drawer-start min-w-75 ${openDetail ? "drawer-on" : ""}`}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Detail Seminar Proposal</span>
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
                        <FormsPerbaiki />
                        <StatusTugasAkhir />
                        <FormsSudahSeminar />
                        <div className="mb-5 hover-scroll-x mt-5">
                           <div className="d-grid">
                              <ul className="nav nav-tabs flex-nowrap text-nowrap">
                                 <Each
                                    of={tabMenus}
                                    render={(row) => (
                                       <li className="nav-item">
                                          <a
                                             className={`nav-link btn fw-bold btn-color-gray-600 rounded-bottom-0 ${
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
                                    <JadwalSeminar />
                                 </Case>
                                 <Case value={3}>
                                    <TimPembimbing />
                                 </Case>
                              </Switch>
                           </div>
                        </div>
                     </React.Fragment>
                  )}
               </Card.Body>
               {!isLoading && h.parse("jadwal_seminar", module) && moment().isSameOrAfter(module.jadwal_seminar.tanggal_seminar) && (
                  <Card.Footer className="text-end">
                     <ButtonGroup>
                        {h.buttons(`Sudah Melaksanakan Seminar Proposal`, isSubmit, {
                           onClick: isSubmit ? null : submit,
                        })}
                        {h.buttons(`Perbaiki`, false, {
                           variant: "danger",
                           onClick: () => dispatch(setModule({ ...module, openFormsPerbaiki: true })),
                        })}
                     </ButtonGroup>
                  </Card.Footer>
               )}
            </Card>
         </div>
      </React.Fragment>
   );
};
export default Context;
