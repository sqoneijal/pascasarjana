import React from "react";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const Informasi = () => {
   const { init } = useSelector((e) => e.redux);

   return (
      <React.Fragment>
         {[14].includes(h.parse("status", init)) && (
            <div className="alert alert-dismissible bg-light-primary d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-primary me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi</h4>
                  <span>Menunggu persetujuan dari tim pembimbing penelitian.</span>
               </div>
            </div>
         )}
         {[15, 16].includes(h.parse("status", init)) && (
            <div className="alert alert-dismissible bg-light-primary d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-primary me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi</h4>
                  <span>Menunggu penentuan jadwal dan tim pembahas hasil seminar penelitian.</span>
               </div>
            </div>
         )}
         {[18, 20].includes(h.parse("status", init)) && (
            <div className="alert alert-dismissible bg-light-primary d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-primary me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi</h4>
                  <span>Menunggu persetujuan dari tim pembahas hasil penelitian.</span>
               </div>
            </div>
         )}
         {[19].includes(h.parse("status", init)) && (
            <div className="alert alert-dismissible bg-light-danger d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-danger me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi Perbaikan</h4>
                  <span>Ada perbaikan pada hasil penelitian anda.</span>
               </div>
            </div>
         )}
      </React.Fragment>
   );
};
export default Informasi;
