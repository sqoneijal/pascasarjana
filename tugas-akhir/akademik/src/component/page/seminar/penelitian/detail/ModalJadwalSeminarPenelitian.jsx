import moment from "moment";
import React, { useLayoutEffect, useState } from "react";
import { ButtonGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const ModalJadwalSeminarPenelitian = () => {
   const { module, init } = useSelector((e) => e.redux);
   const { openModalJadwalSeminarPenelitian, penelitian, detailContent, jadwalSeminarPenelitian } = module;
   const dispatch = useDispatch();

   // bool
   const [isSubmit, setIsSubmit] = useState(false);

   // object
   const [input, setInput] = useState({});
   const [errors, setErrors] = useState({});

   useLayoutEffect(() => {
      if (openModalJadwalSeminarPenelitian && h.objLength(jadwalSeminarPenelitian)) setInput({ ...jadwalSeminarPenelitian });
      return () => {};
   }, [openModalJadwalSeminarPenelitian, jadwalSeminarPenelitian]);

   const clearProps = () => {
      dispatch(setModule({ ...module, openModalJadwalSeminarPenelitian: false }));
   };

   const submit = (e) => {
      e.preventDefault();
      const formData = {
         user_modified: h.parse("username", init),
         id_penelitian: h.parse("id", penelitian),
         id_status_tugas_akhir: h.parse("id", detailContent),
      };
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submitjadwalseminar`, formData);
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

         h.dtReload();
         dispatch(
            setModule({
               ...module,
               openModalJadwalSeminarPenelitian: false,
               jadwalSeminarPenelitian: data.content,
               detailContent: { ...detailContent, status: 12 },
            })
         );
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   return (
      <Modal show={openModalJadwalSeminarPenelitian} onHide={clearProps} backdrop="static">
         <Modal.Header>
            <Modal.Title>Penentuan Jadwal Seminar Penelitian</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            {h.date_picker(
               "Tanggal Seminar",
               "tanggal_seminar",
               {
                  onChange: ([date]) => setInput((prev) => ({ ...prev, tanggal_seminar: moment(date).format("YYYY-MM-DD") })),
                  value: h.parse("tanggal_seminar", input),
               },
               true,
               errors
            )}
            {h.date_picker(
               "Jam Seminar",
               "jam_seminar",
               {
                  onChange: ([date]) => setInput((prev) => ({ ...prev, jam_seminar: moment(date).format("hh:mm") })),
                  value: h.parse("jam_seminar", input),
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
                  onClick: () => clearProps(),
               })}
            </ButtonGroup>
         </Modal.Footer>
      </Modal>
   );
};
export default ModalJadwalSeminarPenelitian;
