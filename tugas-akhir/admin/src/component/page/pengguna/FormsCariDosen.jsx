import React, { useLayoutEffect, useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { AsyncTypeahead, Hint } from "react-bootstrap-typeahead";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const FormsCariDosen = ({ input, setInput, errors }) => {
   const { module } = useSelector((e) => e.redux);
   const { pageType, detailContent } = module;
   // bool
   const [isLoading, setIsLoading] = useState(false);

   // array
   const [selected, setSelected] = useState([]);
   const [daftarDosen, setDaftarDosen] = useState([]);

   useLayoutEffect(() => {
      if (pageType === "update" && h.objLength(detailContent)) {
         setSelected([{ id: h.parse("id", detailContent), label: `${h.parse("username", detailContent)} - ${h.parse("nama", detailContent)}` }]);
         setInput((prev) => ({ ...prev, dosen: h.parse("username", detailContent) }));
      }
      return () => {};
   }, [pageType, detailContent]);

   const handleDhange = (data) => {
      setSelected(data);
      setInput((prev) => ({
         ...prev,
         nama: h.arrLength(data) ? data[0].nama_dosen : "",
         email: h.arrLength(data) ? data[0].email : "",
         username: h.arrLength(data) ? data[0].nidn : "",
         dosen: h.arrLength(data) ? h.parse("id_dosen", data[0]) : "",
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
         if (!data.status) h.notification(data.status, data.msg_response);

         setDaftarDosen(data.content);
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
         onChange={handleDhange}
         options={daftarDosen.map((row) => ({ ...row, label: `${h.parse("nidn", row)} - ${h.parse("nama_dosen", row)}` }))}
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
                        isInvalid={h.is_invalid("dosen", errors)}
                        disabled={pageType === "update"}
                     />
                     <Form.Label className="required" htmlFor={inputProps.id}>
                        {inputProps.placeholder}
                     </Form.Label>
                     {h.msg_response("dosen", errors)}
                  </FloatingLabel>
               </Hint>
            );
         }}
         selected={selected}
      />
   );
};
export default FormsCariDosen;
