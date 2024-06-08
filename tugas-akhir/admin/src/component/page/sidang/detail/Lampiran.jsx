import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const Lampiran = () => {
   const { module } = useSelector((e) => e.redux);
   const { detailContent, lampiranSidang } = module;

   const daftarLampiran = [
      { id: "surat_permohonan", label: "Surat permohonan" },
      { id: "sk_pembimbing", label: "SK Pembimbing Tesis (Dilampirkan di Tesis)" },
      { id: "surat_pengantar", label: "Surat Pengantar penelitian dari Pasca dan Surat Keterangan Telah Melakukan Penelitian" },
      { id: "nilai_ujian", label: "Nilai Ujian Telah Mengikuti Seminar Hasil Penelitian" },
      { id: "lembar_persetujuan", label: "Melampirkan lembar persetujuan dari 4 orang penguji Seminar Penelitian Tesis" },
      { id: "transkrip", label: "Transkrip Nilai" },
      { id: "persetujuan_pembimbing", label: "Persetujuan Pembimbing Tesis (Dilampirkan di Tesis)" },
      { id: "slip_spp", label: "Melampirkan Slip setoran SPP Dari Semester 1 s/d yang Terakhir" },
      { id: "artikel_ilmiah", label: "Artikel Ilmiah dari Tesis/ Jurnal Disertai Dengan Abstrak 3 Bahasa di soft dalam CD dan prints 1 exs" },
      { id: "slip_yudisium", label: "Slip Sidang Dan Yudisium" },
      { id: "abstrak", label: "Melampirkan Tesis yang LENGKAP 1 exs, dan Abstrak 3 bahasa (Indonesia, Arab, Inggris)" },
      { id: "turnitin", label: "Melampiran Turnitin Check dari Program Studi" },
      { id: "hki", label: "HKI" },
   ];

   return (
      <Table responsive hover className="align-middle table-row-dashed fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th colSpan={2}>daftar lampiran</th>
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={daftarLampiran}
               render={(row) => (
                  <tr>
                     <td>{h.parse("label", row)}</td>
                     <td className="text-end" style={{ width: `5%` }}>
                        {h.parse(h.parse("id", row), lampiranSidang) && (
                           <a href={h.cdn(`media/${h.parse("nim", detailContent)}/${h.parse(h.parse("id", row), lampiranSidang)}`)} target="_blank">
                              lihat
                           </a>
                        )}
                     </td>
                  </tr>
               )}
            />
         </tbody>
      </Table>
   );
};
export default Lampiran;
