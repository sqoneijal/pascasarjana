import React from "react";
import { Bars } from "react-loader-spinner";

const LoginSession = React.lazy(() => import("./LoginSession"));
const AksesLogs = React.lazy(() => import("./AksesLogs"));

const Logs = () => {
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
         <LoginSession />
         <AksesLogs />
      </React.Suspense>
   );
};
export default Logs;
