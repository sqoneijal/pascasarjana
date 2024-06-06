import moment from "moment";
import React, { useLayoutEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const PesertaSidang = () => {
   const { module } = useSelector((e) => e.redux);
   const { daftarMahasiswaSidang, jumlahMahasiswaSidang } = module;

   // string
   const [tanggalSekarang, setTanggalSekarang] = useState("");

   // array
   const [daftarMinggu, setDaftarMinggu] = useState([]);

   useLayoutEffect(() => {
      const today = moment();
      const startOfWeek = today.clone().startOf("week");

      const arrayGroup = [];
      for (let i = 0; i < 7; i++) {
         const day = startOfWeek.clone().add(i, "days");

         arrayGroup.push({ nama_hari: day.format("dd"), tanggal: day.format("D") });
      }
      setDaftarMinggu(arrayGroup);
      setTanggalSekarang(moment().format("D"));
      return () => {};
   }, []);

   return (
      <Col lg={12} xl={12} xxl={9} className="mb-10 mb-xl-0">
         <Card className="h-md-100">
            <Card.Header className="border-0 pt-5">
               <Card.Title className="card-title align-items-start flex-column" as="h3">
                  <span className="card-label fw-bold text-gray-900">Mahasiswa Dalam Proses Sidang Munaqasyah</span>
                  <span className="text-muted mt-1 fw-semibold fs-7">Jumlah {h.toInt(jumlahMahasiswaSidang)} Mahasiswa</span>
               </Card.Title>
            </Card.Header>
            <Card.Body className="pt-7 px-0">
               <ul className="nav nav-stretch nav-pills nav-pills-custom nav-pills-active-custom d-flex justify-content-between mb-8 px-5">
                  <Each
                     of={daftarMinggu}
                     render={(row) => (
                        <li className="nav-item p-0 ms-0" role="presentation">
                           <a
                              className={`nav-link btn d-flex flex-column flex-center rounded-pill min-w-45px py-4 px-3 btn-active-danger ${
                                 tanggalSekarang === row.tanggal ? "active" : ""
                              }`}
                              href="#"
                              onClick={(e) => {
                                 e.preventDefault();
                                 setTanggalSekarang(row.tanggal);
                              }}
                              role="tab">
                              <span className="fs-7 fw-semibold">{h.parse("nama_hari", row)}</span>
                              <span className="fs-6 fw-bold">{h.parse("tanggal", row)}</span>
                           </a>
                        </li>
                     )}
                  />
               </ul>
               <div className="tab-content mb-2 px-9">
                  <div className="tab-pane fade show active" role="tabpanel">
                     {h.parse(tanggalSekarang, daftarMahasiswaSidang) && (
                        <Each
                           of={daftarMahasiswaSidang[tanggalSekarang]}
                           render={(row) => (
                              <div className="d-flex align-items-center mb-6">
                                 <span className="bullet bullet-vertical d-flex align-items-center min-h-70px mh-100 me-4 bg-success" />
                                 <div className="flex-grow-1 me-5">
                                    <div className="text-gray-800 fw-semibold fs-2">{h.parse("jam", row, "jam")}</div>
                                    <div className="text-gray-700 fw-semibold fs-6">{h.parse("judul", row)}</div>
                                    <div className="text-gray-500 fw-semibold fs-7">
                                       <span className="text-primary opacity-75-hover fw-semibold">
                                          {h.parse("nim", row)} - {h.parse("nama", row)} - Angkatan {h.parse("angkatan", row)}
                                       </span>
                                    </div>
                                 </div>
                                 <button className="btn btn-sm btn-light">View</button>
                              </div>
                           )}
                        />
                     )}
                  </div>
               </div>
            </Card.Body>
         </Card>
      </Col>
   );
};
export default PesertaSidang;
