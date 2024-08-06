import moment from "moment";
import React, { useLayoutEffect, useState } from "react";
import { ButtonGroup, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const FormsJadwalSidang = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openFormsJadwalSidang, detailContent, jadwal_sidang } = module;
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [input, setInput] = useState({});
   const [errors, setErrors] = useState({});

   useLayoutEffect(() => {
      if (openFormsJadwalSidang && h.objLength(jadwal_sidang)) setInput({ ...jadwal_sidang });
      return () => {};
   }, [openFormsJadwalSidang, jadwal_sidang]);

   const clearProps = () => {
      setIsSubmit(false);
      setInput({});
      setErrors({});
   };

   const handleClose = () => {
      dispatch(setModule({ ...module, openFormsJadwalSidang: false }));
      clearProps();
   };

   const submit = (e) => {
      e.preventDefault();
      const formData = {
         user_modified: h.parse("username", init),
         id_status_tugas_akhir: h.parse("id_status_tugas_akhir", detailContent),
         nim: h.parse("nim", detailContent),
         id_periode: h.parse("id_periode", detailContent),
      };
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submitjadwalsidang`, formData);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         setErrors(data.errors);
         h.notification(data.status, data.msg_response);

         if (!data.status) return;

         dispatch(setModule({ ...module, openFormsJadwalSidang: false, jadwal_sidang: data.content }));
         clearProps();
         h.dtReload();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <React.Fragment>
         {openFormsJadwalSidang && <div className="drawer-overlay" style={{ zIndex: 999 }} />}
         <div className={`bg-white drawer drawer-end min-w-25 ${openFormsJadwalSidang ? "drawer-on" : ""}`} style={{ zIndex: 999 }}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Perbaharui Jadwal Sidang</span>
                     </div>
                  </div>
                  <div className="card-toolbar">
                     <button className="btn btn-sm btn-icon btn-active-light-primary" onClick={handleClose}>
                        <i className="ki-duotone ki-cross fs-2">
                           <span className="path1" />
                           <span className="path2" />
                        </i>
                     </button>
                  </div>
               </Card.Header>
               <Card.Body className="hover-scroll-overlay-y">
                  {h.date_picker(
                     "Tanggal Sidang",
                     "tanggal",
                     {
                        onChange: ([date]) => setInput((prev) => ({ ...prev, tanggal: moment(date).format("YYYY-MM-DD") })),
                        value: h.parse("tanggal", input),
                     },
                     true,
                     errors
                  )}
                  {h.date_picker(
                     "Jam Sidang",
                     "jam",
                     {
                        onChange: ([date]) => setInput((prev) => ({ ...prev, jam: moment(date).format("hh:mm") })),
                        value: h.parse("jam", input),
                        options: {
                           enableTime: true,
                           noCalendar: true,
                           dateFormat: "H:i",
                        },
                     },
                     true,
                     errors
                  )}
               </Card.Body>
               <Card.Footer className="text-end">
                  <ButtonGroup>
                     {h.buttons(`Simpan`, isSubmit, {
                        onClick: isSubmit ? null : submit,
                     })}
                     {h.buttons(`Batal`, false, {
                        variant: "danger",
                        onClick: () => handleClose(),
                     })}
                  </ButtonGroup>
               </Card.Footer>
            </Card>
         </div>
      </React.Fragment>
   );
};
export default FormsJadwalSidang;
