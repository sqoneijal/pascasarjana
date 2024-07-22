import React, { useState } from "react";
import { ButtonGroup, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const FormsPerbaikiSidangMunaqasyah = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openFormsPerbaikiSidang, detailContent } = module;
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [errors, setErrors] = useState({});
   const [input, setInput] = useState({});

   const clearProps = () => {
      setIsSubmit(false);
      setErrors({});
      setInput({});
   };

   const handleClose = () => {
      dispatch(setModule({ ...module, openFormsPerbaikiSidang: false }));
      clearProps();
   };

   const submit = (e) => {
      e.preventDefault();
      const formData = {
         nim: h.parse("nim", detailContent),
         id_periode: h.parse("id_periode", detailContent),
         id_status_tugas_akhir: h.parse("id_status_tugas_akhir", detailContent),
         nidn: init.username,
      };
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submitperbaikihasilsidang`, formData);
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

         dispatch(
            setModule({ ...module, openFormsPerbaikiSidang: false, tim_penguji: data.content, detailContent: { ...detailContent, status: 27 } })
         );
         clearProps();
         h.dtReload();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <React.Fragment>
         {openFormsPerbaikiSidang && <div className="drawer-overlay" style={{ zIndex: 999 }} />}
         <div className={`bg-white drawer drawer-end min-w-25 ${openFormsPerbaikiSidang ? "drawer-on" : ""}`} style={{ zIndex: 999 }}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Konfirmasi Perbaiki</span>
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
                  {h.form_textarea(
                     `Catatan Perbaikan`,
                     `keterangan_perbaikan`,
                     {
                        onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                        value: h.parse(`keterangan_perbaikan`, input),
                        style: { height: 300 },
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
export default FormsPerbaikiSidangMunaqasyah;
