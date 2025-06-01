import React, { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";

import Select from 'react-select';
import Button from "../../ui/button/Button";
import { createSuratMasuk } from "../../../modules/fetch/surat-masuk";
import Swal from "sweetalert2";
import DropzoneDocument from "./InputDocument";
import { getUserName } from "../../../modules/fetch/user";
import MultiSelect from "../MultiSelect";

export default function InputSuratMasuk() {
  const [formValues, setFormValues] = useState({
    no_agenda_masuk: '',
    tgl_terima: '',
    no_surat: '',
    tgl_surat: '',
    perihal: '',
    asal_surat: '',
    keterangan: '',
    jenis: '',
    sifat: '',
    penerima: '',
    tembusan: '',
  })
  const [penerimaIds, setPenerimaIds] = useState([]);
  const [dokumen_utama, setDokumenUtama] = useState(null);
  const [lampiran, setLampiran] = useState([]);
  const [users, setUsers] = useState([])
  const optionsPenerimaIds = users.map(u => ({ value: u.id.toString(), label: u.nama_lengkap, selected: false }));

  useEffect(() => {
    
      (async () => {
        try {
          const res = await getUserName();
          setUsers(res.data);
        } catch (err) {
          console.error("Error fetching users", err);
        }
      })();
    
  }, []);

  const options = [
    { value: "Surat Keputusan", label: "Surat Keputusan" },
    { value: "Surat Tugas", label: "Surat Tugas" },
    { value: "Undangan", label: "Undangan" },
    { value: "Memo", label: "Memo" },
    { value: "Permohonan", label: "Permohonan" },
    { value: "Pemberitahuan", label: "Pemberitahuan" },
  ];

  const sifatOptions = [
    { value: "surat_rahasia", label: "Surat Rahasia" },
    { value: "penting", label: "Penting" },
    { value: "sangat_penting", label: "Sangat Penting" },
    { value: "biasa", label: "Biasa" },
  ]

  const handleSelectChange = (value) => {
      setFormValues(prev => ({
      ...prev,
      jenis: value,
      sifat: value
    }));
  };

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
      penerimaIds.forEach((id) => {
        data.append('penerimaIds[]', id); // array name pakai [] agar backend bisa baca array
      });

      if (dokumen_utama) data.append('dokumen_utama', dokumen_utama);
      lampiran.forEach((file) => data.append('lampiran', file));

      Swal.fire({
        title: 'Memproses...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      console.log('apa isi data yang dikirim:', data)

      const response = await createSuratMasuk(data);
      console.log('Surat berhasil dibuat:', response.data);

      Swal.close();

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data Surat Masuk berhasil ditambahkan!',
      });

      setFormValues({
        no_agenda_masuk: '',
        tgl_terima: '',
        no_surat: '',
        tgl_surat: '',
        perihal: '',
        asal_surat: '',
        keterangan: '',
        jenis: '',
        sifat: '',
        penerima: '',
        tembusan: ''
      });
      setDokumenUtama(null);
      setLampiran([]);
    } catch (error) {
      console.error(error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan saat input data.',
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <ComponentCard title="Input Data Surat Masuk">
            <div className="space-y-6">
              <div>
                <Label htmlFor="no_agenda_masuk">Nomor Agenda</Label>
                <Input
                  type="text"
                  id="no_agenda_masuk"
                  name="no_agenda_masuk"
                  value={formValues.no_agenda_masuk}
                  onChange={handleChange}
                  placeholder="nomor agenda surat masuk"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tgl_terima">Tanggal Diterima</Label>
                <div className="relative">
                  <Input
                    type="date"
                    id="tgl_terima"
                    name="tgl_terima"
                    value={formValues.tgl_terima}
                    onChange={handleChange}
                  />
                </div>
              </div>
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
                  placeholder="Maksud tujuan surat masuk"
                />
              </div>
              <div>
                <Label htmlFor="asal_surat">Asal Surat Masuk</Label>
                <Input
                  type="text"
                  id="asal_surat"
                  name="asal_surat"
                  value={formValues.asal_surat}
                  onChange={handleChange}
                  placeholder="Instansi pengirim surat"
                />
              </div>
              <div>
                <Label htmlFor="keterangan">Keterangan</Label>
                <Input
                  type="text"
                  id="keterangan"
                  name="keterangan"
                  value={formValues.keterangan}
                  onChange={handleChange}
                  placeholder=""
                />
              </div>
              <div>
                <Label htmlFor="jenis">Jenis Surat</Label>
                <Select
                  options={options}
                  placeholder="Select an option"
                  onChange={handleSelectChange}
                  className="dark:bg-dark-900"
                />
              </div>
              <div>
                <Label htmlFor="sifat">Sifat</Label>
                <Select
                  options={sifatOptions}
                  onChange={handleSelectChange}
                  placeholder="Select an Option"
                  className="dark:bg-dark-900"
                />
              </div>
              <div>
                <Label htmlFor="penerima">Penerima</Label>
                <Select
                  isMulti
                  label="Multiple Select Options"
                  options={users.map((u) => ({ value: u.id.toString(), label: u.nama_lengkap }))}
                  defaultSelected={[]}
                  onChange={(selectedOptions) => {
  const ids = selectedOptions
    ? selectedOptions.map(opt => Number(opt.value))
    : [];
  setPenerimaIds(ids);
}}
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
                  placeholder=""
                />
              </div>
            </div>
          </ComponentCard>
        </div>
        

        <DropzoneDocument
          onAttachmentsChange={setLampiran}
          onMainFileChange={setDokumenUtama}
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
