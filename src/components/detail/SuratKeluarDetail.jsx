import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { generateNumber, editSuratKeluar, uploadSigned, archiveSuratKeluar } from "../../modules/fetch/surat-keluar";
import { useParams } from "react-router-dom";
import Select from "../form/Select";
import Badge from "../ui/badge/Badge";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Swal from "sweetalert2";
import { createReview, completeRevision } from '../../modules/fetch/review';
import DropzoneDocument from "../form/form-surat/InputDocument";


const locale = id
export default function SuratKeluarDetail({id, me, data, refreshData}) {
  const modal = useModal();
  const updateModal = useModal();
  const signModal = useModal();
  const [no_surat, setNoSurat] = useState(data.no_surat);
  const [tgl_surat, setTgl_surat] = useState(data.tgl_surat);
  const [perihal, setPerihal] = useState(data.perihal);
  const [ditujukan, setDitujukan] = useState(data.ditujukan);
  const [keterangan, setKeterangan] = useState(data.keterangan);
  const [status, setStatus] = useState(data.status);
  const [sifat, setSifat] = useState(data.sifat);
  const [lampiran, setLampiran] = useState(data.lampiran);
  const [jenis, setJenis] = useState(data.jenis);
  const [tembusan, setTembusan] = useState(data.tembusan);
  const [no_folder, setNo_folder] = useState(data.no_folder);
  const [Id, setId] = useState(data.id);
  const [signedFile, setSignedFile] = useState(null)
  const bolehArsip = me === 'administrasi' && data.status === 'completed';


  const handleMainFileChange = (file) => {
    // file = File object atau null
    setSignedFile(file)
  }

  console.log("idi dai id:", data.no_agenda_keluar)

  useEffect(() => {
    if (data) {
      setNoSurat(data.no_surat || "");
      setTgl_surat(data.tgl_surat || "");
      setPerihal(data.perihal || "");
      setDitujukan(data.ditujukan || "");
      setKeterangan(data.keterangan || "");
      setStatus(data.status || "");
      setSifat(data.sifat || "");
      setLampiran(data.lampiran || []);
      setJenis(data.jenis || "");
      setTembusan(data.tembusan || "");
      setNo_folder(data.no_folder || "");
      setId(data.id || "");
    }
  }, [data]); 

  const handleSaveSuratKeluar = async(e) => {
    e.preventDefault();

    console.log("Current status:", status);

    const formData = new FormData();
    formData.append("no_surat", no_surat);
    formData.append("tgl_surat", tgl_surat);
    formData.append("perihal", perihal);
    formData.append("ditujukan", ditujukan)
    formData.append("keterangan", keterangan);
    formData.append("status", status);

    console.log("data yang dikirim:", formData)

    try {
      Swal.fire({
        title: 'Memproses...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const result = await editSuratKeluar(id, formData);
      console.log("apa isi result:", result);

      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data Surat Keluar berhasil diperbarui!',
      });
      refreshData();
    } catch (error) {
      console.error('Error Edit:', error.message);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan saat mengedit data.',
      });
    }
    modal.closeModal();
  };


  //const reviewable = ['draft','under_review','revisi'].includes(surat?.status);

  const handleApprove = async () => {
    const { isConfirmed } = await Swal.fire({
      icon: 'question',
      title: 'Konfirmasi Persetujuan',
      text: 'Apakah Anda yakin ingin menyetujui surat ini?',
      showCancelButton: true,
      confirmButtonText: 'Ya, setujui',
      cancelButtonText: 'Batal',
    });

    if (!isConfirmed) return;

    try {
      Swal.fire({
              title: "Memproses...",
              text: "Mohon tunggu sebentar",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
      await createReview(id, { status: 'approved', komentar: '' });
      Swal.close();
      Swal.fire('Sukses','Surat disetujui','success');
      refreshData();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.message||err.message,'error');
    }
  };

  const handleRevisi = async () => {
    const { value: alasan } = await Swal.fire({
      title: 'Masukkan alasan revisi',
      input: 'textarea',
      inputPlaceholder: 'Jelaskan yang perlu diperbaiki…',
      showCancelButton: true,
      confirmButtonText: 'Kirim Revisi',
      cancelButtonText: 'Batal',
      inputValidator: v => !v && 'Alasan wajib diisi'
    });
    if (!alasan) return;
    try {
      Swal.fire({
              title: "Memproses...",
              text: "Mohon tunggu sebentar",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
      await createReview(id, { status: 'revisi', komentar: alasan });
      Swal.close();
      Swal.fire('Dikirim','Permintaan revisi tersimpan','success');
      refreshData();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.message||err.message,'error');
    }
  };

  const handleCompleteRevisi = async () => {
    const { isConfirmed } = await Swal.fire({
      icon: 'question',
      title: 'Konfirmasi Persetujuan',
      text: 'Apakah Anda sudah menyelesaikan revisi surat ini?',
      showCancelButton: true,
      confirmButtonText: 'Ya, sudah',
      cancelButtonText: 'Batal',
    });

    if (!isConfirmed) return;

    try {
      Swal.fire({
              title: "Memproses...",
              text: "Mohon tunggu sebentar",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
      await completeRevision(id);
      Swal.close();
      Swal.fire('Sukses','Surat selesai direvisi','success');
      refreshData();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.message||err.message,'error');
    }
  };

  const handleGenerateNomor = async () => {
    try {
      Swal.fire({
              title: "Memproses...",
              text: "Mohon tunggu sebentar",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
      await generateNumber(id);
      Swal.close();
      Swal.fire('Sukses','Nomor Surat berhasil dibuat','success');
      refreshData();
    } catch (err) {
      console.error('Gagal generate nomor', err);
      Swal.fire('Error', err.response?.data?.message||err.message,'error');
    }
  };

  const options = [
    { value: "draft", label: "Draft" },
    { value: "disetujui", label: "Disetujui" },
    { value: "dikirim", label: "Dikirim" },
    { value: "selesai", label: "Selesai" },
  ];

  const handleSelectChange = (value) => {
    setStatus(value);
  };

  const formatDateString = (dateString) => {
      if (!dateString) return 'Invalid date';
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', {locale});
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signedFile) return alert('Pilih dulu file signed-nya')
    const fd = new FormData();
    fd.append('file', signedFile);
    console.log("apa isi id:", id)
    console.log('apa isi file', fd)
    try {
      Swal.fire({
        title: "Memproses...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      await uploadSigned(id, fd);
      signModal.closeModal();  
      Swal.close();
      Swal.fire('Dikirim','Permintaan revisi tersimpan','success');
      refreshData();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.message||error.message,'error');
    }
}

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
      await archiveSuratKeluar(id, payload);

      await Swal.fire({
        icon: 'success',
        title: 'Sukses!',
        text: 'Surat berhasil diarsipkan',
        timer: 2000,
        showConfirmButton: false
      });

      refreshData();
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
            Informasi Surat Keluar
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                No Surat
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
                Sifat
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {sifat}
              </p>
            </div>

            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Jenis
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
                Tembusan
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {tembusan}
              </p>
            </div>

            <div className="xl:w-100">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Status
              </p>
              <Badge
                  variant="solid"
                  size="md"
                  color={
                    status === "draft"
                      ? "light"
                      : status === "review"
                      ? "review"
                      : status === "waiting_for_signature"
                      ? "waiting_for_signature"
                      : status === "completed"
                      ? "selesai"
                      : status === "archived"
                      ? "archived"
                      : "error"
                  }
                >
                  {status}
              </Badge>
            </div>
            {status === 'archived' && (
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

        {((['draft', 'KTU_Review'].includes(status) && me === "ktu") || ( (['kadep','sekdep'].includes(me) && status === 'Dept_Review')))&& (
          <>
            <Button
              onClick={() => handleApprove()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Setujui
            </Button>
            <Button
              onClick={() => handleRevisi()}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Revisi
            </Button>
          </>
        )}

        {['KTU_Revision','Dept_Revision'].includes(status) && me === 'administrasi' &&  (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCompleteRevisi()}
          >
            Selesai Revisi
          </Button>
        )}

        {status === 'waiting_number' && me === "ktu" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerateNomor()}
                  >
                    Generate Nomor
                  </Button>
                )}

        {['draft'].includes(status) && me === "administrasi" && (
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

        {bolehArsip && (
          <Button
            onClick={() => handleArsipSurat(Id)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-800"
          >
            Arsipkan
          </Button>
        )}

      {['waiting_signature'].includes(status) && me === "administrasi" && (
        <Button onClick={signModal.openModal} variant="outline">Upload Signed</Button>
      )}
      </div>

      <Modal isOpen={signModal.isOpen} onClose={signModal.closeModal} className="max-w-[700px] m-4">
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <h3 className="text-lg font-semibold">Unggah Berkas Signed</h3>
            <div className="p-8">
            <DropzoneDocument
              onMainFileChange={handleMainFileChange}
              showLampiran={false}
              // tidak perlu lampiran di sini
            />
            <Button onClick={handleSubmit} variant="outline" disabled={!signedFile}>
              Kirim
            </Button>
            </div>
          </div>
        </Modal>

      <Modal isOpen={modal.isOpen} onClose={modal.closeModal} className="max-w-[700px] m-4">
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
              <Button size="sm" variant="outline" onClick={modal.closeModal}>
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
