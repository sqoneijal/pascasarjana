import React from "react";
import { Bars } from "react-loader-spinner";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const SeminarProposal = React.lazy(() => import("./seminarproposal/Context"));
const SeminarPenelitian = React.lazy(() => import("./seminarpenelitian/Context"));
const Sidang = React.lazy(() => import("./sidang/Context"));

const Dashboard = () => {
   const { init } = useSelector((e) => e.redux);

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

   return (
      <React.Suspense fallback={loader}>
         {["", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(h.parse("status", init)) && <SeminarProposal />}
         {[13, 14, 15, 16, 17, 18, 19, 20].includes(h.parse("status", init)) && <SeminarPenelitian />}
         {[21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].includes(h.parse("status", init)) && <Sidang />}
      </React.Suspense>
   );
};
export default Dashboard;
