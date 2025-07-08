// src/components/TrackTimeline.jsx
import React, { useEffect, useState } from 'react';
import { getTrackSuratMasuk } from '../../modules/fetch/surat-masuk';
import { format, isThisYear, isToday } from 'date-fns';
import { enUS, id } from "date-fns/locale";
import { CheckCircle } from 'lucide-react';

const locale = id;
export default function TrackSuratMasuk({ events }) {
  if (!events || events.length === 0) {
    return <p className="text-gray-500">Belum ada jejak perjalanan.</p>;
  }

  const chrono = [...events].sort(
    (a, b) => new Date(a.at) - new Date(b.at)
  );

   const lastEvent = chrono[chrono.length - 1];
  const isAllDone = lastEvent.key === 'diarsipkan';

  return (
    <div className="relative overflow-x-auto px-4 py-8">

     <div className="flex space-x-8">
      {chrono.map((ev, idx) => {
                const isDone = isAllDone || idx < chrono.length - 1;
      
                 const date = new Date(ev.at);
                // const labelDate = isToday(date)
                //   ? 'Today'
                //   : isThisYear(date)
                //   ? format(date, 'd MMM yyyy', { locale: enUS })
                //   : format(date, 'yyyy', { locale: enUS });
                // const timeStr = format(date, 'dd MMM yyyy, HH:mm', { locale: id });
      
                return (

        <div key={idx} className="relative flex flex-col items-center">
          <span
          className={
                  `z-10 grid h-10 w-10 place-items-center rounded-full ` +
                  (isDone
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-700')
                }
          >
                        <CheckCircle className="h-5 w-5" />
                      </span>

                      {/* Garis penghubung ke kanan */}
            {idx < chrono.length - 1 && (
                <div
                  className={
                    `absolute top-5 right-[-2.5rem] w-12 h-0.5 ` +
                    (isDone
                      ? 'bg-green-500'
                      : 'bg-gray-300')
                  }
                />
              )}
          
          <div className="mt-4 text-center">
            {/* Judul event */}
            <p className="font-sans text-base font-semibold text-slate-800 antialiased dark:text-white">
              {ev.event}
            </p>
            
            <p className="font-sans text-base text-slate-800 antialiased dark:text-white">
              {ev.aktor}
            </p>

            {/* Timestamp */}
            <small className="mt-2 font-sans text-sm text-slate-600 antialiased">
              {format(new Date(ev.timestamp), 'dd MMM yyyy, HH:mm', {locale})}
            </small>
          </div>
        </div>
      )})}
    </div>
    </div>
  );
}


