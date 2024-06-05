import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const JudulProposalDisetujui = () => {
   const { module } = useSelector((e) => e.redux);
   const { judulProposal } = module;

   return (
      <Row className="mt-5 mb-5">
         <Col>{h.detail_label("Judul Proposal Disetujui", h.parse("judul_proposal_final", judulProposal))}</Col>
      </Row>
   );
};
export default JudulProposalDisetujui;
