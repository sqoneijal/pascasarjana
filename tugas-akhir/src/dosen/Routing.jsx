import React from "react";
import { Bars } from "react-loader-spinner";
import { Route, Routes } from "react-router-dom";

const Profile = React.lazy(() => import("./page/profile/Context"));
const Dashboard = React.lazy(() => import("./page/dashboard/Context"));
const Proposal = React.lazy(() => import("./page/proposal/Context"));
const PenelitianPembimbing = React.lazy(() => import("./page/penelitian/pembimbing/Context"));
const PenelitianPenguji = React.lazy(() => import("./page/penelitian/penguji/Context"));
const SidangMunaqasyahPembimbing = React.lazy(() => import("./page/sidangmunaqasyah/pembimbing/Context"));
const SidangMunaqasyahPenguji = React.lazy(() => import("./page/sidangmunaqasyah/penguji/Context"));

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
         <Route path="proposal" loader={loader} element={<Proposal />} />
         <Route path="profile" loader={loader} element={<Profile />} />
         <Route path="penelitian">
            <Route path="pembimbing" loader={loader} element={<PenelitianPembimbing />} />
            <Route path="penguji" loader={loader} element={<PenelitianPenguji />} />
         </Route>
         <Route path="sidangmunaqasyah">
            <Route path="pembimbing" loader={loader} element={<SidangMunaqasyahPembimbing />} />
            <Route path="penguji" loader={loader} element={<SidangMunaqasyahPenguji />} />
         </Route>
      </Routes>
   );
};
export default Routing;
