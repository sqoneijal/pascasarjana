import moment from "moment";
import React, { useLayoutEffect, useState } from "react";
import { ButtonGroup, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { Hint, Typeahead } from "react-bootstrap-typeahead";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const FormsSKPenelitian = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openFormsSKPenelitian, detailContent, daftarJenisAktivitas, status_tugas_akhir, skPenelitian } = module;
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [input, setInput] = useState({
      kampusMerdeka: "f",
   });
   const [errors, setErrors] = useState({});

   // array
   const [selectedJenisAktivitas, setSelectedJenisAktivitas] = useState([]);

   useLayoutEffect(() => {
      if (openFormsSKPenelitian && h.objLength(status_tugas_akhir)) {
         setInput((prev) => ({
            ...prev,
            judul: h.parse("judul_proposal_final", status_tugas_akhir),
            ...skPenelitian,
            kampusMerdeka: h.parse("untuk_kampus_merdeka", skPenelitian),
            id: h.parse("id_penelitian", skPenelitian),
         }));
         setSelectedJenisAktivitas([
            {
               id: h.parse("id_jenis_aktivitas", skPenelitian),
               label:
                  h.parse("untuk_kampus_merdeka", skPenelitian) === "t"
                     ? `${h.parse("jenis_aktivitas", skPenelitian)} (Kampus Merdeka)`
                     : h.parse("jenis_aktivitas", skPenelitian),
            },
         ]);
      }
      return () => {};
   }, [openFormsSKPenelitian, status_tugas_akhir, skPenelitian]);

   const clearProps = () => {
      setIsSubmit(false);
      setInput({});
      setErrors({});
      setSelectedJenisAktivitas([]);
   };

   const handleClose = () => {
      dispatch(setModule({ ...module, openFormsSKPenelitian: false }));
      clearProps();
   };

   const handleChangeJenisAktivitas = (data) => {
      setSelectedJenisAktivitas(data);
      setInput((prev) => ({
         ...prev,
         id_jenis_aktivitas: h.arrLength(data) ? h.parse("id", data[0]) : "",
         kampusMerdeka: h.arrLength(data) && h.parse("untuk_kampus_merdeka", data[0]) === "t" ? "t" : "f",
      }));
   };

   const submit = (e) => {
      e.preventDefault();
      const formData = {
         id_status_tugas_akhir: h.parse("id_status_tugas_akhir", detailContent),
         id_periode: h.parse("id_periode", detailContent),
         user_modified: h.parse("username", init),
         nim: h.parse("nim", detailContent),
      };
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submitpenetpansk`, formData);
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

         dispatch(setModule({ ...module, openFormsSKPenelitian: false, ...data.content }));
         clearProps();
         h.dtReload();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <React.Fragment>
         {openFormsSKPenelitian && <div className="drawer-overlay" style={{ zIndex: 999 }} />}
         <div className={`bg-white drawer drawer-end min-w-50 ${openFormsSKPenelitian ? "drawer-on" : ""}`} style={{ zIndex: 999 }}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Perbaharui SK Penelitian</span>
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
                        {h.form_text(
                           `Nomor SK Tugas`,
                           `nomor_sk_tugas`,
                           {
                              onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                              value: h.parse(`nomor_sk_tugas`, input),
                           },
                           true,
                           errors
                        )}
                     </Col>
                     <Col md={3} sm={12}>
                        {h.date_picker(
                           "Tanggal SK Tugas",
                           "tanggal_sk_tugas",
                           {
                              onChange: ([date]) => setInput((prev) => ({ ...prev, tanggal_sk_tugas: moment(date).format("YYYY-MM-DD") })),
                              value: h.parse("tanggal_sk_tugas", input),
                           },
                           true,
                           errors
                        )}
                     </Col>
                     <Col md={3} sm={12}>
                        {h.form_select(
                           "Jenis Anggota",
                           "jenis_anggota",
                           {
                              onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                              value: h.parse("jenis_anggota", input),
                           },
                           [
                              { value: "P", label: "Personal" },
                              { value: "K", label: "Kelompok" },
                           ],
                           true,
                           errors
                        )}
                     </Col>
                  </Row>
                  <Row>
                     <Col>
                        <Typeahead
                           id="id_jenis_aktivitas"
                           onChange={handleChangeJenisAktivitas}
                           options={daftarJenisAktivitas.map((row) => ({
                              ...row,
                              label: h.parse("untuk_kampus_merdeka", row) === "t" ? `${h.parse("nama", row)} (Kampus Merdeka)` : h.parse("nama", row),
                           }))}
                           placeholder="Jenis Aktivitas"
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
                                          isInvalid={h.is_invalid("id_jenis_aktivitas", errors)}
                                       />
                                       <Form.Label className="required" htmlFor={inputProps.id}>
                                          {inputProps.placeholder}
                                       </Form.Label>
                                       {h.msg_response("id_jenis_aktivitas", errors)}
                                    </FloatingLabel>
                                 </Hint>
                              );
                           }}
                           selected={selectedJenisAktivitas}
                        />
                     </Col>
                     {h.parse("kampusMerdeka", input) === "true" && (
                        <Col md={3} sm={12}>
                           {h.form_select(
                              "Program MBKM",
                              "program_mbkm",
                              {
                                 onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                                 value: h.parse("program_mbkm", input),
                              },
                              [
                                 { value: "F", label: "Flagship" },
                                 { value: "M", label: "Mandiri" },
                              ],
                              true,
                              errors
                           )}
                        </Col>
                     )}
                  </Row>
                  {h.form_textarea(
                     `Judul Penelitian`,
                     `judul`,
                     {
                        onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                        value: h.parse(`judul`, input),
                        style: { height: 80 },
                     },
                     true,
                     errors
                  )}
                  {h.form_textarea(`Keterangan`, `keterangan`, {
                     onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                     value: h.parse(`keterangan`, input),
                     style: { height: 80 },
                  })}
                  {h.form_textarea(`Lokasi Penelitian`, `lokasi`, {
                     onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                     value: h.parse(`lokasi`, input),
                     style: { height: 80 },
                  })}
                  <Row>
                     <Col md={3} sm={12}>
                        {h.date_picker("Tanggal Mulai", "tanggal_mulai", {
                           onChange: ([date]) => setInput((prev) => ({ ...prev, tanggal_mulai: moment(date).format("YYYY-MM-DD") })),
                           value: h.parse("tanggal_mulai", input),
                        })}
                     </Col>
                     <Col md={3} sm={12}>
                        {h.date_picker("Tanggal Akhir", "tanggal_akhir", {
                           onChange: ([date]) => setInput((prev) => ({ ...prev, tanggal_akhir: moment(date).format("YYYY-MM-DD") })),
                           value: h.parse("tanggal_akhir", input),
                        })}
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
export default FormsSKPenelitian;
