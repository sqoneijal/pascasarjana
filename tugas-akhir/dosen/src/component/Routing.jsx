import React from "react";
import { Route, Routes } from "react-router-dom";

const Dashboard = React.lazy(() => import("./page/dashboard/Context"));
const Proposal = React.lazy(() => import("./page/proposal/Context"));

const Routing = () => {
   return (
      <Routes>
         <Route path="dashboard" element={<Dashboard />} />
         <Route path="proposal" element={<Proposal />} />
      </Routes>
   );
};
export default Routing;
