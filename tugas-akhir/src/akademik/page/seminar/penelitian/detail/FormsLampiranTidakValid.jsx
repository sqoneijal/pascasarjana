import React, { useState } from "react";
import { ButtonGroup, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const FormsLampiranTidakValid = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openFormsTidakValidLampiran, detailLampiran, detailContent, lampiran } = module;
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [input, setInput] = useState({});
   const [errors, setErrors] = useState({});

   const clearProps = () => {
      setIsSubmit(false);
      setInput({});
      setErrors({});
   };

   const handleClose = () => {
      dispatch(setModule({ ...module, openFormsTidakValidLampiran: false, detailLampiran: {} }));
      clearProps();
   };

   const submit = (e) => {
      e.preventDefault();
      const formData = {
         id: h.parse("id", detailLampiran),
         nim: h.parse("nim", detailContent),
         id_periode: h.parse("id_periode", detailContent),
         user_modified: h.parse("username", init),
      };
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submittidakvalidlampiran`, formData);
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

         dispatch(setModule({ ...module, openFormsTidakValidLampiran: false, detailLampiran: {}, lampiran: { ...lampiran, ...data.content } }));
         clearProps();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <React.Fragment>
         {openFormsTidakValidLampiran && <div className="drawer-overlay" style={{ zIndex: 999 }} />}
         <div className={`bg-white drawer drawer-end min-w-25 ${openFormsTidakValidLampiran ? "drawer-on" : ""}`} style={{ zIndex: 999 }}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Konfirmasi Tidak Valid</span>
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
                  <a href={h.getDriveFile(h.parse("id_google_drive", detailLampiran))} target="_blank" className="fw-bold fs-2">
                     {h.parse("lampiran", detailLampiran)}
                  </a>
                  {h.form_textarea(
                     `Catatan Tidak Valid`,
                     `catatan`,
                     {
                        onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                        value: h.parse(`catatan`, input),
                        style: { height: 200 },
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
export default FormsLampiranTidakValid;
