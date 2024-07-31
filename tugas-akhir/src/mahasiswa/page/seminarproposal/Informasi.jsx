import React from "react";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const Informasi = () => {
   const { init } = useSelector((e) => e.redux);

   switch (h.parse("status", init)) {
      case 1:
      case 4:
         return (
            <div className="alert alert-dismissible bg-light-primary d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-primary me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi</h4>
                  <span>Pendaftaran seminar proposal anda sedang diverifikasi oleh akademik.</span>
               </div>
            </div>
         );
      case 3:
         return (
            <div className="alert alert-dismissible bg-light-danger d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-danger me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi Perbaikan</h4>
                  <span>Pihak akademik telah memverifikasi pendaftaran anda. Tetapi ada perbaikan yang harus anda selesaikan.</span>
               </div>
            </div>
         );
      case 5:
      case 6:
         return (
            <div className="alert alert-dismissible bg-light-primary d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-primary me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi</h4>
                  <span>Seminar proposal telah disetujui. Menunggu penentuan jadwal dan tim pembimbing seminar proposal.</span>
               </div>
            </div>
         );
      case 8:
      case 10:
         return (
            <div className="alert alert-dismissible bg-light-primary d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-primary me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi</h4>
                  <span>Menunggu persetujuan dari tim pembimbing seminar proposal.</span>
               </div>
            </div>
         );
      case 11:
      case 12:
         return (
            <div className="alert alert-dismissible bg-light-primary d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-primary me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi</h4>
                  <span>Menunggu pembuatan SK penelitian oleh akademik.</span>
               </div>
            </div>
         );
   }
};
export default Informasi;
