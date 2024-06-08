import React, { useState } from "react";
import { ButtonGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const ModalConfirmVerifikasi = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openModalConfirmVerifikasi, statusTugasAkhir } = module;
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [input, setInput] = useState({});
   const [errors, setErrors] = useState({});

   const clearProps = () => {
      dispatch(setModule({ ...module, openModalConfirmVerifikasi: false }));
   };

   const submit = (e) => {
      e.preventDefault();
      const formData = { user_modified: h.parse("username", init), id: h.parse("id", statusTugasAkhir) };
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

         dispatch(setModule({ ...module, openDetail: false, detailContent: {}, openModalConfirmVerifikasi: false }));
         setInput({});
         setErrors({});
         h.dtReload();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   const daftarStatusVerifikasi = [
      { value: "5", label: "Terima" },
      { value: "3", label: "Perbaiki" },
   ];

   return (
      <Modal show={openModalConfirmVerifikasi} onHide={clearProps} backdrop="static">
         <Modal.Header>
            <Modal.Title>Konfirmasi Verifikasi</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            {h.form_select(
               "Status Verifikasi",
               "status",
               { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse("status", input) },
               daftarStatusVerifikasi,
               true,
               errors
            )}
         </Modal.Body>
         <Modal.Footer>
            <ButtonGroup>
               {h.buttons(`Simpan`, isSubmit, {
                  onClick: isSubmit ? null : submit,
               })}
               {h.buttons(`Batal`, false, {
                  variant: "danger",
                  onClick: () => clearProps(),
               })}
            </ButtonGroup>
         </Modal.Footer>
      </Modal>
   );
};
export default ModalConfirmVerifikasi;
