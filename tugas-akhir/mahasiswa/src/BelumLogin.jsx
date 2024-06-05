import lozad from "lozad";
import React, { useLayoutEffect } from "react";
import { Card } from "react-bootstrap";
import * as h from "~/Helpers";

const BelumLogin = () => {
   useLayoutEffect(() => {
      lozad().observe();

      const body = document.body;
      body.style.backgroundImage = `url(${h.getFile("bg-gagal-login.jpg")})`;
      return () => {};
   }, []);

   return (
      <div className="d-flex flex-column flex-root" id="kt_app_root">
         <div className="d-flex flex-column flex-center flex-column-fluid">
            <div className="d-flex flex-column flex-center text-center p-10">
               <Card className="card-flush w-md-650px py-5">
                  <Card.Body className="py-15 py-lg-20">
                     <div className="mb-7">
                        <span>
                           <img alt="Logo" data-src={h.getFile("logo-uin-dark.svg")} className="h-40px lozad" />
                        </span>
                     </div>
                     <h1 className="fw-bolder text-gray-900 mb-5">Anda belum melakukan login ke aplikasi</h1>
                     <div className="fw-semibold fs-6 text-gray-500 mb-7">
                        Untuk melanjutkan kehalaman dashboard
                        <br />
                        silahkan login terlebih dahulu dari portal SIAKAD anda.
                     </div>
                  </Card.Body>
               </Card>
            </div>
         </div>
      </div>
   );
};
export default BelumLogin;
