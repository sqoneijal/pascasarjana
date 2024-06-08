import React, { useLayoutEffect, useState } from "react";
import { ButtonGroup, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { AsyncTypeahead, Hint, Typeahead } from "react-bootstrap-typeahead";
import { useDispatch, useSelector } from "react-redux";
import Switch, { Case, Default } from "react-switch-case";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const FormsPengujiSidang = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openFormsPengujiSidang, pageType, daftarKategoriKegiatan, detailContent, detailPenguji } = module;
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);
   const [isLoadingCariDosen, setIsLoadingCariDosen] = useState(false);

   // array
   const [selectedDosen, setSelectedDosen] = useState([]);
   const [daftarDosen, setDaftarDosen] = useState([]);
   const [selectedKategoriKegiatan, setSelectedKategoriKegiatan] = useState([]);

   // object
   const [input, setInput] = useState({
      apakah_dosen_uin: true,
   });
   const [errors, setErrors] = useState({});

   useLayoutEffect(() => {
      if (openFormsPengujiSidang && pageType === "update" && h.objLength(detailPenguji)) {
         setInput({ ...detailPenguji, apakah_dosen_uin: h.parse("apakah_dosen_uin", detailPenguji) === "t", dosen: h.parse("nidn", detailPenguji) });
         setSelectedDosen([{ id: h.parse("nidn", detailPenguji), label: h.parse("nama_dosen", detailPenguji) }]);
         setSelectedKategoriKegiatan([{ id: h.parse("id_kategori_kegiatan", detailPenguji), label: h.parse("kategori_kegiatan", detailPenguji) }]);
      }
      return () => {};
   }, [pageType, detailPenguji, openFormsPengujiSidang]);

   const clearProps = () => {
      setInput({ apakah_dosen_uin: true });
      setErrors({});
      setSelectedDosen([]);
      setDaftarDosen([]);
      setSelectedKategoriKegiatan([]);
   };

   const handleClose = () => {
      dispatch(setModule({ ...module, openFormsPengujiSidang: false, pageType: "", detailPenguji: {} }));
      clearProps();
   };

   const handleChangeKategoriKegiatan = (data) => {
      setSelectedKategoriKegiatan(data);
      setInput((prev) => ({ ...prev, id_kategori_kegiatan: h.arrLength(data) ? h.parse("id", data[0]) : "" }));
   };

   const handleChangeDosen = (data) => {
      setSelectedDosen(data);
      setInput({
         ...input,
         dosen: h.arrLength(data) ? h.parse("nidn", data[0]) : "",
         nidn: h.arrLength(data) ? h.parse("nidn", data[0]) : "",
         nama_dosen: h.arrLength(data) ? h.parse("nama_dosen", data[0]) : "",
      });
   };

   const cariDosen = (query) => {
      const formData = { query };

      setIsLoadingCariDosen(true);
      const fetch = h.post(`/caridosen`, formData);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         if (data.status) {
            setDaftarDosen(data.content);
         } else {
            h.notification(false, h.parse("msg_response", data));
         }
      });
      fetch.finally(() => {
         setIsLoadingCariDosen(false);
      });
   };

   const submit = (e) => {
      e.preventDefault();
      const formData = {
         pageType,
         user_modified: h.parse("username", init),
         nim: h.parse("nim", detailContent),
         id_status_tugas_akhir: h.parse("id", detailContent),
      };
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submittimpenguji`, formData);
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

         h.dtReload();
         dispatch(setModule({ ...module, openFormsPengujiSidang: false, pageType: "", detailPenguji: {}, penguji: data.content }));
         clearProps();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <React.Fragment>
         {openFormsPengujiSidang && <div className="drawer-overlay" style={{ zIndex: 999 }} />}
         <div
            className={`bg-white drawer drawer-end ${openFormsPengujiSidang ? "drawer-on" : ""}`}
            style={{ width: window.innerWidth / 2, zIndex: 999 }}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Penentuan Tim Penguji</span>
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
                  {h.form_check(`Apakah Dosen UIN Ar Raniry Banda Aceh?`, `apakah_dosen_uin`, {
                     onChange: (e) => setInput((prev) => ({ ...prev, apakah_dosen_uin: e.target.checked })),
                     checked: input.apakah_dosen_uin,
                  })}
                  <Switch condition={input.apakah_dosen_uin}>
                     <Case value={false}>
                        <Row className="mt-5">
                           <Col>
                              {h.form_text(
                                 `NIK`,
                                 `nidn`,
                                 {
                                    onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                                    value: h.parse(`nidn`, input),
                                 },
                                 true,
                                 errors
                              )}
                           </Col>
                           <Col>
                              {h.form_text(
                                 `Nama Lengkap`,
                                 `nama_dosen`,
                                 {
                                    onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                                    value: h.parse(`nama_dosen`, input),
                                 },
                                 true,
                                 errors
                              )}
                           </Col>
                        </Row>
                     </Case>
                     <Default>
                        <AsyncTypeahead
                           id="nidn"
                           isLoading={isLoadingCariDosen}
                           onSearch={cariDosen}
                           onChange={handleChangeDosen}
                           options={daftarDosen.map((row) => ({ ...row, label: `${row.nidn} - ${row.nama_dosen}` }))}
                           placeholder="Dosen"
                           renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
                              return (
                                 <Hint>
                                    <FloatingLabel
                                       controlId={inputProps.id}
                                       label={inputProps.placeholder}
                                       className="form-label mb-2 mt-5"
                                       style={{ width: "100%" }}>
                                       <Form.Control
                                          {...inputProps}
                                          ref={(node) => {
                                             inputRef(node);
                                             referenceElementRef(node);
                                          }}
                                          isInvalid={h.is_invalid("dosen", errors)}
                                       />
                                       <Form.Label className="required" htmlFor={inputProps.id}>
                                          {inputProps.placeholder}
                                       </Form.Label>
                                       {h.msg_response("dosen", errors)}
                                    </FloatingLabel>
                                 </Hint>
                              );
                           }}
                           selected={selectedDosen}
                        />
                     </Default>
                  </Switch>
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
                  <Row>
                     <Col md={3} sm={12}>
                        {h.form_text(
                           `Penguji Ke`,
                           `penguji_ke`,
                           {
                              onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                              value: h.parse(`penguji_ke`, input),
                           },
                           true,
                           errors
                        )}
                     </Col>
                  </Row>
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
export default FormsPengujiSidang;
