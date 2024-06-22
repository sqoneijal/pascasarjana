import React, { useLayoutEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setInit } from "~/redux";

const Overview = () => {
   const { init } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [errors, setErrors] = useState({});
   const [input, setInput] = useState({});

   useLayoutEffect(() => {
      setInput({ ...init, old_email: h.parse("email", init) });
      return () => {};
   }, [init]);

   const submit = (e) => {
      e.preventDefault();
      const formData = {};
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

         dispatch(setInit({ ...init, ...data.content }));
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <Card className="mb-5 mb-xl-10">
         <Card.Header className="cursor-pointer">
            <Card.Title className="m-0">
               <h3 className="fw-bold m-0">Detail Profile</h3>
            </Card.Title>
            {h.buttons(`Update Profile`, isSubmit, {
               onClick: isSubmit ? null : submit,
               className: "align-self-center",
            })}
         </Card.Header>
         <Card.Body className="p-9">
            <Row>
               <Col>
                  {h.form_text(
                     `Nama Lengkap`,
                     `nama`,
                     { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse(`nama`, input) },
                     true,
                     errors
                  )}
               </Col>
               <Col>
                  {h.form_text(
                     `Email`,
                     `email`,
                     {
                        onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value.toLowerCase() })),
                        value: h.parse(`email`, input),
                     },
                     true,
                     errors
                  )}
               </Col>
            </Row>
            <Row>
               <Col>
                  {h.form_text(`Username`, `username`, {
                     value: h.parse(`username`, input),
                     disabled: true,
                  })}
               </Col>
               <Col>
                  {h.form_password(`Password Baru`, `password`, {
                     onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                     value: h.parse(`password`, input),
                  })}
               </Col>
            </Row>
         </Card.Body>
      </Card>
   );
};
export default Overview;
