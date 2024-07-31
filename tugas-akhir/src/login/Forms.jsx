import lozad from "lozad";
import React, { useLayoutEffect, useState } from "react";
import { Form } from "react-bootstrap";
import * as h from "~/Helpers";

const Forms = () => {
   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [input, setInput] = useState({});
   const [errors, setErrors] = useState({});

   useLayoutEffect(() => {
      lozad().observe();
      return () => {};
   }, []);

   const submit = (e) => {
      e.preventDefault();
      const formData = {};
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submit`, formData, {}, true);
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

         window.open(data.redirect_to, "_parent");
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <Form className="form w-100" onSubmit={isSubmit ? null : submit}>
         <div className="text-center mb-11">
            <h1 className="text-gray-900 fw-bolder mb-3">Log In</h1>
            <div className="text-gray-500 fw-semibold fs-6">Akun Sistem Anda</div>
         </div>
         {h.form_text(
            `Email/Username`,
            `username`,
            {
               onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
               value: h.parse(`username`, input),
               autoFocus: true,
            },
            true,
            errors
         )}
         {h.form_password(
            `Passsword`,
            `password`,
            {
               onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
               defaultValue: h.parse(`password`, input),
            },
            true,
            errors
         )}
         <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
            <div />
            <a href="#" className="link-primary">
               Lupa Password ?
            </a>
         </div>
         <div className="d-grid mb-10">
            {h.buttons("Sign In", isSubmit, {
               size: "lg",
               onClick: isSubmit ? null : submit,
            })}
         </div>
      </Form>
   );
};
export default Forms;
