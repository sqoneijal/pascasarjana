import lozad from "lozad";
import React, { useLayoutEffect, useState } from "react";
import { Form } from "react-bootstrap";
import * as h from "~/Helpers";

const Login = () => {
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
      const fetch = h.post(`/login/submit`, formData, {}, true);
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

         const { role } = data.content;

         const loginToken = `login/${h.parse("token", data)}`;
         const deploy = process.env.NODE_ENV === "deploy";

         const roleRedirect = {
            1: deploy ? `https://admin.tesis.ar-raniry.ac.id/${loginToken}` : `http://localhost:8014/${loginToken}`,
            2: deploy ? `https://akademik.tesis.ar-raniry.ac.id/${loginToken}` : `http://localhost:8015/${loginToken}`,
            3: deploy ? `https://dosen.tesis.ar-raniry.ac.id/${loginToken}` : `http://localhost:8017/${loginToken}`,
            4: deploy ? `https://mahasiswa.tesis.ar-raniry.ac.id/${loginToken}` : `http://localhost:8011/${loginToken}`,
         };

         window.open(roleRedirect[h.toInt(role)], "_parent");
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <div className="d-flex flex-column flex-column-fluid flex-lg-row">
         <div className="d-flex flex-center w-lg-50 pt-15 pt-lg-0 px-10">
            <div className="d-flex flex-center flex-lg-start flex-column">
               <a className="mb-7">
                  <img alt="Logo" data-src={h.getFile("logo-uin.png")} className="lozad" />
               </a>
            </div>
         </div>
         <div className="d-flex flex-column-fluid flex-lg-row-auto justify-content-center justify-content-lg-end p-12 p-lg-20">
            <div className="bg-body d-flex flex-column align-items-stretch flex-center rounded-4 w-md-600px p-20">
               <div className="d-flex flex-center flex-column flex-column-fluid px-lg-10 pb-15 pb-lg-20">
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
                        <a href="/metronic8/demo1/authentication/layouts/creative/reset-password.html" className="link-primary">
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
               </div>
            </div>
         </div>
      </div>
   );
};
export default Login;
