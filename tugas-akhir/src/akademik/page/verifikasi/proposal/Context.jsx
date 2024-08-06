import React, { useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { position, filter as setFilter, setModule } from "~/redux";

const Detail = React.lazy(() => import("./Detail/Context"));
const Filter = React.lazy(() => import("./Filter"));
const Lists = React.lazy(() => import("./Lists"));
const ModalConfirmVerifikasi = React.lazy(() => import("./Detail/ModalConfirmVerifikasi"));

const Context = () => {
   const { module, filter } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

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
         dispatch(setFilter({ id_periode: h.parse("id", h.getPeriodeAktif(data.daftarPeriode)) }));
      });
      fetch.finally(() => {
         setIsLoading(false);
      });
   };

   useLayoutEffect(() => {
      dispatch(position(["Verifikasi", document.title]));
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

   return isLoading
      ? loader
      : h.objLength(filter) && (
           <React.Suspense fallback={loader}>
              <Detail />
              <Card className="shadow-sm card-bordered">
                 <Card.Body>
                    <Filter />
                    <Lists />
                 </Card.Body>
              </Card>
              <ModalConfirmVerifikasi />
           </React.Suspense>
        );
};
export default Context;
