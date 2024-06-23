import React from "react";
import { Route, Routes } from "react-router-dom";

const Dashboard = React.lazy(() => import("./page/dashboard/Context"));
const Proposal = React.lazy(() => import("./page/proposal/Context"));
const Penelitian = React.lazy(() => import("./page/penelitian/Context"));

const Routing = () => {
   return (
      <Routes>
         <Route path="dashboard" element={<Dashboard />} />
         <Route path="proposal" element={<Proposal />} />
         <Route path="penelitian" element={<Penelitian />} />
      </Routes>
   );
};
export default Routing;
