import React from "react";
import { Card, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const SeminarHasilPenelitian = () => {
   const { module } = useSelector((e) => e.redux);
   const { status_tesis } = module;
   const { seminar_hasil_penelitian } = status_tesis;

   return (
      <Card className="shadow-sm card-bordered card-flush">
         <Card.Header>
            <h3 className="card-title">Seminar Hasil Penelitian</h3>
         </Card.Header>
         <Card.Body className="card-scroll h-350px">
            <Table responsive hover className="align-middle table-row-dashed fs-6" size="sm">
               <tbody className="text-gray-600 fw-semibold">
                  <Each
                     of={seminar_hasil_penelitian}
                     render={(row) => (
                        <tr>
                           <td>{h.parse("short_name", row)}</td>
                           <td className="text-center">{row.jumlah}</td>
                        </tr>
                     )}
                  />
               </tbody>
            </Table>
         </Card.Body>
      </Card>
   );
};
export default SeminarHasilPenelitian;
