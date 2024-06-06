import Chart from "chart.js/auto";
import React, { useLayoutEffect, useRef } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import wnumb from "wnumb";
import * as h from "~/Helpers";

const Seminar = () => {
   const { module } = useSelector((e) => e.redux);
   const { seminar } = module;
   const chartSeminar = useRef(null);

   useLayoutEffect(() => {
      const chartOptions = {
         plugins: {
            legend: {
               display: false,
               label: {},
            },
         },
      };

      new Chart(chartSeminar.current.getContext("2d"), {
         type: "doughnut",
         data: {
            datasets: [
               {
                  data: [h.toInt(h.parse("jumlahProposal", seminar)), h.toInt(h.parse("jumlahPenelitian", seminar))],
                  backgroundColor: ["#1B84FF", "#17C653"],
               },
            ],
         },
         options: chartOptions,
      });
      return () => {};
   }, [chartSeminar]);

   return (
      <Card className="card-flush h-md-50 mb-5 mb-xl-10">
         <Card.Header className="pt-5">
            <Card.Title as="div" className="d-flex flex-column">
               <div className="d-flex align-items-center">
                  <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">
                     {wnumb({ thousand: "." }).to(h.toInt(h.parse("totalMenuSeminar", seminar)))}
                  </span>
               </div>
               <span className="text-gray-500 pt-1 fw-semibold fs-6">Seminar</span>
            </Card.Title>
         </Card.Header>
         <Card.Body className="pt-2 pb-4 d-flex flex-wrap align-items-center">
            <div className="d-flex flex-center me-5 pt-2">
               <canvas ref={chartSeminar} style={{ width: 70, height: 70 }} />
            </div>
            <div className="d-flex flex-column content-justify-center flex-row-fluid">
               <div className="d-flex fw-semibold align-items-center">
                  <div className="bullet w-8px h-3px rounded-2 bg-primary me-3" />
                  <div className="text-gray-500 flex-grow-1 me-4">Proposal</div>
                  <div className="fw-bolder text-gray-700 text-xxl-end">
                     {wnumb({ thousand: "." }).to(h.toInt(h.parse("jumlahProposal", seminar)))}
                  </div>
               </div>
               <div className="d-flex fw-semibold align-items-center">
                  <div className="bullet w-8px h-3px rounded-2 me-3 bg-success" />
                  <div className="text-gray-500 flex-grow-1 me-4">Penelitian</div>
                  <div className=" fw-bolder text-gray-700 text-xxl-end">
                     {wnumb({ thousand: "." }).to(h.toInt(h.parse("jumlahPenelitian", seminar)))}
                  </div>
               </div>
            </div>
         </Card.Body>
      </Card>
   );
};
export default Seminar;
