import React, {useEffect, useState} from 'react';
import { getTrackSuratKeluar } from '../../modules/fetch/surat-keluar';
import { format, isToday, isThisYear } from 'date-fns';
import { id } from "date-fns/locale";
import { enUS } from 'date-fns/locale';
import { Mail, CalendarCheck, Clock, CheckCircle } from 'lucide-react';

export default function SuratKeluarTracker({ timeline }) {
  // const [timeline, setTimeline] = useState([]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await getTrackSuratKeluar(suratId);
  //       setTimeline(res.data);
  //     } catch (err) {
  //       console.error('Gagal load tracking', err);
  //     }
  //   })();
  // }, [suratId]);

  if (!timeline.length) {
    return <p className="text-gray-500">Belum ada jejak perjalanan.</p>;
  }

  if (!timeline || timeline.length === 0) {
    return <p className="text-gray-500">Belum ada jejak perjalanan.</p>;
  }

  const sorted = [...timeline].sort((a,b) => new Date(b.at) - new Date(a.at));

  // 2) group by label (Today / 19 May 2018 / 2017)
  const groups = sorted.reduce((acc, ev) => {
    const date = new Date(ev.at);
    let key;
    if (isToday(date)) key = 'Today';
    else if (isThisYear(date)) key = format(date, 'd MMM yyyy', { locale: enUS });
    else key = format(date, 'yyyy', { locale: enUS });

    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});



  const Icon = ({ type }) => {
    switch (type) {
      case 'created':    return <Clock className="h-5 w-5 text-white" />;
      case 'requested':  return <Mail className="h-5 w-5 text-white" />;
      case 'approved':   return <CalendarCheck className="h-5 w-5 text-white" />;
      default:           return <Clock className="h-5 w-5 text-white" />;
    }
  };

  return (
    // <div className="space-y-8">
    //   {Object.entries(groups).map(([groupLabel, evs]) => (
    //     <div key={groupLabel}>
    //       <h4 className="mb-4 font-semibold text-gray-600">{groupLabel}</h4>
    //       <div className="relative border-l border-gray-200 pl-8">
    //         {evs.map((ev, idx) => (
    //           <div key={ev.key || idx} className="mb-8 flex items-start">
    //             <div className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
    //               <Icon type={ev.eventType} />
    //             </div>
    //             <div>
    //               <p className="text-sm font-semibold text-gray-800">
    //                 {ev.title}
    //               </p>
    //               {ev.subTitle && (
    //                 <p className="text-xs text-gray-500">{ev.subTitle}</p>
    //               )}
    //               <p className="mt-1 text-xs text-gray-400">
    //                 {format(new Date(ev.at), 'h:mm a', { locale: enUS })}
    //               </p>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   ))}
    // </div>

    <div className="relative overflow-x-auto px-4 py-8">
      {/* Garis horizontal utama */}

      <div className="flex space-x-8">
        {timeline.map((ev, idx) => (
          <div key={idx} className="relative flex flex-col items-center">
            {/* Ikon bulat */}
            <span className="z-10 grid h-10 w-10 place-items-center rounded-full bg-slate-200 text-slate-800">
              <CheckCircle className="h-5 w-5" />
            </span>

            {/* Garis penghubung ke kanan */}
            {idx < timeline.length - 1 && (
              <div className="absolute top-5 right-[-2.5rem]  w-12 h-0.5 bg-slate-200" />
            )}

            {/* Konten event */}
            <div className="mt-4 text-center">
              <p className="text-sm leading-normal text-gray-800 dark:text-gray-400">{ev.title}</p>
              {ev.subTitle && (
                <p className="text-xs text-gray-500">{ev.subTitle}</p>
              )}
              <small className="block mt-1 text-sm text-slate-600">
                {format(new Date(ev.at), 'dd MMM yyyy, HH:mm', { locale: id })}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
