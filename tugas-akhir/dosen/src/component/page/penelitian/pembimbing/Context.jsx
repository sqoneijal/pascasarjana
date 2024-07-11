import React, { useLayoutEffect } from "react";
import { Card } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { position, filter as setFilter } from "~/redux";

const Lists = React.lazy(() => import("./Lists"));
const Filter = React.lazy(() => import("./Filter"));
const Detail = React.lazy(() => import("./detail/Context"));

const Context = () => {
   const { filter, init } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   useLayoutEffect(() => {
      dispatch(position(["Penelitian", document.title]));
      const { periode } = init;
      const periodeAktif = h.getPeriodeAktif(periode);
      dispatch(setFilter({ id_periode: h.parse("id", periodeAktif) }));
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
