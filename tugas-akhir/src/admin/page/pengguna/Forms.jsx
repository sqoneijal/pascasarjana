import React, { useLayoutEffect, useState } from "react";
import { ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Switch, { Case, Default } from "react-switch-case";
import * as h from "~/Helpers";
import { setModule } from "~/redux";
import FormsCariDosen from "./FormsCariDosen";
import FormsCariMahasiswa from "./FormsCariMahasiswa";

const Forms = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openForms, pageType, detailContent } = module;
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [input, setInput] = useState({});
   const [errors, setErrors] = useState({});

   useLayoutEffect(() => {
      if (pageType === "update" && h.objLength(detailContent)) setInput({ ...detailContent, old_email: h.parse("email", detailContent) });
      return () => {};
   }, [pageType, detailContent]);

   const clearProps = () => {
      setInput({});
      setErrors({});
   };

   const handleClose = () => {
      clearProps();
      dispatch(setModule({ ...module, openForms: false, pageType: "", detailContent: {} }));
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
         clearProps();
         dispatch(setModule({ ...module, openForms: false, pageType: "", detailContent: {} }));
         h.dtReload();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   const props = { input, setInput, errors };

   return (
      <React.Fragment>
         {openForms && <div className="drawer-overlay" />}
         <div className={`bg-white drawer drawer-end min-w-50 ${openForms ? "drawer-on" : ""}`}>
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
                  <Row>
                     <Col>
                        {h.form_select(
                           "Role",
                           "role",
                           {
                              onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                              value: h.parse("role", input),
                              disabled: pageType === "update",
                           },
                           [
                              { value: 1, label: "Administrator" },
                              { value: 2, label: "Akademik" },
                              { value: 3, label: "Dosen" },
                              { value: 4, label: "Mahasiswa" },
                           ],
                           true,
                           errors
                        )}
                     </Col>
                     <Col>
                        <Switch condition={h.parse("role", input)}>
                           <Case value={3}>
                              <FormsCariDosen {...props} />
                           </Case>
                           <Case value={4}>
                              <FormsCariMahasiswa {...props} />
                           </Case>
                           <Default>
                              {h.form_text(
                                 `Nama Lengkap`,
                                 `nama`,
                                 {
                                    onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                                    value: h.parse(`nama`, input),
                                 },
                                 true,
                                 errors
                              )}
                           </Default>
                        </Switch>
                     </Col>
                  </Row>
                  <Row>
                     <Col>
                        {h.form_text(
                           `Email`,
                           `email`,
                           {
                              onChange: (e) => {
                                 const value = e.target.value.toLowerCase();
                                 if (pageType === "insert" && ![3, 4].includes(h.parse("role", input))) {
                                    setInput((prev) => ({ ...prev, [e.target.name]: value, username: value.split("@")[0] }));
                                 } else {
                                    setInput((prev) => ({ ...prev, [e.target.name]: value }));
                                 }
                              },
                              value: h.parse(`email`, input),
                           },
                           true,
                           errors
                        )}
                     </Col>
                     <Col>
                        {h.form_text(
                           `Username`,
                           `username`,
                           {
                              onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                              value: h.parse(`username`, input),
                              disabled: pageType === "update" || [3, 4].includes(h.parse("role", input)),
                           },
                           true,
                           errors
                        )}
                     </Col>
                  </Row>
                  <Row>
                     <Col>
                        {h.form_password(
                           `Password`,
                           `password`,
                           {
                              onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                              value: h.parse(`password`, input),
                           },
                           true,
                           errors
                        )}
                     </Col>
                     <Col>
                        {h.form_password(
                           `Konfirmasi Password`,
                           `confirm_password`,
                           {
                              onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                              value: h.parse(`confirm_password`, input),
                           },
                           true,
                           errors
                        )}
                     </Col>
                  </Row>
               </Card.Body>
               <Card.Footer className="text-end">
                  <ButtonGroup>
                     {h.buttons(`Simpan ${document.title}`, isSubmit, {
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
