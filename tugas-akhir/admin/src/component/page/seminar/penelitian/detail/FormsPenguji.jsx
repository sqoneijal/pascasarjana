import React, { useLayoutEffect, useState } from "react";
import { ButtonGroup, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { AsyncTypeahead, Hint, Typeahead } from "react-bootstrap-typeahead";
import { useDispatch, useSelector } from "react-redux";
import Switch, { Case, Default } from "react-switch-case";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const FormsPenguji = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openFormsPengujiPenelitian, pageType, penelitian, daftarKategoriKegiatan, detailContent, detailPengujiPenelitian } = module;
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);
   const [isLoadingCariDosen, setIsLoadingCariDosen] = useState(false);

   // object
   const [input, setInput] = useState({
      apakah_dosen_uin: true,
   });
   const [errors, setErrors] = useState({});

   // array
   const [daftarDosen, setDaftarDosen] = useState([]);
   const [selectedDosen, setSelectedDosen] = useState([]);
   const [selectedKategoriKegiatan, setSelectedKategoriKegiatan] = useState([]);

   useLayoutEffect(() => {
      if (pageType === "update" && h.objLength(detailPengujiPenelitian)) {
         setInput({
            ...detailPengujiPenelitian,
            apakah_dosen_uin: h.parse("apakah_dosen_uin", detailPengujiPenelitian) === "t",
            dosen: h.parse("nidn", detailPengujiPenelitian),
         });
         setSelectedDosen([{ id: h.parse("nidn", detailPengujiPenelitian), label: h.parse("nama_dosen", detailPengujiPenelitian) }]);
         setSelectedKategoriKegiatan([
            { id: h.parse("id_kategori_kegiatan", detailPengujiPenelitian), label: h.parse("kategori_kegiatan", detailPengujiPenelitian) },
         ]);
      }
      return () => {};
   }, [pageType, detailPengujiPenelitian]);

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

   const clearProps = () => {
      setInput({ apakah_dosen_uin: true });
      setErrors({});
      setSelectedKategoriKegiatan([]);
      setSelectedDosen([]);
   };

   const handleClose = () => {
      clearProps();
      dispatch(setModule({ ...module, openFormsPengujiPenelitian: false, detailPengujiPenelitian: {} }));
   };

   const submit = (e) => {
      e.preventDefault();
      const formData = {
         pageType,
         user_modified: h.parse("username", init),
         id_penelitian: h.parse("id", penelitian),
         id_status_tugas_akhir: h.parse("id", detailContent),
         id_seminar_penelitian: h.parse("id_seminar_penelitian", penelitian),
      };
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submitpenguji`, formData);
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
         dispatch(
            setModule({
               ...module,
               openFormsPengujiPenelitian: false,
               pageType: "insert",
               pengujiPenelitian: data.content,
               detailPengujiPenelitian: {},
            })
         );
         h.dtReload();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   const handleChangeKategoriKegiatan = (data) => {
      setSelectedKategoriKegiatan(data);
      setInput((prev) => ({ ...prev, id_kategori_kegiatan: h.arrLength(data) ? h.parse("id", data[0]) : "" }));
   };

   return (
      <React.Fragment>
         {openFormsPengujiPenelitian && <div className="drawer-overlay" style={{ zIndex: 999 }} />}
         <div
            className={`bg-white drawer drawer-end ${openFormsPengujiPenelitian ? "drawer-on" : ""}`}
            style={{ width: window.innerWidth / 2, zIndex: 999 }}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">{h.pageType(pageType)} Tim Pembimbing</span>
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
export default FormsPenguji;
