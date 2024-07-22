import React, { useLayoutEffect } from "react";
import { Card } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { position, filter as setFilter } from "~/redux";

const Lists = React.lazy(() => import("./Lists"));
const Detail = React.lazy(() => import("./detail/Context"));

const Context = () => {
   const { init, filter } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   useLayoutEffect(() => {
      const { periode } = init;
      const periodeAktif = h.getPeriodeAktif(periode);
      dispatch(setFilter({ id_periode: h.parse("id", periodeAktif) }));
      dispatch(position(["Sidang Munaqasyah", document.title]));
      return () => {};
   }, [init]);

   return (
      h.objLength(filter) && (
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
                  <Lists />
                  <Detail />
               </Card.Body>
            </Card>
         </React.Suspense>
      )
   );
};
export default Context;
