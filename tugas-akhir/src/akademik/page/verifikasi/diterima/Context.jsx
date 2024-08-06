import React, { useLayoutEffect, useState } from "react";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { position, filter as setFilter, setModule } from "~/redux";

const Lists = React.lazy(() => import("./Lists"));
const Detail = React.lazy(() => import("./detail/Context"));
const FormsJadwalSeminar = React.lazy(() => import("./detail/FormsJadwalSeminar"));
const FormsPembimbing = React.lazy(() => import("./detail/FormsPembimbing"));

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
              <FormsJadwalSeminar />
              <FormsPembimbing />
              <Detail />
              <Lists />
           </React.Suspense>
        );
};
export default Context;
