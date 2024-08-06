import React, { useLayoutEffect, useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { AsyncTypeahead, Hint } from "react-bootstrap-typeahead";
import * as h from "~/Helpers";

const FormsCariDosen = ({ setInput, errors, pageType, detailPembimbing }) => {
   // bool
   const [isLoading, setIsLoading] = useState(false);

   // array
   const [daftarDosen, setDaftarDosen] = useState([]);
   const [selected, setSelected] = useState([]);

   useLayoutEffect(() => {
      if (pageType === "update" && h.objLength(detailPembimbing)) {
         setSelected([{ label: `${h.parse("nidn", detailPembimbing)} - ${h.parse("nama_dosen", detailPembimbing)}` }]);
      }
      return () => {};
   }, [pageType, detailPembimbing]);

   const handleChange = (data) => {
      setSelected(data);
      setInput((prev) => ({
         ...prev,
         nidn: h.arrLength(data) ? h.parse("nidn", data[0]) : "",
         nama_dosen: h.arrLength(data) ? h.parse("nama_dosen", data[0]) : "",
      }));
   };

   const cariDosen = (query) => {
      const formData = { query };

      setIsLoading(true);
      const fetch = h.post(`/caridosen`, formData);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         if (data.status) {
            setDaftarDosen(data.content);
         } else {
            h.notification(data.status, data.msg_response);
         }
      });
      fetch.finally(() => {
         setIsLoading(false);
      });
   };

   return (
      <AsyncTypeahead
         id="dosen"
         isLoading={isLoading}
         onSearch={cariDosen}
         onChange={handleChange}
         options={daftarDosen.map((row) => ({
            ...row,
            id: h.parse("id_dosen", row),
            label: `${h.parse("nidn", row)} - ${h.parse("nama_dosen", row)}`,
         }))}
         placeholder="Dosen"
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
                        isInvalid={h.is_invalid("dosen", errors) || h.is_invalid("nama_dosen", errors)}
                        disabled={pageType === "update"}
                     />
                     <Form.Label className="required" htmlFor={inputProps.id}>
                        {inputProps.placeholder}
                     </Form.Label>
                     {h.msg_response("dosen", errors) || h.msg_response("nama_dosen", errors)}
                  </FloatingLabel>
               </Hint>
            );
         }}
         selected={selected}
      />
   );
};
export default FormsCariDosen;
