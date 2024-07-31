import React, { useLayoutEffect, useState } from "react";
import { Bars } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import * as h from "~/Helpers";
import { setInit } from "~/redux";

const Header = React.lazy(() => import("./components/Header"));
const Toolbar = React.lazy(() => import("./components/Toolbar"));
const Routing = React.lazy(() => import("./Routing"));
const Footer = React.lazy(() => import("./components/Footer"));

const Context = () => {
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

         dispatch(setInit({ ...data }));
      });
      fetch.finally(() => {
         setIsLoading(false);
      });
   };

   useLayoutEffect(() => {
      const body = document.body;
      body.classList.add("header-fixed");
      body.classList.add("header-tablet-and-mobile-fixed");
      body.classList.add("toolbar-enabled");
      body.style.backgroundImage = "url(/assets/header-bg.jpg)";
      body.style.backgroundColor = "#F9F9F9";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundPosition = "center top";
      body.style.backgroundSize = "100% 350px";

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
   }, []);

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
         <BrowserRouter basename="mahasiswa">
            <div className="page d-flex flex-row flex-column-fluid">
               <div className="wrapper d-flex flex-column flex-row-fluid" id="kt_wrapper">
                  <Header />
                  <Toolbar />
                  <Routing />
                  <Footer />
               </div>
            </div>
         </BrowserRouter>
      </React.Suspense>
   );
};
export default Context;
