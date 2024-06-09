import lozad from "lozad";
import React, { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const Headers = () => {
   const { position, showButton, buttonConfig, module } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   useLayoutEffect(() => {
      lozad().observe();
      return () => {};
   }, []);

   const renderBreadcrumb = (position) => {
      return h.objLength(position) ? (
         <React.Fragment>
            <span className="h-20px border-gray-300 border-start mx-4" />
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
               <Each
                  of={position}
                  render={(row, index) => (
                     <React.Fragment key={index}>
                        <li className="breadcrumb-item text-muted">{row}</li>
                        {index < position.length - 1 && (
                           <li className="breadcrumb-item">
                              <span className="bullet bg-gray-500 w-5px h-2px" />
                           </li>
                        )}
                     </React.Fragment>
                  )}
               />
            </ul>
         </React.Fragment>
      ) : null;
   };

   return (
      <div id="kt_app_header" className="app-header">
         <div className="app-container container-fluid d-flex align-items-stretch justify-content-between" id="kt_app_header_container">
            <div className="d-flex align-items-center d-lg-none ms-n3 me-1 me-md-2" title="Show sidebar menu">
               <div className="btn btn-icon btn-active-color-primary w-35px h-35px" id="kt_app_sidebar_mobile_toggle">
                  <i className="ki-outline ki-abstract-14 fs-2 fs-md-1" />
               </div>
            </div>
            <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
               <Link to="/" className="d-lg-none">
                  <img alt="Logo" src={h.getFile("logo-uin-small.png")} className="h-30px lozad" />
               </Link>
            </div>
            <div className="d-flex align-items-stretch justify-content-between flex-lg-grow-1" id="kt_app_header_wrapper">
               <div className="page-title d-flex align-items-center flex-wrap me-3 mb-5 mb-lg-0">
                  <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 align-items-center my-0">{document.title}</h1>
                  {renderBreadcrumb(position)}
               </div>
               <div className="app-navbar flex-shrink-0">
                  <div className="app-navbar-item ms-1 ms-md-4" id="kt_header_user_menu_toggle">
                     {showButton &&
                        h.buttons(h.parse("label", buttonConfig), false, {
                           variant: h.parse("variant", buttonConfig),
                           onClick: () => dispatch(setModule({ ...buttonConfig.init })),
                        })}
                  </div>
                  <div className="app-navbar-item d-lg-none ms-2 me-n2" title="Show header menu">
                     <div className="btn btn-flex btn-icon btn-active-color-primary w-30px h-30px" id="kt_app_header_menu_toggle">
                        <i className="ki-outline ki-element-4 fs-1" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
export default Headers;
