import React, { useLayoutEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import * as h from "~/Helpers";
import { setInit } from "~/redux";
import Routing from "./Routing";

const Headers = React.lazy(() => import("./component/Headers"));
const Sidebar = React.lazy(() => import("./component/Sidebar"));

const Context = () => {
   const { sidebarMinize } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   // bool
   const [isLoading, setIsLoading] = useState(true);

   const initPage = () => {
      const fetch = h.get(`/init`, {}, true);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;

         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         if (h.parse("id", data)) {
            dispatch(setInit({ ...data }));
         } else {
            h.notification(false, "Silahkan melakukan login ulang.");
         }
      });
      fetch.finally(() => {
         setIsLoading(false);
      });
   };

   useLayoutEffect(() => {
      const body = document.body;
      body.classList.add("app-default");
      body.setAttribute("data-kt-app-sidebar-minimize", sidebarMinize);
      body.setAttribute("data-kt-app-layout", "light-sidebar");
      body.setAttribute("data-kt-app-header-fixed", "true");
      body.setAttribute("data-kt-app-sidebar-enabled", "true");
      body.setAttribute("data-kt-app-sidebar-fixed", "true");
      body.setAttribute("data-kt-app-sidebar-hoverable", "true");
      body.setAttribute("data-kt-app-sidebar-push-header", "true");
      body.setAttribute("data-kt-app-sidebar-push-toolbar", "true");
      body.setAttribute("data-kt-app-sidebar-push-footer", "true");
      body.setAttribute("data-kt-app-toolbar-enabled", "true");

      if (window.top != window.self) {
         window.top.location.replace(window.self.location.href);
      }

      const defaultThemeMode = "light";
      let themeMode;

      if (document.documentElement) {
         if (document.documentElement.hasAttribute("data-bs-theme-mode")) {
            themeMode = document.documentElement.getAttribute("data-bs-theme-mode");
         } else {
            themeMode = localStorage.getItem("data-bs-theme") !== null ? localStorage.getItem("data-bs-theme") : defaultThemeMode;
         }

         if (themeMode === "system") {
            themeMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
         }

         document.documentElement.setAttribute("data-bs-theme", themeMode);
      }

      initPage();
      return () => {};
   }, [sidebarMinize]);

   const loader = (
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
   );

   return isLoading ? (
      loader
   ) : (
      <React.Suspense fallback={loader}>
         <BrowserRouter basename="dosen">
            <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
               <Headers />
               <div className="app-wrapper flex-column flex-row-fluid">
                  <Sidebar />
                  <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
                     <div className="d-flex flex-column flex-column-fluid">
                        <div id="kt_app_content" className="app-content flex-column-fluid ">
                           <Container fluid id="kt_app_content_container" className="app-container">
                              <Routing />
                           </Container>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </BrowserRouter>
      </React.Suspense>
   );
};
export default Context;
