import React, { useLayoutEffect, useState } from "react";
import { ButtonGroup, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const Forms = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { pageType, openForms, detailContent } = module;
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [input, setInput] = useState({});
   const [errors, setErrors] = useState({});

   useLayoutEffect(() => {
      if (pageType === "update" && h.objLength(detailContent)) setInput({ ...detailContent });
      return () => {};
   }, [pageType, detailContent]);

   const clearProps = () => {
      setIsSubmit(false);
      setInput({});
      setErrors({});
   };

   const handleClose = () => {
      dispatch(setModule({ ...module, openForms: false, pageType: "", detailContent: {} }));
      clearProps();
   };

   const submit = (e) => {
      e.preventDefault();
      const formData = { pageType, user_modified: h.parse("username", init) };
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submit`, formData);
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

         dispatch(setModule({ ...module, openForms: false, pageType: "", detailContent: {} }));
         clearProps();
         h.dtReload();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <React.Fragment>
         {openForms && <div className="drawer-overlay" />}
         <div className={`bg-white drawer drawer-end min-w-25 ${openForms ? "drawer-on" : ""}`}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">
                           {h.pageType(pageType)} {document.title}
                        </span>
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
                     `Keterangan Lampiran`,
                     `nama`,
                     {
                        onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                        value: h.parse(`nama`, input),
                        style: {
                           height: 200,
                        },
                     },
                     true,
                     errors
                  )}
                  {h.form_select(
                     "Jenis Syarat",
                     "syarat",
                     { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse("syarat", input) },
                     [
                        { value: 1, label: "Seminar Proposal" },
                        { value: 2, label: "Seminar Hasil Penelitian" },
                        { value: 3, label: "Sidang Munaqasyah" },
                     ],
                     true,
                     errors
                  )}
                  {h.form_select(
                     "Apakah Wajib",
                     "wajib",
                     { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse("wajib", input) },
                     [
                        { value: "t", label: "Iya" },
                        { value: "f", label: "Tidak" },
                     ],
                     true,
                     errors
                  )}
                  {h.form_select(
                     "Apakah Ada Lampiran",
                     "ada_lampiran",
                     { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse("ada_lampiran", input) },
                     [
                        { value: "t", label: "Iya" },
                        { value: "f", label: "Tidak" },
                     ],
                     true,
                     errors
                  )}
                  {h.parse("ada_lampiran", input) === "t" &&
                     h.form_upload(
                        `File Lampiran`,
                        `file`,
                        { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.files[0] })) },
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
export default Forms;
