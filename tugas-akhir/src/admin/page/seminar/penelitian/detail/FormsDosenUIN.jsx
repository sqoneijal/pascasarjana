import React, { useLayoutEffect, useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { AsyncTypeahead, Hint } from "react-bootstrap-typeahead";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const FormsDosenUIN = ({ setInput, errors, pageType, detailPenguji }) => {
   const { module } = useSelector((e) => e.redux);
   const { openFormsPenguji } = module;

   // bool
   const [isLoading, setIsLoading] = useState(false);

   // array
   const [daftar, setDaftar] = useState([]);
   const [selected, setSelected] = useState([]);

   useLayoutEffect(() => {
      if (!openFormsPenguji) {
         setDaftar([]);
         setSelected([]);
         setIsLoading(false);
      }
      return () => {};
   }, [openFormsPenguji]);

   useLayoutEffect(() => {
      if (pageType === "update" && h.objLength(detailPenguji)) {
         setSelected([{ id: h.parse("nidn", detailPenguji), label: `${h.parse("nidn", detailPenguji)} - ${h.parse("nama_dosen", detailPenguji)}` }]);
      }
      return () => {};
   }, [pageType, detailPenguji]);

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

         setDaftar(data.content);
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
         options={daftar.map((row) => ({ ...row, id: h.parse("nidn", row), label: `${h.parse("nidn", row)} - ${h.parse("nama_dosen", row)}` }))}
         placeholder="Dosen Penguji"
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
                        isInvalid={h.is_invalid("nidn", errors) || h.is_invalid("nama_dosen", errors)}
                        disabled={pageType === "update"}
                     />
                     <Form.Label className="required" htmlFor={inputProps.id}>
                        {inputProps.placeholder}
                     </Form.Label>
                     {h.msg_response("nidn", errors) || h.msg_response("nama_dosen", errors)}
                  </FloatingLabel>
               </Hint>
            );
         }}
         selected={selected}
      />
   );
};
export default FormsDosenUIN;
