import { configureStore } from "@reduxjs/toolkit";
import React, { useLayoutEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { createRoot } from "react-dom/client";
import { Bars } from "react-loader-spinner";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import * as h from "~/Helpers";
import redux, { setInit } from "./redux";

import "./assets/custom.css";
import "./assets/plugins.bundle.css";
import "./assets/style.bundle.css";

const Headers = React.lazy(() => import("./component/Headers"));
const Sidebar = React.lazy(() => import("./component/Sidebar"));
const Routing = React.lazy(() => import("./component/Routing"));

const App = () => {
   const dispatch = useDispatch();

   // bool
   const [isLoading, setIsLoading] = useState(true);

   const initPage = () => {
      const fetch = h.get(`/login/init`, {}, true);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;

         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         dispatch(setInit({ ...data }));
      });
      fetch.finally(() => {
         setIsLoading(false);
      });
   };

   useLayoutEffect(() => {
      initPage();

      // Frame-busting to prevent site from being loaded within a frame without permission (click-jacking)
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
      return () => {};
   }, []);

   return (
      !isLoading && (
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
                  wrapperclassName="page-loader flex-column bg-dark bg-opacity-25"
               />
            }>
            <BrowserRouter basename="/">
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
      )
   );
};

const store = configureStore({
   reducer: { redux },
});

const container = document.getElementById("kt_app_root");
const root = createRoot(container);
root.render(
   <Provider store={store}>
      <App />
   </Provider>
);

if (process.env.NODE_ENV === "development") {
   new EventSource("http://localhost:8081/esbuild").addEventListener("change", () => location.reload());
}
