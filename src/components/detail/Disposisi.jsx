import React, {useState, useEffect} from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { editDisposisi, updateDisposisiStatus } from "../../modules/fetch/disposisi";
import { getUserName } from "../../modules/fetch/user";
import Swal from "sweetalert2";
import Select from "../form/Select";
import DisposisiInputModal from "../form/form-surat/inputDisposisi";
import { useAuth } from "../../context/AuthContext";
import Badge from "../ui/badge/Badge";
import { format }                    from 'date-fns';
import { id } from "date-fns/locale";

const locale = id;

export default function Disposisi({data, ID, refreshData, role, me, statusSurat}) {
  const [disposisiList, setDisposisiList] = useState(data);
  const [isModalOpen, setIsModalOpen] = useState(false);

   // sinkronisasi prop data (array)
  useEffect(() => {
    setDisposisiList(Array.isArray(data) ? data : []);
    
  }, [data]);

  const handleStatusUpdate = async (id, newStatus) => {
    let payload = { status: newStatus };

    // Jika pindah ke 'selesai', minta catatan tindak lanjut
    if (newStatus === 'selesai') {
      const { value: catatan } = await Swal.fire({
        title: 'Catatan Tindak Lanjut',
        input: 'textarea',
        inputPlaceholder: 'Tuliskan apa yang sudah dikerjakan...',
        showCancelButton: true,
      });
      if (!catatan) {
        // batalkan jika tidak ada input
        return;
      }
      payload.catatan_tindak_lanjut = catatan;
    }

    try {
      Swal.fire({ title: 'Memproses…', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const updated = await updateDisposisiStatus(id, payload);
      Swal.close();
      Swal.fire('Berhasil', `Status diubah menjadi "${updated.data.status}"`, 'success');
      refreshData();
    } catch (err) {
      Swal.close();
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Disposisi
          </h4>
          
                <ul className="space-y-2">
                  {(disposisiList.length > 0
                    ? disposisiList
                    : [{
                        id: 'empty',
                        no_agenda: '-',
                        type_surat: '-',
                        tindakan: '-',
                        diteruskan: '-',
                        ket_disposisi: '-'
                      }]
                  ).map((item, idx) => (
                    <li key={item.id} className="p-3">
                       <div className="flex flex-col p-4 border border-gray-200 dark:border-gray-800 rounded-2xl gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                      <div className="xl:w-100">
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                          Nomor Agenda
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {item.no_agenda}
                        </p>
                      </div>

                      <div className="xl:w-100">
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                          Type surat
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {item.type_surat}
                        </p>
                      </div>

                      <div className="xl:w-100">
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                          Tindakan
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {item.tindakan}
                        </p>
                      </div>

                      <div className="xl:w-100">
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                          Diteruskan
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {item.diteruskan}
                        </p>
                      </div>

                      <div className="xl:w-100">
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                          Keterangan Disposisi
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {item.ket_disposisi}
                        </p>
                      </div>

                      <div className="xl:w-100">
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                          Status
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                           <Badge
                            variant="solid"
                            size="md"
                            color={
                              item.status === "belum_dibaca"
                                ? "draft"
                                : item.status === "dibaca"
                                ? "review"
                                : item.status === "diproses"
                                ? "diproses"
                                : item.status === "selesai"
                                ? "selesai"
                                : "error"
                            }
                          >
                            {item.status}
                          </Badge>
                        </p>
                        </div>
                          {item.status === 'selesai' && (
                            <div className="xl:w-100">
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                              Catatan Tindak Lanjut
                            </p> 
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90"> 
                              {item.catatan_tindak_lanjut}
                            </p>
                          </div>
                          )}
                          {item.status === 'selesai' && item.waktu_selesai && (
                            <div className="xl:w-100">
                              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Waktu Selesai
                              </p>
                              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {format(new Date(item.waktu_selesai), 'dd MMM yyyy, HH:mm', {locale})}
                              </p>
                            </div>
                          )}
                        
                      
                    </div>
                    {item.diteruskan === me && (
                    <div className="space-y-2">
                      {item.status === 'belum_dibaca' && (
                        <Button
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                          onClick={() => handleStatusUpdate(item.id,'dibaca')}
                        >
                          Mark as Read
                        </Button>
                      )}
                      {item.status === 'dibaca' && (
                        <Button
                          className="px-3 py-1 bg-yellow-500 text-white rounded"
                          onClick={() => handleStatusUpdate(item.id, 'diproses')}
                        >
                          Proses
                        </Button>
                      )}
                      {item.status === 'diproses' && (
                        <Button
                          className="px-3 py-1 bg-green-500 text-white rounded"
                          onClick={() => handleStatusUpdate(item.id, 'selesai')}
                        >
                          Selesai
                        </Button>
                      )}
                    </div>
                    )}
                </div>
            </li>
                  ))}
                  </ul>
              
        </div>
      {(role === "kadep" || role === "sekdep") && statusSurat !== "diarsipkan" && statusSurat !== "waiting_to_archive" && (
        <button
            onClick={() => setIsModalOpen(true)}
            className="flex w-full items-center cursor-pointer justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Tambah Disposisi
          </button>
      )}
      
      </div>

       <DisposisiInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        suratId={ID}
        refresh={() => refreshData()}
      />

    </div> 
  );
}
