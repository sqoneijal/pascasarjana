import React, { useLayoutEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import PasswordStrengthBar from "react-password-strength-bar";
import { useDispatch, useSelector } from "react-redux";
import * as h from "~/Helpers";
import { setModule } from "~/redux";

const Register = () => {
   const { module } = useSelector((e) => e.redux);
   const dispatch = useDispatch();

   // bool
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmit, setIsSubmit] = useState(false);
   const [showCompleteForms, setShowCompleteForms] = useState(false);

   // array
   const [daftarProdi, setDaftarProdi] = useState([]);

   // object
   const [input, setInput] = useState({});
   const [errors, setErrors] = useState({});

   const handleClose = () => {
      dispatch(setModule({ ...module, openFormsRegister: false }));
      setInput({});
      setErrors({});
      setShowCompleteForms(false);
   };

   const initPage = () => {
      const fetch = h.get(`/initregister`, {}, true);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;

         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         setDaftarProdi(data.daftarProdi);
      });
      fetch.finally(() => {
         setIsLoading(false);
      });
   };

   const submit = (e) => {
      e.preventDefault();
      const formData = {};
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/submitdaftar`, formData, {}, true);
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

         handleClose();
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   useLayoutEffect(() => {
      initPage();
      return () => {};
   }, []);

   const cariMahasiswa = (e) => {
      e.preventDefault();
      const formData = {};
      Object.keys(input).forEach((key) => (formData[key] = input[key]));

      setIsSubmit(true);
      const fetch = h.post(`/carimahasiswa`, formData, {}, true);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         setErrors(data.errors);

         if (!data.status) {
            h.notification(data.status, data.msg_response);
            return;
         }

         setShowCompleteForms(true);
         setInput((prev) => ({
            ...prev,
            angkatan: data.content.id_periode_masuk.slice(0, -1),
            nama: h.parse("nama_mahasiswa", data.content),
            username: data.content.nim,
         }));
      });
      fetch.finally(() => {
         setIsSubmit(false);
      });
   };

   const loader = (
      <Bars
         visible={true}
         color="#4fa94d"
         radius="9"
         wrapperStyle={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
         }}
         wrapperClass="page-loader flex-column bg-dark bg-opacity-25"
      />
   );

   return isLoading ? (
      loader
   ) : (
      <Form className="form w-100" onSubmit={isSubmit ? null : submit}>
         <div className="text-center mb-11">
            <h1 className="text-gray-900 fw-bolder mb-3">Daftar Akun</h1>
            <div className="text-gray-500 fw-semibold fs-6">Pendaftaran akun tugas akhir</div>
         </div>
         {h.form_select(
            "Program Studi",
            "id_prodi",
            {
               onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
               value: h.parse("id_prodi", input),
               disabled: showCompleteForms,
            },
            daftarProdi.map((row) => ({ value: h.parse("id_feeder", row), label: h.parse("nama", row) })),
            true,
            errors
         )}
         {h.form_text(
            `NIM`,
            `nim`,
            {
               onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })),
               value: h.parse(`nim`, input),
               disabled: !h.parse("id_prodi", input) || showCompleteForms,
            },
            true,
            errors
         )}
         {showCompleteForms && (
            <React.Fragment>
               {h.form_text(
                  `Username`,
                  `username`,
                  {
                     value: h.parse(`username`, input),
                     disabled: true,
                  },
                  true,
                  errors
               )}
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
                  {
                     onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value.toLowerCase().trim() })),
                     value: h.parse(`email`, input),
                  },
                  true,
                  errors
               )}
               {h.form_password(
                  `Password`,
                  `password`,
                  { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse(`password`, input) },
                  true,
                  errors
               )}
               <PasswordStrengthBar password={h.parse("password", input)} className="mb-2" minLength={5} minScore={5} />
               {h.form_password(
                  `Konfirmasi Password`,
                  `confirm_password`,
                  { onChange: (e) => setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })), value: h.parse(`confirm_password`, input) },
                  true,
                  errors
               )}
            </React.Fragment>
         )}
         <div className="d-grid mb-10">
            {showCompleteForms
               ? h.buttons("Daftar", isSubmit, {
                    size: "lg",
                    onClick: isSubmit ? null : submit,
                 })
               : h.buttons("Selanjutnya", isSubmit, {
                    size: "lg",
                    onClick: isSubmit ? null : cariMahasiswa,
                 })}
         </div>
         <div className="text-gray-500 text-center fw-semibold fs-6">
            Sudah memiliki akun tugas akhir?
            <br />
            <a
               href="#"
               className="link-primary"
               onClick={(e) => {
                  e.preventDefault();
                  handleClose();
               }}>
               Klik disini
            </a>{" "}
            untuk melakukan login
         </div>
      </Form>
   );
};
export default Register;
