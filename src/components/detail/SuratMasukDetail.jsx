import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import {
  archiveSuratMasuk,
  editSuratMasuk,
  updateStatusSuratMasuk,
} from "../../modules/fetch/surat-masuk";
import { useParams } from "react-router-dom";
import Select from "../form/Select";
import Badge from "../ui/badge/Badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

// Draft → Surat masih dalam tahap penyusunan dan belum diajukan.
// Menunggu Persetujuan → Surat sedang menunggu verifikasi dari pihak berwenang (misalnya kepala bagian).
// Disetujui → Surat telah disetujui dan siap dikirim.
// Dikirim → Surat telah dikirim ke tujuan.
// Diterima → Pihak penerima telah mengonfirmasi bahwa surat sudah diterima.
// Diarsipkan → Surat telah selesai diproses dan disimpan dalam arsip.
// Dibatalkan → Pengiriman surat dibatalkan karena alasan tertentu.
const locale = id;
export default function SuratMasukDetail({ id, data, refreshData, me }) {
  const modal = useModal();
  const updateModal = useModal();
  const [no_agenda_masuk, setNoAgenda] = useState(data.no_agenda_masuk);
  const [tgl_terima, setTgl_terima] = useState(data.tgl_terima);
  const [no_surat, setNoSurat] = useState(data.no_surat);
  const [tgl_surat, setTgl_surat] = useState(data.tgl_surat);
  const [perihal, setPerihal] = useState(data.perihal);
  const [asal_surat, setAsal_surat] = useState(data.asal_surat);
  const [keterangan, setKeterangan] = useState(data.keterangan);
  const [status, setStatus] = useState(data.status);
  const [sifat, setSifat] = useState(data.sifat);
  const [lampiran, setLampiran] = useState(data.lampiran);
  const [jenis, setJenis] = useState(data.jenis);
  const [penerima, setPenerima] = useState(null);
  const [tembusan, setTembusan] = useState(data.tembusan);
  const [no_folder, setNo_folder] = useState(data.no_folder);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [Id, setId] = useState(data.id);
  const bolehTandaiSelesai = me === 'kadep' && data.status === 'selesai' 
  const bolehArsip = me === 'administrasi' && data.status === 'waiting_to_archive';

console.log(data)

  useEffect(() => {
    if (data) {
      const penerimaNames = 
        data.penerimaUsers
        .map(rel => rel.nama_lengkap)
        .join(', '); 

      setNoAgenda(data.no_agenda_masuk || "");
      setTgl_terima(data.tgl_terima || "");
      setNoSurat(data.no_surat || "");
      setTgl_surat(data.tgl_surat || "");
      setPerihal(data.perihal || "");
      setAsal_surat(data.asal_surat || "");
      setKeterangan(data.keterangan || "");
      setStatus(data.status || "");
      setSifat(data.sifat || "");
      setLampiran(data.lampiran || []);
      setJenis(data.jenis || "");
      setPenerima(penerimaNames);
      setTembusan(data.tembusan || "");
      setNo_folder(data.no_folder || "");
      setId(data.id);
    
    }

  }, [data]);

  const handleSaveSuratMasuk = async (e) => {
    e.preventDefault();

    // const formData = new FormData();
    // formData.append("no_surat", no_surat);
    // formData.append("tgl_surat", tgl_surat);
    // formData.append("perihal", perihal);
    // formData.append("asal_surat", asal_surat);
    // formData.append("keterangan", keterangan);

    const formdata = {
      no_surat,
      tgl_surat,
      perihal,
      asal_surat,
      keterangan,
    };
    try {
      Swal.fire({
        title: "Memproses...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const result = await editSuratMasuk(Id, formdata);
      
      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data Surat Masuk berhasil diperbarui.",
      });
      refreshData();
    } catch (error) {
      console.error("Error Edit:", error.message);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.message || "Terjadi kesalahan saat edit data",
      });
    }
    modal.closeModal();
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: "Memproses...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await updateStatusSuratMasuk(Id, selectedStatus);

      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Status Surat Masuk berhasil diperbarui.",
      });
    } catch (error) {
      console.error("Error Edit:", error.message);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.message || "Terjadi kesalahan saat update data",
      });
    }
    updateModal.closeModal();
  };



  const formatDateString = (dateString) => {
    if (!dateString) return "Invalid date";
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy", { locale });
  };

   const handleTandaiSelesai = async (id, newStatus) => {
    let payload = { status: newStatus };

    const confirm = await Swal.fire({
      title: 'Tandai sebagai selesai?',
      text: 'Surat ini akan diarsipkan dan dianggap selesai.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, tandai selesai',
      cancelButtonText: 'Batal'
    });
    if (!confirm.isConfirmed) return;
    
    try {
        await updateStatusSuratMasuk(id, payload);
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Status surat berhasil diubah ke arsip.',
          timer: 2000,
          showConfirmButton: false
        });

        refreshData(); // refresh list
        Swal.close();
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal mengubah status surat. Silakan coba lagi.',
        });
      }
    };

    const handleArsipSurat = async (id) => {
    const { value: no_folder } = await Swal.fire({
      title: 'Arsipkan Surat',
      input: 'text',
      inputLabel: 'Masukkan No Folder',
      inputPlaceholder: 'Contoh: 123/A',
      showCancelButton: true,
      confirmButtonText: 'Arsipkan',
      cancelButtonText: 'Batal',
      inputValidator: (value) => {
        if (!value) return 'No folder tidak boleh kosong!';
      }
    });

    if (!no_folder) return;
    let payload = { no_folder: no_folder };

    try {
      await archiveSuratMasuk(id, payload);

      await Swal.fire({
        icon: 'success',
        title: 'Sukses!',
        text: 'Surat berhasil diarsipkan',
        timer: 2000,
        showConfirmButton: false
      });

      refreshData();
      Swal.close();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal mengarsipkan surat'
      });
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informasi Surat Masuk
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nomor Agenda
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {no_agenda_masuk}
              </p>
            </div>

            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Tanggal Diterima
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDateString(tgl_terima)}
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
                Asal Surat
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {asal_surat}
              </p>
            </div>

            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Sifat
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {sifat}
              </p>
            </div>

            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Jenis Surat
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {jenis}
              </p>
            </div>

            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Lampiran
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {(!lampiran || lampiran.length === 0) ? "-" : lampiran}
              </p>
            </div>

            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Penerima
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {penerima}
              </p>
            </div>

            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Tembusan
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {tembusan}
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
                variant="solid"
                color={
                  status === "diterima"
                    ? "light"
                    : status === "didisposisikan"
                    ? "info"
                    : status === "diproses"
                    ? "success"
                    : status === "selesai"
                    ? "selesai"
                    : status === "waiting_to_archive"
                    ? "waiting_to_archive"
                    : status === "diarsipkan"
                    ? "warning"
                    : "error"
                }
              >
                {status}
              </Badge>
            </div>
            {status === 'diarsipkan' && (
            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                No Folder Arsip
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {no_folder}
              </p>
            </div>
            )}
          </div>
        </div>

        {me === "administrasi" && status === "diterima" && (
          <button
            onClick={modal.openModal}
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
            Edit
          </button>
        )}

        {bolehTandaiSelesai && (
          <Button
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => handleTandaiSelesai(Id, 'waiting_to_archive')}
          >
            Tandai Selesai
          </Button>
        )}

        {bolehArsip && (
          <Button
            onClick={() => handleArsipSurat(Id)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Arsipkan
          </Button>
        )}
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        className="max-w-[700px] m-4 "
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Informasi Surat Masuk
            </h4>
            
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Informasi Surat Masuk
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="no_surat">Nomor Surat</Label>
                    <Input
                      type="text"
                      id="no_surat"
                      name="no_surat"
                      value={no_surat}
                      onChange={(e) => setNoSurat(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="tgl_terima">Tanggal Diterima</Label>
                    <Input
                      type="date"
                      id="tgl_terima"
                      name="tgl_terima"
                      value={format(new Date(tgl_terima), "yyyy-MM-dd")}
                      onChange={(e) => setTgl_terima(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="tgl_surat">Tanggal Surat</Label>
                    <Input
                      type="date"
                      id="tgl_surat"
                      name="tgl_surat"
                      value={format(new Date(tgl_surat), "yyyy-MM-dd")}
                      onChange={(e) => setTgl_surat(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="perihal">Perihal</Label>
                    <Input
                      type="text"
                      id="perihal"
                      name="perihal"
                      value={perihal}
                      onChange={(e) => setPerihal(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="asal_surat">Asal Surat</Label>
                    <Input
                      type="text"
                      id="asal_surat"
                      name="asal_surat"
                      value={asal_surat}
                      onChange={(e) => setAsal_surat(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="keterangan">Keterangan</Label>
                    <Input
                      type="text"
                      id="keterangan"
                      name="keterangan"
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                    />
                  </div>

                  
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={modal.closeModal}>
                Close
              </Button>
              <Button size="sm" variant="submit" onClick={handleSaveSuratMasuk}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  );
}
