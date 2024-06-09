import React, { useLayoutEffect } from "react";
import { Card } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { showButton } from "~/redux";

const Lists = React.lazy(() => import("./Lists"));
const Forms = React.lazy(() => import("./Forms"));
const Filter = React.lazy(() => import("./Filter"));

const Context = () => {
   const dispatch = useDispatch();

   useLayoutEffect(() => {
      dispatch(showButton(true));
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
         <Card className="shadow-sm card-bordered">
            <Card.Body>
               <Filter />
               <Lists />
               <Forms />
            </Card.Body>
         </Card>
      </React.Suspense>
   );
};
export default Context;
