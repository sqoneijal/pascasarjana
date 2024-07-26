import React from "react";
import { Col, Row } from "react-bootstrap";
import { Bars } from "react-loader-spinner";

const SeminarProposal = React.lazy(() => import("./StatusTesis/SeminarProposal"));
const SeminarHasilPenelitian = React.lazy(() => import("./StatusTesis/SeminarHasilPenelitian"));
const SidangMunaqasyah = React.lazy(() => import("./StatusTesis/SidangMunaqasyah"));

const StatusTesis = () => {
   return (
      <React.Suspense
         fallback={
            <Bars
               visible={true}
               color="#4fa94d"
               radius="9"
               wrapperStyle={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
               }}
               wrapperClass="page-loader flex-column bg-dark bg-opacity-25"
            />
         }>
         <Row className="gx-5 gx-xl-10 mb-xl-10">
            <Col>
               <SeminarProposal />
            </Col>
            <Col>
               <SeminarHasilPenelitian />
            </Col>
            <Col>
               <SidangMunaqasyah />
            </Col>
         </Row>
      </React.Suspense>
   );
};
export default StatusTesis;
