import moment from "moment";
import React, { useLayoutEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Each } from "~/Each";
import * as h from "~/Helpers";

const AksesLogs = () => {
   const { init } = useSelector((e) => e.redux);

   // array
   const [listContent, setListContent] = useState([]);

   const getData = (id) => {
      const formData = { id };

      const fetch = h.post(`/getakseslogs`, formData);
      fetch.then((res) => {
         if (typeof res === "undefined") return;

         const { data } = res;
         if (typeof data.code !== "undefined" && h.parse("code", data) !== 200) {
            h.notification(false, h.parse("message", data));
            return;
         }

         setListContent(data);
      });
   };

   useLayoutEffect(() => {
      getData(h.parse("id", init));
      return () => {};
   }, [init]);

   const renderLokasi = (city, region, country) => {
      return `${city} - ${region} - ${country}`;
   };

   return (
      <Card className="mb-5 mb-lg-10">
         <Card.Header>
            <Card.Title>
               <h3>Logs</h3>
            </Card.Title>
         </Card.Header>
         <Card.Body>
            <Table responsive hover className="align-middle table-row-dashed fs-6" size="sm">
               <tbody className="text-gray-600 fw-semibold">
                  <Each
                     of={listContent}
                     render={(row) => (
                        <tr>
                           <td>{h.parse("method", row)}</td>
                           <td>{h.parse("pathname", row)}</td>
                           <td>{moment(h.parse("time", row)).fromNow()}</td>
                        </tr>
                     )}
                  />
               </tbody>
            </Table>
         </Card.Body>
      </Card>
   );
};
export default AksesLogs;
