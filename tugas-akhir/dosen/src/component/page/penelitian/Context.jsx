import React from "react";
import { Card } from "react-bootstrap";
import { Bars } from "react-loader-spinner";

const Lists = React.lazy(() => import("./Lists"));
const Detail = React.lazy(() => import("./detail/Context"));

const Context = () => {
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
               <Lists />
               <Detail />
            </Card.Body>
         </Card>
      </React.Suspense>
   );
};
export default Context;
