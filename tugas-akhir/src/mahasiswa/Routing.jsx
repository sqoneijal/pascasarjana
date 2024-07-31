import React from "react";
import { Bars } from "react-loader-spinner";
import { Route, Routes } from "react-router-dom";

const Dashboard = React.lazy(() => import("./page/Dashboard"));
const Profile = React.lazy(() => import("./page/profile/Context"));

const Routing = () => {
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
      <Routes>
         <Route path="/" loader={loader} element={<Dashboard />} />
         <Route path="profile" loader={loader} element={<Profile />} />
      </Routes>
   );
};
export default Routing;
