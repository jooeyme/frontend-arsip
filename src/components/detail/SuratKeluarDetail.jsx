import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { getByIdSuratKeluar, editSuratKeluar } from "../../modules/fetch/surat-keluar";
import { useParams } from "react-router-dom";
import Select from "../form/Select";
import Badge from "../ui/badge/Badge";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Draft → Surat masih dalam tahap penyusunan dan belum diajukan.
// Menunggu Persetujuan → Surat sedang menunggu verifikasi dari pihak berwenang (misalnya kepala bagian).
// Disetujui → Surat telah disetujui dan siap dikirim.
// Dikirim → Surat telah dikirim ke tujuan.
// Diterima → Pihak penerima telah mengonfirmasi bahwa surat sudah diterima.
// Diarsipkan → Surat telah selesai diproses dan disimpan dalam arsip.
// Dibatalkan → Pengiriman surat dibatalkan karena alasan tertentu.
const locale = id
export default function SuratKeluarDetail({data, refreshData}) {
  const { id } = useParams()
  const { isOpen, openModal, closeModal } = useModal();
  const [no_agenda_keluar, setNoAgenda] = useState(data.no_agenda_keluar);
  const [no_surat, setNoSurat] = useState(data.no_surat);
  const [tgl_surat, setTgl_surat] = useState(data.tgl_surat);
  const [perihal, setPerihal] = useState(data.perihal);
  const [ditujukan, setDitujukan] = useState(data.ditujukan);
  const [keterangan, setKeterangan] = useState(data.keterangan);
  const [status, setStatus] = useState(data.status)

  console.log("idi dai id:", data.no_agenda_keluar)

  useEffect(() => {
    if (data) {
      setNoAgenda(data.no_agenda_keluar || "");
      setNoSurat(data.no_surat || "");
      setTgl_surat(data.tgl_surat || "");
      setPerihal(data.perihal || "");
      setDitujukan(data.ditujukan || "");
      setKeterangan(data.keterangan || "");
      setStatus(data.status || "");
    }
  }, [data]); 

  const handleSaveSuratKeluar = async(e) => {
    e.preventDefault();

    console.log("Current status:", status);

    const formData = new FormData();
    formData.append("no_agenda_keluar", no_agenda_keluar);
    formData.append("no_surat", no_surat);
    formData.append("tgl_surat", tgl_surat);
    formData.append("perihal", perihal);
    formData.append("ditujukan", ditujukan)
    formData.append("keterangan", keterangan);
    formData.append("status", status);

    console.log("data yang dikirim:", formData)

    try {
      const result = await editSuratKeluar(id, formData);
      console.log("apa isi result:", result)
      refreshData();
    } catch (error) {
      console.error('Error Edit:', error.message);
    }
    
    console.log("Saving changes...");
    closeModal();
  };

  const options = [
    { value: "draft", label: "Draft" },
    { value: "disetujui", label: "Disetujui" },
    { value: "dikirim", label: "Dikirim" },
    { value: "selesai", label: "Selesai" },
  ];

  const handleSelectChange = (value) => {
    setStatus(value);
    console.log("Selected value:", value);
  };

  const formatDateString = (dateString) => {
      if (!dateString) return 'Invalid date';
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', {locale});
      
    };
  

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informasi Surat Keluar
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nomor Agenda
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {no_agenda_keluar}
              </p>
            </div>

            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nomor Surat
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {no_surat}
              </p>
            </div>

            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Tanggal Surat
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDateString(tgl_surat)}
              </p>
            </div>

            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Perihal
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {perihal}
              </p>
            </div>

            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Ditujukan
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {ditujukan}
              </p>
            </div>

            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Keterangan
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {keterangan}
              </p>
            </div>

            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Status
              </p>
              <Badge
                      size="md"
                      color={
                        status === "draft"
                          ? "light"
                          : status === "disetujui"
                          ? "info"
                          : status === "dikirim"
                          ? "success"
                          : status === "selesai"
                          ? "primary"
                          : "error"
                      }
                    >
                      {status}
              </Badge>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
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
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Informasi Surat Keluar
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7"> 
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Informasi Surat Keluar
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="no_agenda_keluar">Nomor Agenda</Label>
                    <Input 
                      type="text" 
                      id="no_agenda_keluar"
                      name="no_agenda_keluar"
                      value={no_agenda_keluar}
                      onChange={(e) => setNoAgenda(e.target.value)}
                      />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="no_surat">Nomor Surat</Label>
                    <Input 
                      type="text" 
                      id="no_surat"
                      name="no_surat"
                      value={no_surat}
                      onChange={(e) => setNoSurat(e.target.value)} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="tgl_surat">Tanggal Surat</Label>
                    <Input 
                      type="date" 
                      id="tgl_surat"
                      name="tgl_surat"
                      value={tgl_surat}
                      onChange={(e) => setTgl_surat(e.target.value)} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="perihal">Perihal</Label>
                    <Input 
                      type="text" 
                      id="perihal"
                      name="perihal"
                      value={perihal}
                      onChange={(e) => setPerihal(e.target.value)} />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="ditujukan">Ditujukan</Label>
                    <Input 
                      type="text" 
                      id="ditujukan"
                      name="ditujukan"
                      value={ditujukan}
                      onChange={(e) => setDitujukan(e.target.value)} />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="keterangan">Keterangan</Label>
                    <Input 
                      type="text" 
                      id="keterangan"
                      name="keterangan"
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target)} />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="status">Select Input</Label>
                    <Select
                      options={options}
                      placeholder="Select Option"
                      defaultValue={status}
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900"
                    />
                    {/* <Label htmlFor="status">Status</Label>
                    <Input 
                      type="text" 
                      id="status"
                      name="status"
                      value={data.data.status}
                      onChange={(e) => setStatus} /> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" variant="submit" onClick={handleSaveSuratKeluar}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
