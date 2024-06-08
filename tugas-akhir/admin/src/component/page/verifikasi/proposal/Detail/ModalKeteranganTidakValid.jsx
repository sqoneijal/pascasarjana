import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const ModalKeteranganTidakValid = ({ handleChangeValidStatus }) => {
   const { module } = useSelector((e) => e.redux);
   const { openModalTidakValid, keyCatatan } = module;
   const dispatch = useDispatch();

   // object
   const [input, setInput] = useState({});
   const [errors, setErrors] = useState({});

   const clearProps = () => {
      dispatch(setModule({ ...module, openModalTidakValid: false, keyCatatan: "" }));
      setInput({});
      setErrors({});
   };

   const submit = () => {
      if (h.parse("catatan", input)) {
         handleChangeValidStatus(
            {
               name: keyCatatan,
               checked: true,
            },
            "not_valid",
            h.parse("catatan", input)
         );
      } else {
         setErrors({ catatan: "Catatan tidak boleh kosong." });
      }
   };

   return (
      <Modal show={openModalTidakValid} onHide={clearProps} backdrop="static">
         <Modal.Header closeButton>
            <Modal.Title>Catatan Kenapa Tidak Valid</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <h5>{h.keteranganLampiran(keyCatatan)}</h5>
            {h.form_textarea(
               `Catatan`,
               `catatan`,
               {
                  onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
                  value: h.parse(`catatan`, input),
                  style: { height: 100 },
               },
               true,
               errors
            )}
         </Modal.Body>
         <Modal.Footer>
            {h.buttons(`Simpan`, false, {
               onClick: () => submit(),
            })}
            {h.buttons(`Batal`, false, {
               variant: "danger",
               onClick: () => clearProps(),
            })}
         </Modal.Footer>
      </Modal>
   );
};
export default ModalKeteranganTidakValid;
