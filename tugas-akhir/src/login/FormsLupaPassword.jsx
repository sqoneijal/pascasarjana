import lozad from "lozad";
import React, { useLayoutEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const FormsLupaPassword = ({ setShowFormsLupaPassword }) => {
   const { module } = useSelector((e) => e.redux);
   const { dataLupaPassword } = module;

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [errors, setErrors] = useState({});
   const [input, setInput] = useState({});

   useLayoutEffect(() => {
      if (h.objLength(dataLupaPassword)) {
         setInput({ ...dataLupaPassword });
      }
      return () => {};
   }, [dataLupaPassword]);

   useLayoutEffect(() => {
      lozad().observe();
      return () => {};
   }, []);

   const submit = (e) => {
      e.preventDefault();
      const formData = {};
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submitresetpassword`, formData, {}, true);
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

         setShowFormsLupaPassword(false);
         window.history.pushState(null, null, "/");
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <Form className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework">
         <div className="text-center mb-10">
            <h1 className="text-gray-900 fw-bolder mb-3">Lupa Password ?</h1>
            <div className="text-gray-500 fw-semibold fs-6">Silahkan ketikkan kata sandi yang baru.</div>
         </div>
         <div className="mb-8">
            {h.form_text(
               `Email`,
               `email`,
               {
                  value: h.parse(`email`, input),
                  disabled: true,
               },
               true,
               errors
            )}
            {h.form_password(
               `Password Baru`,
               `password`,
               { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse(`password`, input) },
               true,
               errors
            )}
            {h.form_password(
               `Konfirmasi Password Baru`,
               `confirm_password`,
               { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse(`confirm_password`, input) },
               true,
               errors
            )}
         </div>
         <div className="d-flex flex-wrap justify-content-center pb-lg-0">
            {h.buttons(`Reset Password`, isSubmit, {
               onClick: isSubmit ? null : submit,
            })}
         </div>
      </Form>
   );
};
export default FormsLupaPassword;
