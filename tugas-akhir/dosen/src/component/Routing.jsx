import React from "react";
import { Route, Routes } from "react-router-dom";

const Dashboard = React.lazy(() => import("./page/dashboard/Context"));
const Proposal = React.lazy(() => import("./page/proposal/Context"));
const PenelitianPembimbing = React.lazy(() => import("./page/penelitian/pembimbing/Context"));
const PenelitianPenguji = React.lazy(() => import("./page/penelitian/penguji/Context"));

const Routing = () => {
   return (
      <Routes>
         <Route path="dashboard" element={<Dashboard />} />
         <Route path="proposal" element={<Proposal />} />
         <Route path="penelitian">
            <Route path="pembimbing" element={<PenelitianPembimbing />} />
            <Route path="penguji" element={<PenelitianPenguji />} />
         </Route>
      </Routes>
   );
};
export default Routing;
