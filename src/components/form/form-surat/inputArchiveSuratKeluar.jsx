import React, { useEffect, useRef, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
// import Select from "../Select";
import MultiSelect from "../MultiSelect";
import Select from 'react-select';
import Button from "../../ui/button/Button";
import { useDropzone } from "react-dropzone";
import { uploadSuratKeluarArchived } from "../../../modules/fetch/surat-keluar"; 
import { FaRegFilePdf } from "react-icons/fa";
import Swal from "sweetalert2";
import { getAllKlasifikasi, createKlasifikasi } from "../../../modules/fetch/klasifikasi";
import { getAllTujuan, createTujuan } from "../../../modules/fetch/tujuan";
import DropzoneDocument from "./InputDocument";

export default function InputArchiveSuratKeluar() {
    const [formValues, setFormValues] = useState({
        no_surat: '',
        tgl_surat: '',
        perihal: '',
        keterangan: '',
        jenis: '',
        sifat: '',
        tembusan: '',
        ditujukan: '',
        no_folder: '',
    });
    const [drafts, setDrafts] = useState(null);
    const [lampirans, setLampirans] = useState([]);

    // destination (tujuan)
    const [destOptions, setDestOptions] = useState([]);
    const [createDestMode, setCreateDestMode] = useState(false);
    const [newDestName, setNewDestName] = useState('');
    const destRef = useRef(null);

    const jenisOptions = [
        { value: "surat_umum", label: "Surat Umum" },
        { value: "surat_keputusan", label: "Surat Keputusan" },
        { value: "surat_tugas", label: "Surat Tugas" },
        { value: "memo", label: "Memo" },
        { value: "permohonan", label: "Permohonan" },
        { value: "pemberitahuan", label: "Pemberitahuan" },
    ];

    const sifatOptions = [
        { value: "surat_rahasia", label: "Surat Rahasia" },
        { value: "penting", label: "Penting" },
        { value: "sangat_penting", label: "Sangat Penting" },
        { value: "biasa", label: "Biasa" },
    ]

  const handleSelectChangeJenis = (value) => {
      setFormValues(prev => ({
      ...prev,
      jenis: value.value,
    }));
  };
 
  const handleSelectChangeSifat = (value) => {
      setFormValues(prev => ({
      ...prev,
      sifat: value.value
    }));
  };
   

    async function fetchDest() {
            try {
                const dest = await getAllTujuan();
                const destOpts = dest.map(item => ({
                  value: item.nama,
                  label: item.nama
                }));
                setDestOptions(destOpts);

            } catch (error) {
                console.error("gagal fetch tujuan", error);
            }
        }

    useEffect(() => {
      fetchDest();
      function onClickOutside(e) {
        if (destRef.current && !destRef.current.contains(e.target)) {
        setCreateDestMode(false);
        }
      }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);


    const onSelectDest = v => { 
      setFormValues(prev => (
        { 
          ...prev, 
          ditujukan: v ? v.map(o => o.value) : [] }
      )); 
      setCreateDestMode(false); 
    };
    
    const onAddDest = () => { 
      setCreateDestMode(true); 
      setNewDestName(''); 
    };

    const handleAddDest = async() => {
      if (!newDestName) return;
      try {
        const created = await createTujuan({nama: newDestName});
        const option = { value: created.nama, label: created.nama };
        setDestOptions(prev => [...prev, option]);
        setFormValues(prev => ({...prev, ditujukan: created.nama}));
        setCreateDestMode(false);
        fetchDest();
      } catch (error) {
        console.error('Error creating klasifikasi', error);
        Swal.fire('Error', error.message || 'Gagal membuat klasifikasi', 'error');
      }
    }

    const handleChange = (e) => {
        setFormValues({
        ...formValues,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          const data = new FormData();
          Object.entries(formValues).forEach(([Key, val]) => {
              if (val !== undefined && val !== null) data.append(Key, val);
          });

          if (drafts) data.append('dokumen_utama', drafts);
          lampirans.forEach((file) => data.append('lampiran', file));

          Swal.fire({
              title: 'Memproses...',
              text: 'Mohon tunggu sebentar',
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              }
            });

          await uploadSuratKeluarArchived(data)

          Swal.close();

          Swal.fire({
              icon: 'success',
              title: 'Berhasil!',
              text: 'Data Surat Keluar berhasil ditambahkan!',
            });

          setFormValues({
            no_surat: '',
            tgl_surat: '',
            perihal: '',
            keterangan: '',
            jenis: '',
            sifat: '',
            tembusan: '',
            ditujukan: '',
            no_folder: ''
          });
          setDrafts(null);
          setLampirans([]);
      } catch (error) {
          console.error(error);
          Swal.close();
          Swal.fire({
              icon: 'error',
              title: 'Gagal!',
              text: error.message || 'Terjadi kesalahan saat input data.',
            });
      }
    }
    
  return (
    <form onSubmit={handleSubmit}>
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        
        <div className="space-y-6">
            <ComponentCard title="Input Data Surat Keluar">
            <div className="space-y-6">
                <div> 
                <Label htmlFor="no_surat">Nomor Surat</Label>
                <Input
                  type="text"
                  id="no_surat"
                  name="no_surat"
                  value={formValues.no_surat}
                  onChange={handleChange}
                  placeholder="nomor surat masuk"
                />
                </div>

                <div>
                <Label htmlFor="tgl_surat">Tanggal Surat</Label>
                <div className="relative">
                    <Input
                    type="date"
                    id="tgl_surat"
                    name="tgl_surat"
                    value={formValues.tgl_surat}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    />
                </div>
                </div>
                <div>
                <Label htmlFor="perihal">Perihal</Label>
                <Input 
                    type="text" 
                    id="perihal"
                    name="perihal"
                    value={formValues.perihal}
                    onChange={handleChange}
                    placeholder="Maksud tujuan surat masuk" />
                </div>
                <div>
                <Label htmlFor="keterangan">Keterangan</Label>
                <Input 
                    type="text" 
                    id="keterangan" 
                    name="keterangan" 
                    value={formValues.keterangan}
                    onChange={handleChange}
                    placeholder="Ditujukan kepada" />
                </div>
                <div>
                <Label htmlFor="jenis">Jenis</Label>
                <Select
                    options={jenisOptions}
                    placeholder="Select an option"
                    onChange={handleSelectChangeJenis}
                    className="dark:bg-dark-900"
                />
                </div>
                <div>
                <Label htmlFor="sifat">Sifat</Label>
                <Select
                    options={sifatOptions}
                    placeholder="Select an option"
                    onChange={handleSelectChangeSifat}
                    className="dark:bg-dark-900"
                />
                </div>
                <div>
                <Label htmlFor="tembusan">Tembusan</Label>
                <Input 
                    type="text" 
                    id="tembusan"
                    name="tembusan"
                    value={formValues.tembusan}
                    onChange={handleChange}
                    placeholder="" />
                </div>

                <div ref={destRef}>
                <Label htmlFor="ditujukan">Ditujukan</Label>
                <div className="flex gap-4">
                <Select
                  isMulti
                  options={destOptions}
                  defaultSelected={[]}
                  onChange={onSelectDest}
                  className="basic-multi-select w-full"
                />
                  {!createDestMode && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={onAddDest}
                    >
                      +Tambah
                    </Button>
                  )}
                  </div>

                  {createDestMode && (
                  <div className="flex gap-2 items-end">
                    <div className="">
                    <Label htmlFor="newDestName">Nama Tujuan</Label>
                    <Input 
                      type="text"
                      placeholder="Nama Tujuan" 
                      value={newDestName} 
                      onChange={e => setNewDestName(e.target.value)} 
                    />
                    </div>
                    <Button 
                      type="button"
                      onClick={handleAddDest} 
                      variant="submit">
                        Save
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setCreateDestMode(false)}>
                        Cancel
                    </Button>
                  </div>
                  )}
                </div>

                <div>
                <Label htmlFor="no_folder">No Folder</Label>
                <Input 
                    type="text" 
                    id="no_folder"
                    name="no_folder"
                    value={formValues.no_folder}
                    onChange={handleChange}
                    placeholder="" />
                </div>
            </div>
            </ComponentCard>
        </div>

        <DropzoneDocument 
            onAttachmentsChange={setLampirans}
            onMainFileChange={setDrafts}
            showLampiran={true}
        />

        
        
    </div>
    <div className="flex justify-end mt-4">
        <Button 
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
                Submit
            </Button>
    </div>
    </form>
  );
}
