import React, { useState } from "react";
import { ButtonGroup, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const LupaPassword = () => {
   const { module } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [errors, setErrors] = useState({});
   const [input, setInput] = useState({});

   const handleClose = () => {
      setErrors({});
      setInput({});
      dispatch(setModule({ ...module, loginStatusPage: "login" }));
   };

   const submit = (e) => {
      e.preventDefault();
      const formData = {};
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submitlupapassword`, formData, {}, true);
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
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <Form className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework">
         <div className="text-center mb-10">
            <h1 className="text-gray-900 fw-bolder mb-3">Lupa Password ?</h1>
            <div className="text-gray-500 fw-semibold fs-6">Masukkan email Anda untuk mengatur ulang kata sandi.</div>
         </div>
         <div className="mb-8">
            {h.form_text(
               `Email`,
               `email`,
               { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse(`email`, input) },
               true,
               errors
            )}
         </div>
         <div className="d-flex flex-wrap justify-content-center pb-lg-0">
            <ButtonGroup>
               {h.buttons(`Submit`, isSubmit, {
                  onClick: isSubmit ? null : submit,
               })}
               {h.buttons(`Batal`, false, {
                  variant: "danger",
                  onClick: () => handleClose(),
               })}
            </ButtonGroup>
         </div>
      </Form>
   );
};
export default LupaPassword;
