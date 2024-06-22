import React from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";
import { setInit } from "~/redux";

const Navbar = ({ menuActive, setMenuActive }) => {
   const { init } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   const menu = [
      { value: 1, label: "Overview" },
      { value: 2, label: "Logs" },
   ];

   const handleGantiAvatar = (avatar) => {
      const formData = { id: h.parse("id", init), avatar };

      const fetch = h.post(`/gantiavatar`, formData);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         h.notification(data.status, data.msg_response);

         if (!data.status) return;

         dispatch(setInit({ ...init, avatar: data.content }));
      });
   };

   return (
      <Card className="mb-5 mb-xl-10">
         <Card.Body className="pt-9 pb-0">
            <div className="d-flex flex-wrap flex-sm-nowrap">
               <div className="me-7 mb-4">
                  <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                     <img alt={h.parse("nama", init)} src={h.getFile(h.parse("avatar", init))} />
                  </div>
               </div>
               <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                     <div className="d-flex flex-column">
                        <div className="d-flex align-items-center mb-2">
                           <span className="text-gray-900 text-hover-primary fs-2 fw-bold me-1">{h.parse("nama", init)}</span>
                        </div>
                        <div className="d-flex flex-wrap fw-semibold fs-6 mb-4 pe-2">
                           <a href="#" className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                              <i className="ki-outline ki-profile-circle fs-4 me-1" /> Tim Pembimbing
                           </a>
                           <a href="#" className="d-flex align-items-center text-gray-500 text-hover-primary mb-2">
                              <i className="ki-outline ki-sms fs-4 me-1" /> {h.parse("email", init)}
                           </a>
                        </div>
                     </div>
                     <div className="d-flex my-4">
                        <label className="align-self-center btn btn-primary btn-sm">
                           <span className="indicator-label">Ganti Avatar</span>
                           <input
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                 if (h.arrLength(e.target.files)) {
                                    handleGantiAvatar(e.target.files[0]);
                                 }
                              }}
                           />
                        </label>
                     </div>
                  </div>
                  <div className="d-flex flex-wrap flex-stack">
                     <div className="d-flex flex-column flex-grow-1 pe-8">
                        <div className="d-flex flex-wrap">
                           <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                              <div className="d-flex align-items-center">
                                 <i className="ki-outline ki-arrow-up fs-3 text-success me-2" />
                                 <div className="fs-2 fw-bold counted">{h.parse("totalLogin", init)}</div>
                              </div>
                              <div className="fw-semibold fs-6 text-gray-500">Total Login</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold">
               <Each
                  of={menu}
                  render={(row) => (
                     <li className="nav-item mt-2">
                        <a
                           className={`nav-link text-active-primary ms-0 me-10 py-5 ${menuActive === h.parse("value", row) ? "active" : ""}`}
                           href="#"
                           onClick={(e) => {
                              e.preventDefault();
                              setMenuActive(h.parse("value", row));
                           }}>
                           {h.parse("label", row)}
                        </a>
                     </li>
                  )}
               />
            </ul>
         </Card.Body>
      </Card>
   );
};
export default Navbar;
