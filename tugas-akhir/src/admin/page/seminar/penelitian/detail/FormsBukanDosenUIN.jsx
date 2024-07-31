import React from "react";
import * as h from "~/Helpers";

const FormsBukanDosenUIN = ({ input, setInput, errors }) => {
   return (
      <React.Fragment>
         {h.form_text(
            `NIK/NIDN`,
            `nidn`,
            { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse(`nidn`, input) },
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
