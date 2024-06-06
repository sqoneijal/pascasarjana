import moment from "moment";
import React, { useLayoutEffect, useState } from "react";
import { ButtonGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const FormsJadwalSidang = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openFormsJadwalSidang, detailContent, jadwalSidang } = module;
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [input, setInput] = useState({});
   const [errors, setErrors] = useState({});

   useLayoutEffect(() => {
      if (openFormsJadwalSidang && h.objLength(jadwalSidang)) setInput({ ...jadwalSidang });
      return () => {};
   }, [openFormsJadwalSidang, jadwalSidang]);

   const handleClose = () => {
      clearProps();
      dispatch(setModule({ ...module, openFormsJadwalSidang: false }));
   };

   const clearProps = () => {
      setInput({});
      setErrors({});
   };

   const submit = (e) => {
      e.preventDefault();
      const formData = {
         nim: h.parse("nim", detailContent),
         id_status_tugas_akhir: h.parse("id", detailContent),
         user_modified: h.parse("username", init),
      };
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submitjadwalsidang`, formData);
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

         dispatch(
            setModule({ ...module, openFormsJadwalSidang: false, jadwalSidang: { ...data.content }, detailContent: { ...detailContent, status: 24 } })
         );
         clearProps();
         h.dtReload();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <Modal show={openFormsJadwalSidang} onHide={handleClose} backdrop="static">
         <Modal.Header>
            <Modal.Title>Penentuan Jadwal Sidang</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            {h.date_picker(
               "Tanggal Sidang",
               "tanggal",
               {
                  onChange: ([date]) => setInput((prev) => ({ ...prev, tanggal: moment(date).format("YYYY-MM-DD") })),
                  value: h.parse("tanggal", input),
               },
               true,
               errors
            )}
            {h.date_picker(
               "Jam Sidang",
               "jam",
               {
                  onChange: ([date]) => setInput((prev) => ({ ...prev, jam: moment(date).format("hh:mm") })),
                  value: h.parse("jam", input),
                  options: {
                     enableTime: true,
                     noCalendar: true,
                     dateFormat: "H:i",
                  },
               },
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
                  onClick: () => handleClose(),
               })}
            </ButtonGroup>
         </Modal.Footer>
      </Modal>
   );
};
export default FormsJadwalSidang;
