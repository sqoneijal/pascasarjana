import lozad from "lozad";
import React, { useLayoutEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as h from "~/Helpers";

const Header = () => {
   const { init } = useSelector((e) => e.redux);

   useLayoutEffect(() => {
      lozad().observe();
      return () => {};
   }, []);

   return (
      <div id="kt_header" className="header align-items-stretch mb-5 mb-lg-10">
         <div className="container-xxl d-flex align-items-center">
            <div className="d-flex topbar align-items-center d-lg-none ms-n2 me-3" title="Show aside menu">
               <div className="btn btn-icon btn-active-light-primary btn-custom w-30px h-30px w-md-40px h-md-40px" id="kt_header_menu_mobile_toggle">
                  <i className="ki-outline ki-abstract-14 fs-1" />
               </div>
            </div>
            <div className="header-logo me-5 me-md-10 flex-grow-1 flex-lg-grow-0">
               <Link to={`/`}>
                  <img alt="Logo" data-src={h.getFile("logo-uin.svg")} className="logo-default h-40px lozad" />
                  <img alt="Logo" data-src={h.getFile("logo-uin.svg")} className="logo-sticky h-40px lozad" />
               </Link>
            </div>
            <div className="d-flex align-items-stretch justify-content-between flex-lg-grow-1">
               <div className="d-flex align-items-stretch" id="kt_header_nav" />
               <div className="topbar d-flex align-items-stretch flex-shrink-0">
                  <Dropdown bsPrefix="d-flex align-items-center me-lg-n2 ms-1 ms-lg-3" align="end">
                     <Dropdown.Toggle as="div" bsPrefix="btn btn-icon btn-active-light-primary btn-custom w-30px h-30px w-md-40px h-md-40px">
                        <img className="h-30px w-30px rounded lozad" data-src={h.getFile("avatar-placeholder.png")} alt="avatar" />
                     </Dropdown.Toggle>
                     <Dropdown.Menu
                        renderOnMount={true}
                        bsPrefix="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px">
                        <div className="menu-item px-3">
                           <div className="menu-content d-flex align-items-center px-3">
                              <div className="symbol symbol-50px me-5">
                                 <img alt="avatar" className="lozad" data-src={h.getFile("avatar-placeholder.png")} />
                              </div>
                              <div className="d-flex flex-column">
                                 <div className="fw-bold d-flex align-items-center fs-5">{h.parse("nama", init)}</div>
                                 <a href="#" className="fw-semibold text-muted text-hover-primary fs-7">
                                    {h.parse("email", init)}
                                 </a>
                              </div>
                           </div>
                        </div>
                        <div className="separator my-2" />
                        <Dropdown.Item bsPrefix="menu-item px-5" as="div">
                           <Link to={"/profile"} className="menu-link px-5">
                              Profile
                           </Link>
                        </Dropdown.Item>
                        <Dropdown.Item bsPrefix="menu-item px-5" as="div">
                           <a href="/login/logout" className="menu-link px-5">
                              Sign Out
                           </a>
                        </Dropdown.Item>
                     </Dropdown.Menu>
                  </Dropdown>
               </div>
            </div>
         </div>
      </div>
   );
};
export default Header;
