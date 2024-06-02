import { configureStore } from "@reduxjs/toolkit";
import React, { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import redux from "./redux";

import "./assets/custom.css";
import "./assets/plugins.bundle.css";
import "./assets/style.bundle.css";

const Login = React.lazy(() => import("./Login"));

const App = () => {
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
      return () => {};
   }, []);

   return <Login />;
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
