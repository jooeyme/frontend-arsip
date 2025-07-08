import React, { useCallback, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react"

const DropzoneDocument = ({ onMainFileChange, onAttachmentsChange, showLampiran }) => {
  const [mainFile, setMainFile] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [showAttachments, setShowAttachments] = useState(false);

  const onDropMain = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0] || null;
    setMainFile(file);
    onMainFileChange?.(file);
    // Handle file uploads here
  }, [onMainFileChange]);

  const onDropAttachments = useCallback((acceptedFiles) => {
    setAttachments(prev => {
      const newFiles = acceptedFiles.filter(f => 
        !prev.some(existing => existing.name === f.name && existing.size === f.size)
      );
      const updated = [...prev, ...newFiles];
    onAttachmentsChange?.(updated);
    return updated;
    });
  }, [onAttachmentsChange]);

  const removeMainFile = () => {
    setMainFile(null);
    onMainFileChange?.(null);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => {
      const updated = prev.filter((_, i) => i !== index);
      onAttachmentsChange?.(updated);
      return updated;
    });
  }

  const { 
    getRootProps: getMainRoot, 
    getInputProps: getMainInput, 
    isDragActive: isMainDrag
  } = useDropzone({
    onDrop: onDropMain,
    multiple: false,
    accept: {
      "application/pdf": [],
    },
  });

  const {
    getRootProps: getAttachRoot, 
    getInputProps: getAttachInput, 
    isDragActive: isAttachDrag
  } = useDropzone({
    onDrop: onDropAttachments,
    multiple: true,
    accept: {
      "application/pdf": [],
    },
  });

  const renderZone = ({ getRootProps, getInputProps, isDragActive, title, files }) => (
    <div className="border border-gray-300 border-dashed rounded-xl p-6">
      <div
        {...getRootProps()}
        className={`cursor-pointer p-8 text-center rounded-xl transition-colors ${
          isDragActive ? 'border-brand-500 bg-gray-100 dark:bg-gray-800' : 'hover:border-brand-500'
        }`}>
        <input {...getInputProps()} />
        <p className="mb-2 text-gray-500 font-medium">{title}</p>
        {files.length > 0 ? (
          <ul className="list-disc list-inside text-left">
            {files.map((f, i) => (
              <li key={i} className="text-sm text-gray-700">{f.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">Drag & drop PDF di sini atau klik untuk memilih file</p>
        )}
      </div>
    </div>
  );

  return (
    <ComponentCard title="Unggah Dokumen">
      <div className="grid grid-cols-1 gap-4">
        {/* Zona berkas utama */}
        {/* {renderZone({
          getRootProps: getMainRoot,
          getInputProps: getMainInput,
          isDragActive: isMainDrag,
          title: 'Berkas Utama (PDF, max 1)',
          files: mainFile ? [mainFile] : []
        })} */}
        {mainFile && (
              <ul className="list-disc list-inside text-left flex justify-between">
                  <li className="text-sm text-gray-700">{mainFile.name}</li>
                  <button type="button" onClick={removeMainFile} className="text-red-500 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
            
              </ul>
          )}
        <div className="border border-gray-300 border-dashed rounded-xl p-6">
          <div
            {...getMainRoot()}
            className={`cursor-pointer p-8 text-center rounded-xl transition-colors ${
              isMainDrag ? 'border-brand-500 bg-gray-100 dark:bg-gray-800' : 'hover:border-brand-500'
            }`}>
            <input {...getMainInput()} />
            <p className="mb-2 text-gray-500 font-medium">Berkas Utama (PDF, 1 file)</p>
            
              <p className="text-sm text-gray-400">Drag & drop PDF di sini atau klik untuk memilih file (maximum 10mb)</p>
          
          </div>
        </div>

        {/* Tombol untuk menambah/menyembunyikan lampiran */}
        {showLampiran && (
          <button
          type="button"
          className="self-start text-sm font-medium text-brand-500 hover:underline"
          onClick={() => setShowAttachments(prev => !prev)}
        >
          {showAttachments ? 'Sembunyikan Lampiran' : 'Tambahkan Lampiran'}
        </button>
        )}
        

        {/* Zona lampiran hanya tampil jika showAttachments true */}
        {/* {showAttachments && renderZone({
          getRootProps: getAttachRoot,
          getInputProps: getAttachInput,
          isDragActive: isAttachDrag,
          title: 'Lampiran (PDF, multiple)',
          files: attachments
        })} */}

        {showAttachments && (
          <div className="space-y-2">

            {attachments.length > 0 && (
              <ul className="list-disc list-inside text-left gap-2">
                {attachments.map((f, i) => (
                  <div className="flex justify-between">
                  <li key={f.name + f.size} className="text-sm text-gray-700">
                    
                      {f.name}
                    </li>
                    <button type="button" onClick={() => removeAttachment(i)} className="text-red-500 cursor-pointer">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              
                ))}
              </ul>
            )}
          
        <div className="border border-gray-300 border-dashed rounded-xl p-6">
          <div
            {...getAttachRoot()}
            className={`cursor-pointer p-8 text-center rounded-xl transition-colors ${
              isAttachDrag ? 'border-brand-500 bg-gray-100 dark:bg-gray-800' : 'hover:border-brand-500'
            }`}>
            <input {...getAttachInput()} />
            <p className="mb-2 text-gray-500 font-medium">Lampiran (PDF, up to 5 files)</p>
            
            <p className="text-sm text-gray-400">Drag & drop PDF di sini atau klik untuk memilih file (maximum 10mb)</p>
            
          </div>
        </div>
      </div>
        )}
      </div>
      
    </ComponentCard>
  );
};

export default DropzoneDocument;
