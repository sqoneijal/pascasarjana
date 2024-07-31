import React, { useLayoutEffect } from "react";
import { Bars } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { buttonConfig, position, showButton } from "~/redux";

const Lists = React.lazy(() => import("./Lists"));
const Forms = React.lazy(() => import("./Forms"));

const Context = () => {
   const dispatch = useDispatch();

   useLayoutEffect(() => {
      dispatch(position(["Pengaturan", document.title]));
      dispatch(showButton(true));
      dispatch(
         buttonConfig({
            label: `Tambah ${document.title}`,
            variant: "primary",
            init: {
               openForms: true,
               pageType: "insert",
            },
         })
      );
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
         <Lists />
         <Forms />
      </React.Suspense>
   );
};
export default Context;
