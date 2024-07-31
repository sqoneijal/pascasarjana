import moment from "moment";
import React, { useState } from "react";
import { ButtonGroup, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const FormsJadwalSeminar = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openFormsJadwalSeminar, detailContent, jadwalSeminarProposal } = module;
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [input, setInput] = useState({});
   const [errors, setErrors] = useState({});

   const clearProps = () => {
      setInput({});
      setErrors({});
      setIsSubmit(false);
   };

   const handleClose = () => {
      dispatch(setModule({ ...module, openFormsJadwalSeminar: false }));
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
      const fetch = h.post(`/submitjadwalseminar`, formData);
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

         dispatch(setModule({ ...module, openFormsJadwalSeminar: false, jadwalSeminarProposal: { ...data.content } }));
         clearProps();
         h.dtReload();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <React.Fragment>
         {openFormsJadwalSeminar && <div className="drawer-overlay" style={{ zIndex: 999 }} />}
         <div className={`bg-white drawer drawer-end min-w-25 ${openFormsJadwalSeminar ? "drawer-on" : ""}`} style={{ zIndex: 999 }}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Penentuan Jadwal Seminar</span>
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
                     "Tanggal Seminar",
                     "tanggal_seminar",
                     {
                        onChange: ([date]) => setInput((prev) => ({ ...prev, tanggal_seminar: moment(date).format("YYYY-MM-DD") })),
                        value: h.parse("tanggal_seminar", input),
                     },
                     true,
                     errors
                  )}
                  {h.date_picker(
                     "Jam Seminar",
                     "jam_seminar",
                     {
                        onChange: ([date]) => setInput((prev) => ({ ...prev, jam_seminar: moment(date).format("hh:mm") })),
                        value: h.parse("jam_seminar", input),
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
export default FormsJadwalSeminar;
