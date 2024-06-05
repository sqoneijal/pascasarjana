import React from "react";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const Informasi = () => {
   const { init } = useSelector((e) => e.redux);

   switch (h.parse("status", init)) {
      case 22:
         return (
            <div className="alert alert-dismissible bg-light-primary d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-primary me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi</h4>
                  <span>Anda telah mendaftarkan diri untuk sidang munaqasyah. Menunggu persetujuan dari pembimbing.</span>
               </div>
            </div>
         );
      case 23:
      case 24:
         return (
            <div className="alert alert-dismissible bg-light-primary d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-primary me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi</h4>
                  <span>Menunggu penentuan jadwal dan tim penguji sidang munaqasyah.</span>
               </div>
            </div>
         );
      case 26:
         return (
            <div className="alert alert-dismissible bg-light-primary d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-primary me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi</h4>
                  <span>Anda telah menyatakan diri bahwa telah melaksanakan sidang munaqasyah. Menunggu persetujuan tim penguji/pembimbing.</span>
               </div>
            </div>
         );
      case 27:
         return (
            <div className="alert alert-dismissible bg-light-danger d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-danger me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi</h4>
                  <span>Tim pembimbing menyatakan ada perbaikan pada tesis/disertasi hasil sidang munaqasyah.</span>
               </div>
            </div>
         );
      case 28:
         return (
            <div className="alert alert-dismissible bg-light-primary d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-primary me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi</h4>
                  <span>Telah memperbaiki tesis/disertasi. Menunggu persetujuan dari tim penguji/pembimbing.</span>
               </div>
            </div>
         );
      case 29:
         return (
            <div className="alert alert-dismissible bg-light-primary d-flex flex-column flex-sm-row p-5 mb-10">
               <i className="ki-outline ki-notification-bing fs-2hx text-primary me-4 mb-5 mb-sm-0" />
               <div className="d-flex flex-column pe-0 pe-sm-10">
                  <h4 className="fw-semibold">Informasi</h4>
                  <span>
                     Sekarang anda sudah dapat mendaftar yudisium pada link{" "}
                     <a href="https://tracerstudy.ar-raniry.ac.id/daftar/yudisium">https://tracerstudy.ar-raniry.ac.id/daftar/yudisium</a>. Untuk
                     informasi lebih lanjut dapat menghubungi akademik.
                  </span>
               </div>
            </div>
         );
   }
};
export default Informasi;
