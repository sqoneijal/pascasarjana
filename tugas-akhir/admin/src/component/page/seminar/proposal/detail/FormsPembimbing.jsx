import React, { useLayoutEffect, useState } from "react";
import { ButtonGroup, Card, FloatingLabel, Form } from "react-bootstrap";
import { Hint, Typeahead } from "react-bootstrap-typeahead";
import { useDispatch, useSelector } from "react-redux";
import Switch, { Case } from "react-switch-case";
import * as h from "~/Helpers";
import { setModule } from "~/redux";
import FormsBukanDosenUIN from "./FormsBukanDosenUIN";
import FormsCariDosen from "./FormsCariDosen";

const FormsPembimbing = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openFormsPembimbing, pageType, daftarKategoriKegiatan, detailContent, detailPembimbing, skPenelitian } = module;
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [input, setInput] = useState({});
   const [errors, setErrors] = useState({});

   // array
   const [selectedKategoriKegiatan, setSelectedKategoriKegiatan] = useState([]);

   useLayoutEffect(() => {
      if (pageType === "update" && h.objLength(detailPembimbing)) {
         setInput({ ...detailPembimbing });
         setSelectedKategoriKegiatan([
            { id: h.parse("id_kategori_kegiatan", detailPembimbing), label: h.parse("kategori_kegiatan", detailPembimbing) },
         ]);
      }
      return () => {};
   }, [pageType, detailPembimbing]);

   const clearProps = () => {
      setIsSubmit(false);
      setInput({});
      setErrors({});
      setSelectedKategoriKegiatan([]);
   };

   const handleClose = () => {
      dispatch(setModule({ ...module, openFormsPembimbing: false, pageType: "", detailPembimbing: {} }));
      clearProps();
   };

   const handleChangeKategoriKegiatan = (data) => {
      setSelectedKategoriKegiatan(data);
      setInput((prev) => ({ ...prev, id_kategori_kegiatan: h.arrLength(data) ? h.parse("id", data[0]) : "" }));
   };

   const submit = (e) => {
      e.preventDefault();
      const formData = {
         pageType,
         user_modified: h.parse("username", init),
         id_status_tugas_akhir: h.parse("id_status_tugas_akhir", detailContent),
         nim: h.parse("nim", detailContent),
         id_periode: h.parse("id_periode", detailContent),
         id_penelitian: h.parse("id", skPenelitian),
      };
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submitpembimbing`, formData);
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

         dispatch(setModule({ ...module, openFormsPembimbing: false, pageType: "", detailPembimbing: {}, pembimbing: data.content }));
         clearProps();
         h.dtReload();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   const props = { input, setInput, errors, pageType, detailPembimbing };

   return (
      <React.Fragment>
         {openFormsPembimbing && <div className="drawer-overlay" style={{ zIndex: 999 }} />}
         <div className={`bg-white drawer drawer-end min-w-25 ${openFormsPembimbing ? "drawer-on" : ""}`} style={{ zIndex: 999 }}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">{h.pageType(pageType)} Pembimbing</span>
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
                  {h.form_text(
                     `Pembimbing Ke`,
                     `pembimbing_ke`,
                     { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse(`pembimbing_ke`, input) },
                     true,
                     errors
                  )}
                  <Typeahead
                     id="id_kategori_kegiatan"
                     onChange={handleChangeKategoriKegiatan}
                     options={daftarKategoriKegiatan.map((row) => ({ ...row, label: h.parse("nama", row) }))}
                     placeholder="Kategori Kegiatan"
                     renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
                        return (
                           <Hint>
                              <FloatingLabel
                                 controlId={inputProps.id}
                                 label={inputProps.placeholder}
                                 className="form-label mb-2"
                                 style={{ width: "100%" }}>
                                 <Form.Control
                                    {...inputProps}
                                    ref={(node) => {
                                       inputRef(node);
                                       referenceElementRef(node);
                                    }}
                                    isInvalid={h.is_invalid("id_kategori_kegiatan", errors)}
                                 />
                                 <Form.Label className="required" htmlFor={inputProps.id}>
                                    {inputProps.placeholder}
                                 </Form.Label>
                                 {h.msg_response("id_kategori_kegiatan", errors)}
                              </FloatingLabel>
                           </Hint>
                        );
                     }}
                     selected={selectedKategoriKegiatan}
                  />
                  {pageType === "insert" &&
                     h.form_select(
                        "Apakah Dosen UIN Ar Raniry?",
                        "apakah_dosen_uin",
                        {
                           onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                           value: h.parse("apakah_dosen_uin", input),
                        },
                        [
                           { value: "t", label: "Iya" },
                           { value: "f", label: "Bukan" },
                        ],
                        true,
                        errors
                     )}
                  <Switch condition={h.parse("apakah_dosen_uin", input)}>
                     <Case value="f">
                        <FormsBukanDosenUIN {...props} />
                     </Case>
                     <Case value="t">
                        <FormsCariDosen {...props} />
                     </Case>
                  </Switch>
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
export default FormsPembimbing;
