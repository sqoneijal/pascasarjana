import moment from "moment";
import React, { useLayoutEffect, useState } from "react";
import { ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const FormsPenetapanSK = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openFormsPenetpanSK, detailContent, daftarJenisAktivitas, penelitian } = module;
   const { periode } = init;
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);
   const [kampusMerdeka, setKampusMerdeka] = useState(false);

   // object
   const [input, setInput] = useState({});
   const [errors, setErrors] = useState({});

   useLayoutEffect(() => {
      if (openFormsPenetpanSK && h.objLength(penelitian)) setInput({ ...penelitian });
      return () => {};
   }, [openFormsPenetpanSK, penelitian]);

   const clearProps = () => {
      setInput({});
      setErrors({});
   };

   const handleClose = () => {
      clearProps();
      dispatch(setModule({ ...module, openFormsPenetpanSK: false }));
   };

   const submit = (e) => {
      e.preventDefault();
      const formData = {
         user_modified: h.parse("username", init),
         id_status_tugas_akhir: h.parse("id", detailContent),
         kampusMerdeka,
         id_periode: h.parse("id", periode),
      };
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submitpenetapansk`, formData);
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
            setModule({ ...module, openFormsPenetpanSK: false, ...data.content, detailContent: { ...detailContent, status: data.content.status } })
         );
         h.dtReload();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   const apakahUntukKampusMerdeka = (status) => {
      if (status === "t") {
         return ` (Kampus Merdeka)`;
      }
      return "";
   };

   const daftarProgramMBKM = [
      { value: "1", label: "Flagship" },
      { value: "2", label: "Mandiri" },
   ];

   return (
      <React.Fragment>
         {openFormsPenetpanSK && <div className="drawer-overlay" style={{ zIndex: 999 }} />}
         <div
            className={`bg-white drawer drawer-end ${openFormsPenetpanSK ? "drawer-on" : ""}`}
            style={{ width: window.innerWidth / 2, zIndex: 999 }}>
            <Card className="rounded-0 w-100">
               <Card.Header className="pe-5">
                  <div className="card-title">
                     <div className="d-flex justify-content-center flex-column me-3">
                        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">Penetapan SK Penelitian Mahasisa</span>
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
                     <Col md={3} sm={12}>
                        {h.form_text(`Semester`, `id_periode`, {
                           value: h.periode(h.parse(`semester`, periode)),
                           disabled: true,
                        })}
                     </Col>
                     <Col>
                        {h.form_select(
                           "Jenis Aktivitas",
                           "id_jenis_aktivitas",
                           {
                              onChange: (e) => {
                                 setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
                                 setKampusMerdeka(e.target.selectedOptions[0].dataset.index === "t");
                              },
                              value: h.parse("id_jenis_aktivitas", input),
                           },
                           daftarJenisAktivitas.map((row) => ({
                              value: h.parse("id", row),
                              label: `${h.parse("nama", row)}${apakahUntukKampusMerdeka(h.parse("untuk_kampus_merdeka", row))}`,
                              index: h.parse("untuk_kampus_merdeka", row),
                           })),
                           true,
                           errors
                        )}
                     </Col>
                     {kampusMerdeka && (
                        <Col md={2} sm={12}>
                           {h.form_select(
                              "Program MBKM",
                              "program_mbkm",
                              {
                                 onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                                 value: h.parse("program_mbkm", input),
                              },
                              daftarProgramMBKM,
                              true,
                              errors
                           )}
                        </Col>
                     )}
                  </Row>
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
                     <Col>
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
                     <Col>
                        {h.date_picker("Tanggal Mulai", "tanggal_mulai", {
                           onChange: ([date]) => setInput((prev) => ({ ...prev, tanggal_mulai: moment(date).format("YYYY-MM-DD") })),
                           value: h.parse("tanggal_mulai", input),
                        })}
                     </Col>
                     <Col>
                        {h.date_picker("Tanggal Akhir", "tanggal_akhir", {
                           onChange: ([date]) => setInput((prev) => ({ ...prev, tanggal_akhir: moment(date).format("YYYY-MM-DD") })),
                           value: h.parse("tanggal_akhir", input),
                        })}
                     </Col>
                  </Row>
                  <Row>
                     <Col>
                        {h.form_textarea(
                           `Judul`,
                           `judul`,
                           {
                              onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                              value: h.parse(`judul`, input),
                              style: { height: 80 },
                           },
                           true,
                           errors
                        )}
                     </Col>
                  </Row>
                  <Row>
                     <Col>
                        {h.form_textarea(`Keterangan`, `keterangan`, {
                           onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                           value: h.parse(`keterangan`, input),
                           style: { height: 80 },
                        })}
                     </Col>
                  </Row>
                  <Row>
                     <Col>
                        {h.form_textarea(`Lokasi`, `lokasi`, {
                           onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                           value: h.parse(`lokasi`, input),
                           style: { height: 80 },
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
export default FormsPenetapanSK;
