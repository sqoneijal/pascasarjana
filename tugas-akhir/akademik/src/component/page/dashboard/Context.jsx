import React, { useLayoutEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const Verifikasi = React.lazy(() => import("./Verifikasi"));
const Seminar = React.lazy(() => import("./Seminar"));
const PesertaSidang = React.lazy(() => import("./PesertaSidang"));

const Context = () => {
   const { module } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   // bool
   const [isLoading, setIsLoading] = useState(true);

   const initPage = () => {
      const fetch = h.get(`/initpage`, {}, true);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;

         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         dispatch(setModule({ ...module, ...data }));
      });
      fetch.finally(() => {
         setIsLoading(false);
      });
   };

   useLayoutEffect(() => {
      initPage();
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
            <Row className="gx-5 gx-xl-10 mb-xl-10">
               <Col md={6} lg={6} xl={6} xxl={3} className="mb-10">
                  <Verifikasi />
                  <Seminar />
               </Col>
               <PesertaSidang />
            </Row>
         </React.Suspense>
      )
   );
};
export default Context;
