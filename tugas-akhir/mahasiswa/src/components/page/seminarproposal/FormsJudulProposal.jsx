import React from "react";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const FormsJudulProposal = ({ input, setInput, errors }) => {
   const { init } = useSelector((e) => e.redux);

   return (
      <React.Fragment>
         {h.form_text(
            `Judul Proposal 1`,
            `judul_proposal_1`,
            {
               onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
               value: h.parse(`judul_proposal_1`, input),
               disabled: !["", 3].includes(h.parse("status", init)),
            },
            true,
            errors
         )}
         {h.form_text(
            `Judul Proposal 2`,
            `judul_proposal_2`,
            {
               onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
               value: h.parse(`judul_proposal_2`, input),
               disabled: !["", 3].includes(h.parse("status", init)),
            },
            true,
            errors
         )}
         {h.form_text(
            `Judul Proposal 3`,
            `judul_proposal_3`,
            {
               onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
               value: h.parse(`judul_proposal_3`, input),
               disabled: !["", 3].includes(h.parse("status", init)),
            },
            true,
            errors
         )}
      </React.Fragment>
   );
};
export default FormsJudulProposal;
