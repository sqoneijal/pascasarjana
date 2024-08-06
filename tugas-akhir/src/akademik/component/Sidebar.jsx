import lozad from "lozad";
import React, { useLayoutEffect, useState } from "react";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { position, filter as setFilter, setModule, sidebarMinize as setSidebarMinize, showButton } from "~/redux";
import navigation from "./navigation.json";

const Sidebar = () => {
   const { init, sidebarMinize } = useSelector((e) => e.redux);
   const location = useLocation();
   const dispatch = useDispatch();

   // string
   const [showAccordion, setShowAccordion] = useState("");

   useLayoutEffect(() => {
      const split = location.pathname.split("/");
      setShowAccordion(split[1]);
      return () => {};
   }, [location]);

   const handleClickMenu = (pathname, data) => {
      if (pathname === h.parse("link", data)) return;

      document.title = h.parse("label", data);
      dispatch(setModule({}));
      dispatch(setFilter({}));
      dispatch(position([]));
      dispatch(showButton(false));
   };

   useLayoutEffect(() => {
      lozad().observe();
      return () => {};
   }, []);

   const renderParentMenu = (data) => {
      return (
         <button
            className="menu-item"
            onClick={() => handleClickMenu(location.pathname, data)}
            style={{ background: "transparent", border: "unset" }}>
            <Link to={h.parse("link", data)} className={`menu-link ${location.pathname === h.parse("link", data) ? "active" : ""}`}>
               <span className="menu-icon">
                  <i className={h.parse("icon", data)} />
               </span>
               <span className="menu-title">{h.parse("label", data)}</span>
            </Link>
         </button>
      );
   };

   const renderParentAndSubMenu = (data) => {
      return (
         <Dropdown as="div" bsPrefix={`menu-item menu-accordion ${showAccordion === h.parse("link", data) ? "hover show" : ""}`}>
            <Dropdown.Toggle as="div" bsPrefix={`menu-link ${showAccordion === h.parse("link", data) ? "active" : ""}`}>
               <span className="menu-icon">
                  <i className={h.parse("icon", data)} />
               </span>
               <span className="menu-title">{h.parse("label", data)}</span>
               <span className="menu-arrow" />
            </Dropdown.Toggle>
            <div className="menu-sub menu-sub-accordion">
               <Each of={data.child} render={(row) => renderSubMenu(row)} />
            </div>
         </Dropdown>
      );
   };

   const renderSubMenu = (data) => {
      return (
         <div className={`menu-item ${renderActiveLink(location.pathname, data)}`}>
            <Link
               to={h.parse("link", data)}
               className={`menu-link ${renderActiveLink(location.pathname, data)}`}
               onClick={() => handleClickMenu(location.pathname, data)}>
               <span className="menu-bullet">
                  <span className="bullet bullet-dot" />
               </span>
               <span className="menu-title">{h.parse("label", data)}</span>
            </Link>
         </div>
      );
   };

   const renderActiveLink = (pathname, data) => {
      return pathname === h.parse("link", data) ? "active" : "";
   };

   const handleSidebarToggle = () => {
      if (sidebarMinize === "off") {
         dispatch(setSidebarMinize("on"));
      } else {
         dispatch(setSidebarMinize("off"));
      }
   };

   return (
      <div id="kt_app_sidebar" className="app-sidebar flex-column">
         <div className="app-sidebar-logo px-6" id="kt_app_sidebar_logo">
            <Link to="/">
               <img alt="Logo" data-src="/assets/logo-uin-dark.png" className="h-40px app-sidebar-logo-default theme-light-show lozad" />
               <img alt="Logo" data-src="/assets/logo-uin-dark.png" className="h-40px app-sidebar-logo-default theme-dark-show lozad" />
               <img alt="Logo" data-src="/assets/logo-uin-small.png" className="h-20px app-sidebar-logo-minimize lozad" />
            </Link>
            <button
               id="kt_app_sidebar_toggle"
               className="app-sidebar-toggle btn btn-icon btn-shadow btn-sm btn-color-muted btn-active-color-primary h-30px w-30px position-absolute top-50 start-100 translate-middle rotate"
               onClick={handleSidebarToggle}>
               <i className={`ki-outline ${sidebarMinize === "on" ? "ki-black-right-line" : "ki-black-left-line"} fs-3 rotate-180`} />
            </button>
         </div>
         <div className="app-sidebar-menu overflow-hidden flex-column-fluid">
            <div className="aside-toolbar flex-column-auto ms-5 me-5">
               <div className="aside-user d-flex align-items-sm-center justify-content-center py-5">
                  <Link to={"/admin/profile"} className="symbol symbol-50px">
                     <img src={`/admin/profile/avatar?name=${h.parse("avatar", init)}`} alt={h.parse("nama", init)} />
                  </Link>
                  <div className="aside-user-info flex-row-fluid flex-wrap ms-5">
                     <div className="d-flex">
                        <Link to="/admin/profile" className="flex-grow-1 me-2">
                           <span className="text-gray-800 text-hover-primary fs-6 fw-bold">{h.parse("nama", init)}</span>
                           <span className="text-gray-600 fw-semibold d-block fs-8 mb-1">{h.userRole(h.parse("role", init))}</span>
                        </Link>
                        <div className="me-n2">
                           <OverlayTrigger overlay={<Tooltip>Logout</Tooltip>} placement="right-end">
                              <a href="/logout" className="btn btn-icon btn-sm btn-active-color-primary mt-n2 fw-bold">
                                 <i className="ki-outline ki-exit-left text-muted fs-1" />
                              </a>
                           </OverlayTrigger>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div id="kt_app_sidebar_menu_wrapper" className="app-sidebar-wrapper">
               <div id="kt_app_sidebar_menu_scroll" className="scroll-y my-5 mx-3" style={{ height: window.innerHeight }}>
                  <div className="menu menu-column menu-rounded menu-sub-indention fw-semibold fs-6" id="#kt_app_sidebar_menu">
                     <Each of={navigation} render={(row) => (row.sub ? renderParentAndSubMenu(row) : renderParentMenu(row))} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
export default Sidebar;
