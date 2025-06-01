// src/components/TrackTimeline.jsx
import React, { useEffect, useState } from 'react';
import { getTrackSuratMasuk } from '../../modules/fetch/surat-masuk';
import { format }                    from 'date-fns';
import { id } from "date-fns/locale";
import { CheckCircle } from 'lucide-react';

const locale = id;
export default function TrackSuratMasuk({ events }) {
  // const [events, setEvents] = useState([]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const data = await getTrackSuratMasuk(suratId);
  //       setEvents(data.data);
  //     } catch (err) {
  //       console.error('Gagal memuat track:', err);
  //     }
  //   })();
  // }, [suratId]);

  if (!events.length) {
    return <p className="text-gray-500">Belum ada jejak perjalanan.</p>;
  }

  if (!events || events.length === 0) {
    return <p className="text-gray-500">Belum ada jejak perjalanan.</p>;
  }

  return (
    // <ol className="border-l-2 border-gray-200 dark:border-gray-700 ml-4">
    //   {events.map((ev, i) => (
    //     <li key={i} className="mb-6 ml-6">
    //       <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-600 rounded-full">
    //         <svg 
    //           className="w-3 h-3 text-white" 
    //           fill="currentColor" 
    //           viewBox="0 0 20 20"
    //         >
    //           <path d="M2 11l6 6L18 3"></path>
    //         </svg>
    //       </span>
    //       <div className="text-sm text-gray-500">
    //         {format(new Date(ev.timestamp), 'PPpp')}
    //       </div>
    //       <h4 className="mt-1 text-lg font-semibold text-gray-800">
    //         {ev.event}
    //       </h4>
    //       {ev.details && (
    //         <p className="mt-1 text-gray-600">{ev.details}</p>
    //       )}
    //     </li>
    //   ))}
    // </ol>

    <div className="relative overflow-x-auto px-4 py-8">

     <div className="flex space-x-8">
      {events.map((ev, idx) => (
        <div key={idx} className="relative flex flex-col items-center">
          <span className="z-10 grid h-10 w-10 place-items-center rounded-full bg-slate-200 text-slate-800">
                        <CheckCircle className="h-5 w-5" />
                      </span>

                      {/* Garis penghubung ke kanan */}
            {idx < events.length - 1 && (
              <div className="absolute top-5 right-[-2.5rem]  w-12 h-0.5 bg-slate-200" />
            )}
          
          <div className="mt-4 text-center">
            {/* Judul event */}
            <p className="font-sans text-base font-bold text-slate-800 antialiased dark:text-white">
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
      ))}
    </div>
    </div>
  );
}


