import React from "react";
import { OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const DaftarPembimbingPenelitian = () => {
   const { module } = useSelector((e) => e.redux);
   const { pembimbingPenelitian } = module;

   return (
      <Table responsive hover className="align-middle table-row-dashed fs-6 mt-5" size="sm">
         <thead>
            <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
               <th className="text-center">pembimbing</th>
               <th>nidn/nik</th>
               <th>nama</th>
               <th>kategori kegiatan</th>
               <th style={{ width: `1%` }} />
            </tr>
         </thead>
         <tbody className="text-gray-600 fw-semibold">
            {h.arrLength(pembimbingPenelitian) ? (
               <Each
                  of={pembimbingPenelitian}
                  render={(row) => (
                     <tr>
                        <td className="text-center">{h.parse("pembimbing_ke", row)}</td>
                        <td>{h.parse("nidn", row)}</td>
                        <td>{h.parse("nama_dosen", row)}</td>
                        <td>{h.parse("kategori_kegiatan", row)}</td>
                        <td className="text-end">
                           {h.parse("seminar_penelitian", row) === "t" && (
                              <OverlayTrigger placement="top" overlay={<Tooltip>Boleh lanjut seminar penelitian</Tooltip>}>
                                 <i className="ki-outline ki-double-check fs-1 text-success fw-bold" />
                              </OverlayTrigger>
                           )}
                        </td>
                     </tr>
                  )}
               />
            ) : (
               h.table_empty(5)
            )}
         </tbody>
      </Table>
   );
};
export default DaftarPembimbingPenelitian;
