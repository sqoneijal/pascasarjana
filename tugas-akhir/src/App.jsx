import { configureStore } from "@reduxjs/toolkit";
import React, { useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Bars } from "react-loader-spinner";
import { Provider } from "react-redux";
import Switch, { Case, Default } from "react-switch-case";
import redux from "./redux";

import "./assets/custom.css";
import "./assets/plugins.bundle.css";
import "./assets/style.bundle.css";

const Login = React.lazy(() => import("./login/Context"));
const Admin = React.lazy(() => import("./admin/Context"));
const Mahasiswa = React.lazy(() => import("./mahasiswa/Context"));
const Dosen = React.lazy(() => import("./dosen/Context"));

const App = () => {
   // string
   const [pathname, setPathname] = useState("");

   useLayoutEffect(() => {
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

      const location = window.location.pathname.split("/");
      setPathname(location[1]);
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
         <Switch condition={pathname}>
            <Case value="admin">
               <Admin />
            </Case>
            <Case value="mahasiswa">
               <Mahasiswa />
            </Case>
            <Case value="dosen">
               <Dosen />
            </Case>
            <Default>
               <Login />
            </Default>
         </Switch>
      </React.Suspense>
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
