import React, { useLayoutEffect, useState } from "react";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import Switch, { Case, Default } from "react-switch-case";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const Forms = React.lazy(() => import("./Forms"));
const Register = React.lazy(() => import("./Register"));
const LupaPassword = React.lazy(() => import("./LupaPassword"));
const FormsLupaPassword = React.lazy(() => import("./FormsLupaPassword"));

const Context = () => {
   const { module } = useSelector((e) => e.redux);
   const { loginStatusPage } = module;
   const dispatch = useDispatch();

   // bool
   const [isLoading, setIsLoading] = useState(false);
   const [showFormsLupaPassword, setShowFormsLupaPassword] = useState(false);

   const location = window.location;

   const validasiTokenLupaPassword = (token) => {
      const formData = { token };

      setIsLoading(true);
      const fetch = h.post(`/validasitokenlupapassword`, formData, {}, true);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         if (data.status) {
            dispatch(setModule({ ...module, dataLupaPassword: data.data }));
         } else {
            h.notification(data.status, data.msg_response);
            window.history.pushState(null, null, "/");
         }

         setShowFormsLupaPassword(data.status);
      });
      fetch.finally(() => {
         setIsLoading(false);
      });
   };

   useLayoutEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.has("lupa_password") && searchParams.get("lupa_password")) {
         validasiTokenLupaPassword(searchParams.get("lupa_password"));
      }
      return () => {};
   }, [location]);

   useLayoutEffect(() => {
      const body = document.body;
      body.classList.add("app-blank");
      body.style.backgroundImage = "url('/assets/bg4.jpg')";
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
                     <Switch condition={loginStatusPage}>
                        <Case value="daftar">
                           <Register />
                        </Case>
                        <Case value="lupa_password">
                           <LupaPassword />
                        </Case>
                        <Default>
                           {showFormsLupaPassword ? <FormsLupaPassword setShowFormsLupaPassword={setShowFormsLupaPassword} /> : <Forms />}
                        </Default>
                     </Switch>
                  </div>
               </div>
            </div>
         </div>
      </React.Suspense>
   );
};
export default Context;
