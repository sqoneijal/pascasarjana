import React from "react";
import { Bars } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import * as h from "~/Helpers";

const SeminarProposal = React.lazy(() => import("./page/seminarproposal/Context"));
const SeminarPenelitian = React.lazy(() => import("./page/seminarpenelitian/Context"));
const Sidang = React.lazy(() => import("./page/sidang/Context"));
const Profile = React.lazy(() => import("./page/profile/Context"));

const Context = () => {
   const { init } = useSelector((e) => e.redux);
   const location = useLocation();

   return location.pathname === "/profile" ? (
      <Profile />
   ) : (
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
         {["", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(h.parse("status", init)) && <SeminarProposal />}
         {[13, 14, 15, 16, 17, 18, 19, 20].includes(h.parse("status", init)) && <SeminarPenelitian />}
         {[21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].includes(h.parse("status", init)) && <Sidang />}
      </React.Suspense>
   );
};
export default Context;
