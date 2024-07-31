import React from "react";
import * as h from "~/Helpers";

const FormsBukanDosenUIN = ({ input, setInput, errors, pageType }) => {
   return (
      <React.Fragment>
         {h.form_text(
            `NIK`,
            `nidn`,
            {
               onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
               disabled: pageType === "update",
               value: h.parse(`nidn`, input),
            },
            true,
            errors
         )}
         {h.form_text(
            `Nama Lengkap`,
            `nama_dosen`,
            { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse(`nama_dosen`, input) },
            true,
            errors
         )}
      </React.Fragment>
   );
};
export default FormsBukanDosenUIN;
