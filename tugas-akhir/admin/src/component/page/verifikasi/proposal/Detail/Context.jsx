import React, { useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";
import Lampiran from "./Lampiran";
import StatusTugasAkhir from "./StatusTugasAkhir";

const Context = () => {
   const { module } = useSelector((e) => e.redux);
   const { openDetail, detailContent, statusApproveLampiran } = module;
   const dispatch = useDispatch();

   // bool
   const [isLoading, setIsLoading] = useState(true);

   // string
   const [jumlahValidasi, setJumlahValidasi] = useState(0);

   useLayoutEffect(() => {
      if (!isLoading && h.objLength(statusApproveLampiran)) {
         const unsetField = ["id", "id_lampiran"];
         let jumlah = 0;
         Object.keys(statusApproveLampiran).forEach((key) => {
            if (!unsetField.includes(key) && h.parse(key, statusApproveLampiran) !== "") {
               jumlah++;
            }
         });
         setJumlahValidasi(jumlah);
      }
      return () => {};
   }, [statusApproveLampiran, isLoading]);

   const handleClose = () => {
      dispatch(setModule({ ...module, openDetail: false, detailContent: {} }));
      setIsLoading(true);
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

   return (
      <React.Fragment>
         {openDetail && <div className="drawer-overlay" />}
         <div className={`bg-white drawer drawer-start ${openDetail ? "drawer-on" : ""}`} style={{ width: window.innerWidth / 2 }}>
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
                        <Lampiran />
                     </React.Fragment>
                  )}
               </Card.Body>
               {jumlahValidasi === 8 && (
                  <Card.Footer className="text-end">
                     {h.buttons(`Validasi`, false, {
                        onClick: () => dispatch(setModule({ ...module, openModalConfirmVerifikasi: true })),
                     })}
                  </Card.Footer>
               )}
            </Card>
         </div>
      </React.Fragment>
   );
};
export default Context;
