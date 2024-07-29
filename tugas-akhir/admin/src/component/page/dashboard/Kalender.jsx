import idLocale from "@fullcalendar/core/locales/id";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import React, { useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as h from "~/Helpers";

const Kalender = () => {
   const { module } = useSelector((e) => e.redux);
   const { kalender } = module;

   // array
   const [events, setEvents] = useState([]);

   useLayoutEffect(() => {
      const {
         tanggal_seminar_proposal,
         tanggal_seminar_hasil_penelitian,
         tanggal_sidang_munaqasyah,
         peserta_seminar_proposal,
         peserta_seminar_hasil_penelitian,
         peserta_sidang_munaqasyah,
      } = kalender;

      const data = [
         {
            title: "Seminar Proposal",
            start: h.parse("tanggal_mulai", tanggal_seminar_proposal),
            end: h.parse("tanggal_sampai", tanggal_seminar_proposal),
         },
         {
            title: "Seminar Hasil Penelitian",
            start: h.parse("tanggal_mulai", tanggal_seminar_hasil_penelitian),
            end: h.parse("tanggal_sampai", tanggal_seminar_hasil_penelitian),
         },
         {
            title: "Sidang Munaqasyah",
            start: h.parse("tanggal_mulai", tanggal_sidang_munaqasyah),
            end: h.parse("tanggal_sampai", tanggal_sidang_munaqasyah),
         },
      ];

      peserta_seminar_proposal.map((row) => {
         data.push({
            groupId: 1,
            title: h.parse("nama", row),
            start: `${h.parse("tanggal_seminar", row)}T${h.parse("jam_seminar", row)}`,
         });
      });

      peserta_seminar_hasil_penelitian.map((row) => {
         data.push({
            groupId: 2,
            title: h.parse("nama", row),
            start: `${h.parse("tanggal_seminar", row)}T${h.parse("jam_seminar", row)}`,
         });
      });

      peserta_sidang_munaqasyah.map((row) => {
         data.push({
            groupId: 2,
            title: h.parse("nama", row),
            start: `${h.parse("tanggal", row)}T${h.parse("jam", row)}`,
         });
      });

      setEvents(data);
      return () => {};
   }, [kalender]);

   return (
      <Card className="shadow-sm card-bordered gx-5 gx-xl-10 mb-xl-10 mt-5">
         <Card.Body>
            <FullCalendar
               locale={idLocale}
               plugins={[dayGridPlugin]}
               initialView="dayGridMonth"
               events={events}
               eventTimeFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  meridiem: true,
               }}
               headerToolbar={{
                  left: false,
                  center: "title",
                  right: false,
               }}
            />
         </Card.Body>
      </Card>
   );
};
export default Kalender;
