import moment from "moment";
import React from "react";

const Footer = () => {
   return (
      <div className="footer py-4 d-flex flex-lg-column" id="kt_footer">
         <div className="container-xxl d-flex flex-column flex-md-row align-items-center justify-content-between">
            <div className="text-gray-900 order-2 order-md-1">
               <span className="text-muted fw-semibold me-1">{moment().format("YYYY")}©</span>
               <a href="https://t.me/sqoneijal" target="_blank" className="text-gray-800 text-hover-primary">
                  Sistem Informasi Tugas Akhir
               </a>
            </div>
         </div>
      </div>
   );
};
export default Footer;
