import React, { useLayoutEffect, useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { AsyncTypeahead, Hint } from "react-bootstrap-typeahead";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const FormsCariMahasiswa = ({ input, setInput, errors }) => {
   const { module } = useSelector((e) => e.redux);
   const { pageType, detailContent } = module;

   // bool
   const [isLoading, setIsLoading] = useState(false);

   // array
   const [selected, setSelected] = useState([]);
   const [daftarMahasiswa, setDaftarMahasiswa] = useState([]);

   useLayoutEffect(() => {
      if (pageType === "update" && h.objLength(detailContent)) {
         setSelected([{ id: h.parse("id", detailContent), label: `${h.parse("username", detailContent)} - ${h.parse("nama", detailContent)}` }]);
         setInput((prev) => ({ ...prev, mahasiswa: h.parse("username", detailContent) }));
      }
      return () => {};
   }, [pageType, detailContent]);

   const handleChange = (data) => {
      setSelected(data);
      setInput((prev) => ({
         ...prev,
         username: h.arrLength(data) ? data[0].nim : "",
         nama: h.arrLength(data) ? data[0].nama_mahasiswa : "",
         password: h.arrLength(data) ? data[0].nim : "",
         confirm_password: h.arrLength(data) ? data[0].nim : "",
         mahasiswa: h.arrLength(data) ? data[0].id_mahasiswa : "",
         id_prodi: h.arrLength(data) ? data[0].id_prodi : "",
      }));
   };

   const cariMahasiswa = (query) => {
      const formData = { query };

      setIsLoading(true);
      const fetch = h.post(`/carimahasiswa`, formData);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         if (!data.status) h.notification(data.status, data.msg_response);

         setDaftarMahasiswa(data.content);
      });
      fetch.finally(() => {
         setIsLoading(false);
      });
   };

   return (
      <AsyncTypeahead
         id="mahasiswa"
         isLoading={isLoading}
         onSearch={cariMahasiswa}
         onChange={handleChange}
         options={daftarMahasiswa.map((row) => ({ ...row, label: `${h.parse("nim", row)} - ${h.parse("nama_mahasiswa", row)}` }))}
         placeholder="Mahasiswa"
         renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
            return (
               <Hint>
                  <FloatingLabel controlId={inputProps.id} label={inputProps.placeholder} className="form-label mb-2" style={{ width: "100%" }}>
                     <Form.Control
                        {...inputProps}
                        ref={(node) => {
                           inputRef(node);
                           referenceElementRef(node);
                        }}
                        isInvalid={h.is_invalid("mahasiswa", errors)}
                        disabled={pageType === "update"}
                     />
                     <Form.Label className="required" htmlFor={inputProps.id}>
                        {inputProps.placeholder}
                     </Form.Label>
                     {h.msg_response("mahasiswa", errors)}
                  </FloatingLabel>
               </Hint>
            );
         }}
         selected={selected}
      />
   );
};
export default FormsCariMahasiswa;
