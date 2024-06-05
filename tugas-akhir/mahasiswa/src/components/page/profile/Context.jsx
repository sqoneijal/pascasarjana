import React, { useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const Context = () => {
   const { init } = useSelector((e) => e.redux);

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [errors, setErrors] = useState({});
   const [input, setInput] = useState({});

   useLayoutEffect(() => {
      setInput({ ...init, username: h.parse("nim", init), old_email: h.parse("email", init) });
      return () => {};
   }, [init]);

   const submit = (e) => {
      e.preventDefault();
      const formData = { user_modified: h.parse("nim", init) };
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submit`, formData);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         setErrors(data.errors);
         h.notification(data.status, data.msg_response);

         if (!data.status) return;

         setTimeout(() => {
            window.location.reload();
         }, 1000);
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <div id="kt_content_container" className="d-flex flex-column-fluid align-items-start container-xxl">
         <div className="content flex-row-fluid" id="kt_content">
            <Card className="shadow-sm card-bordered">
               <Card.Body>
                  {h.form_text(
                     `Nama Lengkap`,
                     `nama`,
                     { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse(`nama`, input) },
                     true,
                     errors
                  )}
                  {h.form_text(
                     `Email`,
                     `email`,
                     { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse(`email`, input) },
                     true,
                     errors
                  )}
                  {h.form_text(`Username`, `username`, { disabled: true, value: h.parse(`username`, input) })}
                  {h.form_password(
                     `Password`,
                     `password`,
                     {
                        onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                        defaultValue: h.parse(`password`, input),
                     },
                     false,
                     errors
                  )}
               </Card.Body>
               <Card.Footer>
                  {h.buttons(`Update ${document.title}`, isSubmit, {
                     onClick: isSubmit ? null : submit,
                  })}
               </Card.Footer>
            </Card>
         </div>
      </div>
   );
};
export default Context;
