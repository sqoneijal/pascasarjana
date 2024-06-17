import React, { useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { position, filter as setFilter, setModule } from "~/redux";

const Lists = React.lazy(() => import("./Lists"));
const Filter = React.lazy(() => import("./Filter"));
const Detail = React.lazy(() => import("./detail/Context"));

const Context = () => {
   const { module, init } = useSelector((e) => e.redux);
   const dispatch = useDispatch();
   const { periode } = init;

   // bool
   const [isLoading, setIsLoading] = useState(true);

   const initPage = () => {
      const fetch = h.get(`/initpage`);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;

         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         dispatch(setModule({ ...module, ...data }));
         dispatch(setFilter({ id_periode: h.parse("id", periode) }));
      });
      fetch.finally(() => {
         setIsLoading(false);
      });
   };

   useLayoutEffect(() => {
      dispatch(position(["Seminar", document.title]));
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
                  wrapperClass="page-loader flex-column bg-dark bg-opacity-25"
               />
            }>
            <Card className="shadow-sm card-bordered">
               <Card.Body>
                  <Filter />
                  <Lists />
                  <Detail />
               </Card.Body>
            </Card>
         </React.Suspense>
      )
   );
};
export default Context;
