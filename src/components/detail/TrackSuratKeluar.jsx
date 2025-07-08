import React, {useEffect, useState} from 'react';
import { getTrackSuratKeluar } from '../../modules/fetch/surat-keluar';
import { format, isToday, isThisYear } from 'date-fns';
import { id } from "date-fns/locale";
import { enUS } from 'date-fns/locale';
import { Mail, CalendarCheck, Clock, CheckCircle } from 'lucide-react';

export default function SuratKeluarTracker({ timeline }) {

  if (!timeline || timeline.length === 0) {
    return <p className="text-gray-500">Belum ada jejak perjalanan.</p>;
  }

   const chrono = [...timeline].sort(
    (a, b) => new Date(a.at) - new Date(b.at)
  );

   const lastEvent = chrono[chrono.length - 1];
  const isAllDone = lastEvent.key === 'archived';

  return (

    <div className="relative overflow-x-auto px-4 py-8">
      {/* Garis horizontal utama */}

      <div className="flex space-x-8">
        {chrono.map((ev, idx) => {
          const isDone = isAllDone || idx < chrono.length - 1;

           const date = new Date(ev.at);
          const labelDate = isToday(date)
            ? 'Today'
            : isThisYear(date)
            ? format(date, 'd MMM yyyy', { locale: enUS })
            : format(date, 'yyyy', { locale: enUS });
          const timeStr = format(date, 'dd MMM yyyy, HH:mm', { locale: id });

          return (
        
          <div key={idx} className="relative flex flex-col items-center">
            {/* Ikon bulat */}
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

            {/* Konten event */}
            <div className="mt-4 text-center">
              <p className="text-sm leading-normal text-gray-800 dark:text-gray-400">{ev.title}</p>
              {ev.subTitle && (
                <p className="text-xs text-gray-500">{ev.subTitle}</p>
              )}

              <p className="font-sans text-base text-slate-800 antialiased dark:text-white">
              {ev.aktor}
            </p>


              <small className="block mt-1 text-sm text-slate-600">
                {format(new Date(ev.at), 'dd MMM yyyy, HH:mm', { locale: id })}
              </small>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
