import Chart from "chart.js/auto";
import React, { useLayoutEffect, useRef } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import wnumb from "wnumb";

const Verifikasi = () => {
   const { module } = useSelector((e) => e.redux);
   const { verifikasi } = module;
   const { totalMenuVerifikasi, jumlahProposal, jumlahPerbaikan, jumlahDiterima } = verifikasi;
   const chartVerifikasi = useRef(null);

   useLayoutEffect(() => {
      const chartOptions = {
         plugins: {
            legend: {
               display: false,
               label: {},
            },
         },
      };

      new Chart(chartVerifikasi.current.getContext("2d"), {
         type: "doughnut",
         data: {
            datasets: [
               {
                  data: [jumlahProposal, jumlahPerbaikan, jumlahDiterima],
                  backgroundColor: ["#1B84FF", "#F8285A", "#17C653"],
               },
            ],
         },
         options: chartOptions,
      });
      return () => {};
   }, [chartVerifikasi]);

   return (
      <Card className="card-flush h-md-50 mb-5 mb-xl-10">
         <Card.Header className="pt-5">
            <Card.Title as="div" className="d-flex flex-column">
               <div className="d-flex align-items-center">
                  <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">{wnumb({ thousand: "." }).to(totalMenuVerifikasi)}</span>
               </div>
               <span className="text-gray-500 pt-1 fw-semibold fs-6">Verifikasi</span>
            </Card.Title>
         </Card.Header>
         <Card.Body className="pt-2 pb-4 d-flex flex-wrap align-items-center">
            <div className="d-flex flex-center me-5 pt-2">
               <canvas ref={chartVerifikasi} style={{ width: 70, height: 70 }} />
            </div>
            <div className="d-flex flex-column content-justify-center flex-row-fluid">
               <div className="d-flex fw-semibold align-items-center">
                  <div className="bullet w-8px h-3px rounded-2 bg-primary me-3" />
                  <div className="text-gray-500 flex-grow-1 me-4">Proposal</div>
                  <div className="fw-bolder text-gray-700 text-xxl-end">{wnumb({ thousand: "." }).to(jumlahProposal)}</div>
               </div>
               <div className="d-flex fw-semibold align-items-center my-3">
                  <div className="bullet w-8px h-3px rounded-2 bg-danger me-3" />
                  <div className="text-gray-500 flex-grow-1 me-4">Perbaikan</div>
                  <div className="fw-bolder text-gray-700 text-xxl-end">{wnumb({ thousand: "." }).to(jumlahPerbaikan)}</div>
               </div>
               <div className="d-flex fw-semibold align-items-center">
                  <div className="bullet w-8px h-3px rounded-2 me-3 bg-success" />
                  <div className="text-gray-500 flex-grow-1 me-4">Diterima</div>
                  <div className=" fw-bolder text-gray-700 text-xxl-end">{wnumb({ thousand: "." }).to(jumlahDiterima)}</div>
               </div>
            </div>
         </Card.Body>
      </Card>
   );
};
export default Verifikasi;
