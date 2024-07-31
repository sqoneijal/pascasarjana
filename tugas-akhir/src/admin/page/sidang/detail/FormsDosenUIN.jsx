import React, { useLayoutEffect, useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { AsyncTypeahead, Hint } from "react-bootstrap-typeahead";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const FormsDosenUIN = ({ input, errors, setInput }) => {
   const { module } = useSelector((e) => e.redux);
   const { openFormTimPenguji, pageType } = module;

   // bool
   const [isSearch, setIsSearch] = useState(false);

   // array
   const [selected, setSelected] = useState([]);
   const [options, setOptions] = useState([]);

   useLayoutEffect(() => {
      if (pageType === "update" && h.objLength(input)) {
         setSelected([{ id: input.nidn, label: `${input.nidn} - ${h.parse("nama_dosen", input)}` }]);
      }
      return () => {};
   }, [pageType, input]);

   useLayoutEffect(() => {
      if (!openFormTimPenguji) {
         setSelected([]);
         setOptions([]);
         setIsSearch(false);
      }
      return () => {};
   }, [openFormTimPenguji]);

   const handleSearch = (query) => {
      const formData = { query };

      setIsSearch(true);
      const fetch = h.post(`/caridosen`, formData);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         if (data.status) {
            setOptions(data.content);
         } else {
            h.notification(data.status, data.msg_response);
         }
      });
      fetch.finally(() => {
         setIsSearch(false);
      });
   };

   const handleChange = (data) => {
      setSelected(data);
      setInput((prev) => ({
         ...prev,
         nidn: h.arrLength(data) ? data[0].nidn : "",
         nama_dosen: h.arrLength(data) ? h.parse("nama_dosen", data[0]) : "",
      }));
   };

   return (
      <AsyncTypeahead
         id="dosen"
         isLoading={isSearch}
         onSearch={handleSearch}
         onChange={handleChange}
         options={options.map((row) => ({ ...row, label: `${row.nidn} - ${h.parse("nama_dosen", row)}` }))}
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
