import React, { useLayoutEffect } from "react";
import { Bars } from "react-loader-spinner";

const Forms = React.lazy(() => import("./Forms"));

const Context = () => {
   useLayoutEffect(() => {
      const body = document.body;
      body.classList.add("app-blank");
      body.style.backgroundImage = "url('/assets/bg4.jpg')";
      return () => {};
   }, []);

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
         <div className="d-flex flex-column flex-column-fluid flex-lg-row">
            <div className="d-flex flex-center w-lg-50 pt-15 pt-lg-0 px-10">
               <div className="d-flex flex-center flex-lg-start flex-column">
                  <a className="mb-7">
                     <img alt="Logo" data-src="/assets/logo-uin.png" className="lozad" />
                  </a>
               </div>
            </div>
            <div className="d-flex flex-column-fluid flex-lg-row-auto justify-content-center justify-content-lg-end p-12 p-lg-20">
               <div className="bg-body d-flex flex-column align-items-stretch flex-center rounded-4 w-md-600px p-20">
                  <div className="d-flex flex-center flex-column flex-column-fluid px-lg-10 pb-15 pb-lg-20">
                     <Forms />
                  </div>
               </div>
            </div>
         </div>
      </React.Suspense>
   );
};
export default Context;
