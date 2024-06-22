import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const TimPembimbing = () => {
   const { module } = useSelector((e) => e.redux);
   const { pembimbing } = module;

   const renderStatus = (status) => {
      return status === "t" ? (
         <i className="ki-outline ki-flag fs-2 fw-bold text-success" />
      ) : (
         <i className="ki-outline ki-flag fs-2 fw-bold text-danger" />
      );
   };

   return (
      <Table responsive hover className="align-middle table-row-dashed fs-6" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th className="text-center">ke</th>
               <th>nidn/nik</th>
               <th>nama</th>
               <th>kategori kegiatan</th>
               <th />
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            <Each
               of={pembimbing}
               render={(row) => (
                  <React.Fragment>
                     <tr>
                        <td className="text-center">{h.parse("pembimbing_ke", row)}</td>
                        <td>{h.parse("nidn", row)}</td>
                        <td>{h.parse("nama_dosen", row)}</td>
                        <td>{h.parse("kategori_kegiatan", row)}</td>
                        <td className="text-end">{renderStatus(h.parse("sudah_seminar", row))}</td>
                     </tr>
                     {h.parse("sudah_seminar", row) === "f" && (
                        <tr>
                           <td />
                           <td colSpan={4} className="text-danger" style={{ fontStyle: "italic" }}>
                              {h.parse("keterangan_perbaikan", row)}
                           </td>
                        </tr>
                     )}
                  </React.Fragment>
               )}
            />
         </tbody>
      </Table>
   );
};
export default TimPembimbing;
