import React from "react";
import { Route, Routes } from "react-router-dom";

const VerifikasiProposal = React.lazy(() => import("./page/verifikasi/proposal/Context"));
const VerifikasiPerbaikan = React.lazy(() => import("./page/verifikasi/perbaikan/Context"));
const VerifikasiDiterima = React.lazy(() => import("./page/verifikasi/diterima/Context"));
const SeminarProposal = React.lazy(() => import("./page/seminar/proposal/Context"));
const PengaturanLampiran = React.lazy(() => import("./page/pengaturan/lampiran/Context"));
const PengaturanPeriode = React.lazy(() => import("./page/pengaturan/periode/Context"));
const Profile = React.lazy(() => import("./page/profile/Context"));
const SeminarPenelitian = React.lazy(() => import("./page/seminar/penelitian/Context"));
const Sidang = React.lazy(() => import("./page/sidang/Context"));
const Dashboard = React.lazy(() => import("./page/dashboard/Context"));
const Pengguna = React.lazy(() => import("./page/pengguna/Context"));

const Routing = () => {
   return (
      <Routes>
         <Route path="/" element={<Dashboard />} />
         <Route path="verifikasi">
            <Route path="proposal" element={<VerifikasiProposal />} />
            <Route path="perbaikan" element={<VerifikasiPerbaikan />} />
            <Route path="diterima" element={<VerifikasiDiterima />} />
         </Route>
         <Route path="seminar">
            <Route path="proposal" element={<SeminarProposal />} />
            <Route path="penelitian" element={<SeminarPenelitian />} />
         </Route>
         <Route path="pengaturan">
            <Route path="lampiran" element={<PengaturanLampiran />} />
            <Route path="periode" element={<PengaturanPeriode />} />
         </Route>
         <Route path="profile" element={<Profile />} />
         <Route path="sidang" element={<Sidang />} />
         <Route path="pengguna" element={<Pengguna />} />
      </Routes>
   );
};
export default Routing;
