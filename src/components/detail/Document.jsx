import React, {useState, useEffect} from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useDropzone } from "react-dropzone";
import { FaRegFilePdf } from "react-icons/fa";
import { editDocument, createDocument } from "../../modules/fetch/dokumen";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
  function extractFileId(url) {
    return url.split("/d/")[1]?.split("/")[0] || null;
}
export default function Document({data, refreshData, me}) {
  
  const modal = useModal();
  const formModal = useModal();
  // const { isOpen, openModal, closeModal } = useModal();
  // const {isOpenForm, openModalForm, closeModalForm} = useModal();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocx, setSelectedDocx] = useState('');
  const [no_agendaMasuk, setNo_agendaMasuk] = useState('');
  const [no_agendaKeluar, setNo_agendaKeluar] = useState('');
  const [id, setId] = useState('');

  const order = ['berkas surat','signed','draft','lampiran'];
    const weight = order.reduce((acc, type, idx) => {
      acc[type] = idx;
      return acc;
    }, {});

    data.sort((a, b) => {
      // kalau ada type yang tak dikenal, kasih weight besar supaya di-akhir
      const wa = weight[a.type_doc] ?? Number.POSITIVE_INFINITY;
      const wb = weight[b.type_doc] ?? Number.POSITIVE_INFINITY;
      return wa - wb;
    });
  

    
  const handleAmbilID = (data) => {
    const id_masuk = data.find(item => item.no_agenda_masuk !== null);

    const id_keluar = data.find(item => item.no_agenda_keluar !== null);

    setNo_agendaMasuk(id_masuk ? id_masuk.no_agenda_masuk : '');
    setNo_agendaKeluar(id_keluar ? id_keluar.no_agenda_keluar : '');
  }
  
  useEffect(() => {

    handleAmbilID(data);
  }, [data]);
  
  const handleOpenDocx = (document) => {
    console.log("apa dokumen iut:", document.id)
    setSelectedDocx(document.name_doc);
    setId(document.id)
    modal.openModal();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Silakan unggah file PDF terlebih dahulu.',
      });
      return;
    }

    console.log("apa isi selected File:", no_agendaMasuk);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    if (no_agendaMasuk) {
      formData.append('no_agenda_masuk', no_agendaMasuk);
    } else if (no_agendaKeluar) {
      formData.append('no_agenda_keluar', no_agendaKeluar);
    }

    console.log("apa isi formDATA",formData)

    try {
      Swal.fire({
        title: 'Memproses...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      await createDocument(formData);

      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Dokumen berhasil ditambahkan!',
      });
      // Reset form
      refreshData();
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading document:', error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan saat upload dokumen.',
      });
    }
    formModal.closeModal();
  };

  const handleSave = async(e) => {
    e.preventDefault();
    if (!selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Harap unggah file PDF baru.',
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      Swal.fire({
        title: 'Memproses...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      await editDocument(id, formData);

      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Dokumen berhasil diperbarui!',
      });
      console.log("data dokumen diperbarui!!!");
      refreshData();
    } catch (error) {
      console.error("Gagal update dokumen:", error.message);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan saat mengedit dokumen.',
      });
    } 
    modal.closeModal();
  };

   const onDrop = (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]; // Get the first file
        setSelectedFile(file); // Store the file in state
         // Automatically upload after selection
      }
    };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { "application/pdf": [] }, // Accept only PDFs
  });

  const handleDeleteFile = () => {
    setSelectedFile(null); // Menghapus file yang telah dipilih
    };



    return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Document
          </h4>

          {data.map((document) => (
            <div key={document.id} className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid grid-cols-1 gap-4 lg:gap-7 ">
          
            <div  className="lg:w-200 lg:h-120">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {document.type_doc}
                </p>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {document.name_doc}
                </p>
                <iframe 
                src={ `https://drive.google.com/file/d/${extractFileId(document.path_doc)}/preview`} 
                className="w-full h-[400px] rounded-lg border border-gray-300"
                />
            </div>
           
            </div>
            { me === "administrasi" && (
              <button
                onClick={() => handleOpenDocx(document)}
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
            </div>
         ))}
        </div>
         { me === "administrasi" && (
        <button
          onClick={formModal.openModal}
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
          Tambah Dokumen
        </button>
         )}
      </div>

      <Modal isOpen={modal.isOpen} onClose={modal.closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Informasi Document
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Informasi Document
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nomor Agenda</Label>
                    {no_agendaKeluar ? (
                      <Input  
                      type="text" 
                      id="no_agenda_keluar"
                      name="no_agenda_keluar"
                      value={no_agendaKeluar}
                      readOnly
                      />
                    ) : (
                      <Input  
                      type="text" 
                      id="no_agenda_masuk"
                      name="no_agenda_masuk"
                      value={no_agendaMasuk}
                      readOnly
                      />
                    )}
                  </div>
                  <div className="col-span-2">
                  <Label>Nomor Agenda</Label>
                  <p>{selectedDocx}</p>
                  </div>

                  <div className="col-span-2">
                    <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
                                        
                        {selectedFile ? (
                            <div
                            {...getRootProps()}
                            className={`dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
                            ${
                            isDragActive
                                ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                            }
                            `}
                            id="demo-upload"
                            >
    
                            <div className="dz-message flex flex-col items-center !m-0">
                                {/* Icon Container */}
                                <div className="mb-[22px] flex justify-center">
                                <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                    <FaRegFilePdf/>
    
                                </div>
                                </div>
    
                                {/* Text Content */}
                                <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                                {selectedFile.name}
                                </h4>
    
                                <span 
                                onClick={handleDeleteFile}
                                className="font-medium underline text-theme-sm text-brand-500">
                                    Delete File
                                </span>
                            </div>
                            </div>
                        ) : (
                            <div
                                {...getRootProps()}
                                className={`dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
                                ${
                                isDragActive
                                    ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                                    : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                                }
                                `}
                                id="demo-upload"
                                >
                                {/* Hidden Input */}
                                <input {...getInputProps()} />
    
                            <div className="dz-message flex flex-col items-center !m-0">
                                {/* Icon Container */}
                                <div className="mb-[22px] flex justify-center">
                                <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                    <svg
                                    className="fill-current"
                                    width="29"
                                    height="28"
                                    viewBox="0 0 29 28"
                                    xmlns="http://www.w3.org/2000/svg"
                                    >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                                    />
                                    </svg>
                                </div>
                                </div>
    
                                {/* Text Content */}
                                <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                                {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
                                </h4>
    
                                <span className=" text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                                Drag and drop your PNG, JPG, WebP, SVG images here or browse
                                </span>
    
                                <span className="font-medium underline text-theme-sm text-brand-500">
                                Browse File
                                </span>
                            </div>
                            </div>
                        )}
                        
    
                        
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={modal.closeModal}>
                Batal
              </Button>
              <Button size="sm" variant="submit" onClick={handleSave}>
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={formModal.isOpen} onClose={formModal.closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Tambah Informasi Document
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Informasi Document
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nomor Agenda</Label>
                    {no_agendaKeluar ? (
                      <Input  
                      type="text" 
                      id="no_agenda_keluar"
                      name="no_agenda_keluar"
                      value={no_agendaKeluar}
                      readOnly
                      />
                    ) : (
                      <Input  
                      type="text" 
                      id="no_agenda_masuk"
                      name="no_agenda_masuk"
                      value={no_agendaMasuk}
                      readOnly
                      />
                    )}
                    
                  </div>

                  <div className="col-span-2">
                    <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
                        {selectedFile ? (
                                                <div
                                                {...getRootProps()}
                                                className={`dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
                                                ${
                                                isDragActive
                                                    ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                                                    : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                                                }
                                                `}
                                                id="demo-upload"
                                                >
                        
                                                <div className="dz-message flex flex-col items-center !m-0">
                                                    {/* Icon Container */}
                                                    <div className="mb-[22px] flex justify-center">
                                                    <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                                        <FaRegFilePdf/>
                        
                                                    </div>
                                                    </div>
                        
                                                    {/* Text Content */}
                                                    <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                                                    {selectedFile.name}
                                                    </h4>
                        
                                                    <span 
                                                    onClick={handleDeleteFile}
                                                    className="font-medium underline text-theme-sm text-brand-500">
                                                        Delete File
                                                    </span>
                                                </div>
                                                </div>
                                            ) : (
                        <div
                            {...getRootProps()}
                            className={`dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
                            ${
                            isDragActive
                                ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                            }
                            `}
                            id="demo-upload"
                            >
                            {/* Hidden Input */}
                            <input {...getInputProps()} />

                        <div className="dz-message flex flex-col items-center !m-0">
                            {/* Icon Container */}
                            <div className="mb-[22px] flex justify-center">
                            <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                <svg
                                className="fill-current"
                                width="29"
                                height="28"
                                viewBox="0 0 29 28"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                                />
                                </svg>
                            </div>
                            </div>

                            {/* Text Content */}
                            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                            {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
                            </h4>

                            <span className=" text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                            Drag and drop your PNG, JPG, WebP, SVG images here or browse
                            </span>

                            <span className="font-medium underline text-theme-sm text-brand-500">
                            Browse File
                            </span>
                        </div>
                        </div>   
                                            )}                 
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={formModal.closeModal}>
                Batal
              </Button>
              <Button size="sm" variant="submit" onClick={handleSubmit}>
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
