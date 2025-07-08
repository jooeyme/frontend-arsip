import React, { useEffect, useRef, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";

import Select from "react-select";
import Button from "../../ui/button/Button";
import { createSuratMasuk } from "../../../modules/fetch/surat-masuk";
import Swal from "sweetalert2";
import DropzoneDocument from "./InputDocument";
import { getUserName } from "../../../modules/fetch/user";
import {
  getAllKlasifikasi,
  createKlasifikasi,
} from "../../../modules/fetch/klasifikasi";
import {
  getAllTembusan,
  createTembusan,
} from "../../../modules/fetch/tembusan";
import MultiSelect from "../MultiSelect";
import { useNavigate } from "react-router-dom";

export default function InputSuratMasuk() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({

    tgl_terima: "",
    no_surat: "",
    tgl_surat: "",
    perihal: "",
    asal_surat: "",
    keterangan: "",
    jenis: "",
    sifat: "",
    penerima: "",
    tembusan: "",
    klasId: "",
  });
  const [penerimaIds, setPenerimaIds] = useState([]);
  const [dokumen_utama, setDokumenUtama] = useState(null);
  const [lampiran, setLampiran] = useState([]);
  const [users, setUsers] = useState([]);

  //Tembusan Surat
  const [tembusanOptions, setTembusamOptions] = useState([]);
  const [createTembusanMode, setCreateTembusanMode] = useState(false);
  const [newNameTembusan, setNewNameTembusan] = useState("");
  const tembusanRef = useRef(null);

  //Klasifikasi Surat
  const [classOptions, setClassOptions] = useState([]);
  const [createMode, setCreateMode] = useState(false);
  const [newKode, setNewKode] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const containerRef = useRef(null);

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
  ];

  const handleSelectChange = (opt) => {
    
    setFormValues((prev) => ({
      ...prev,
      jenis: opt.value,
    }));
  };

  const handleSelectChangeSifat = (opt) => {
    
    setFormValues((prev) => ({
      ...prev,
      sifat: opt.value,
    }));
  };

  const handleSelectChangeKlas = (value) => {
    setFormValues((prev) => ({
      ...prev,
      klasId: value.value,
    }));
  };

  async function fetchKlas() {
    try {
      const res = await getAllKlasifikasi();
      const opts = res.map((item) => ({
        value: item.id,
        label: item.deskripsi,
      }));
      setClassOptions(opts);
    } catch (error) {
      console.error("gagal fetch klasifikasi", error);
    }
  }

  //Tembusan Surat
  async function fetchTembusan() {
    try {
      const tembusan = await getAllTembusan();
      const tembusanOpts = tembusan.map((item) => ({
        value: item.nama,
        label: item.nama,
      }));
      setTembusamOptions(tembusanOpts);
    } catch (error) {
      console.error("gagal fetch tujuan", error);
    }
  }

  const handleAddClassClick = () => {
    setCreateMode(true);
    setNewKode("");
    setNewDesc("");
  };

  useEffect(() => {
    fetchKlas();
    fetchTembusan();
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setCreateMode(false);
      }

      if (tembusanRef.current && !tembusanRef.current.contains(e.target)) {
        setCreateTembusanMode(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleAddClass = async () => {
    if (!newKode.trim() || !newDesc.trim()) return;
    try {
      const created = await createKlasifikasi({
        kode: newKode,
        deskripsi: newDesc,
      });
      // update options
      const option = { value: created.id, label: created.deskripsi };
      setClassOptions((prev) => [...prev, option]);
      setFormValues((prev) => ({ ...prev, klasId: created.id }));
      setCreateMode(false);
      fetchKlas();
    } catch (err) {
      console.error("Error creating klasifikasi", err);
      Swal.fire("Error", err.message || "Gagal membuat klasifikasi", "error");
    }
  };

  //Tembusan
  const onSelectTembusan = (v) => {
    setFormValues((prev) => ({
      ...prev,
      tembusan: v ? v.map((o) => o.value) : [],
    }));
    setCreateTembusanMode(false);
  };

  const onAddTembusan = () => {
    setCreateTembusanMode(true);
    setNewNameTembusan("");
  };

  const handleAddTembusan = async () => {
    if (!newNameTembusan) return;
    try {
      const created = await createTembusan({ nama: newNameTembusan });
      const option = { value: created.nama, label: created.nama };
      setTembusamOptions((prev) => [...prev, option]);
      setFormValues((prev) => ({ ...prev, tembusan: created.nama }));
      setCreateTembusanMode(false);
      fetchTembusan();
    } catch (error) {
      console.error("Error creating Nama tembusan", error);
      Swal.fire(
        "Error",
        error.message || "Gagal membuat nama tembusan baru",
        "error"
      );
    }
  };

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
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
        data.append("penerimaIds[]", id); // array name pakai [] agar backend bisa baca array
      });

      if (dokumen_utama) data.append("dokumen_utama", dokumen_utama);
      lampiran.forEach((file) => data.append("lampiran", file));

      Swal.fire({
        title: "Memproses...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await createSuratMasuk(data);

      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data Surat Masuk berhasil ditambahkan!",
      });

      setFormValues({
    
        tgl_terima: "",
        no_surat: "",
        tgl_surat: "",
        perihal: "",
        asal_surat: "",
        keterangan: "",
        jenis: "",
        sifat: "",
        penerima: "",
        tembusan: "",
        klasId: '',
      });
      setDokumenUtama(null);
      setLampiran([]);
      navigate("/letter-in-tables");
    } catch (error) {
      console.error(error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.message || "Terjadi kesalahan saat input data.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <ComponentCard title="Input Data Surat Masuk">
            <div className="space-y-6">
              <div ref={containerRef}>
                <Label htmlFor="klasId">Klasifikasi Surat</Label>
                <div className="flex gap-4">
                  <Select
                    options={classOptions}
                    placeholder="Select an option"
                    onChange={handleSelectChangeKlas}
                    disabled={createMode}
                    value={classOptions.find(
                      (o) => o.value === formValues.klasId
                    )}
                    className="basic-multi-select w-full"
                  />
                  {!createMode && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAddClassClick}
                    >
                      +Tambah
                    </Button>
                  )}
                </div>

                {createMode && (
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="">
                      <Label htmlFor="newKode">Kode</Label>
                      <Input
                        type="text"
                        id="newKode"
                        placeholder="Kode"
                        value={newKode}
                        onChange={(e) => setNewKode(e.target.value)}
                      />
                    </div>
                    <div className="">
                      <Label htmlFor="newDesc">Deskripsi</Label>
                      <Input
                        type="text"
                        id="newDesc"
                        placeholder="Deskripsi"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end space-x-2 md:col-span-2">
                      <Button
                        type="button"
                        variant="submit"
                        onClick={handleAddClass}
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCreateMode(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
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
                  onChange={handleSelectChangeSifat}
                  placeholder="Select an Option"
                  className="dark:bg-dark-900"
                />
              </div>
              <div>
                <Label htmlFor="penerima">Penerima</Label>
                <Select
                  isMulti
                  label="Multiple Select Options"
                  options={users.map((u) => ({
                    value: u.id.toString(),
                    label: u.nama_lengkap,
                  }))}
                  defaultSelected={[]}
                  onChange={(selectedOptions) => {
                    const ids = selectedOptions
                      ? selectedOptions.map((opt) => Number(opt.value))
                      : [];
                    setPenerimaIds(ids);
                  }}
                />
              </div>
              {/* <div>
                <Label htmlFor="tembusan">Tembusan</Label>
                <Input
                  type="text"
                  id="tembusan"
                  name="tembusan"
                  value={formValues.tembusan}
                  onChange={handleChange}
                  placeholder=""
                />
              </div> */}

              <div ref={tembusanRef}>
                <Label htmlFor="tembusan">Tembusan</Label>
                <div className="flex gap-4">
                  <Select
                    isMulti
                    options={tembusanOptions}
                    defaultSelected={[]}
                    onChange={onSelectTembusan}
                    className="basic-multi-select w-full"
                  />
                  {!createTembusanMode && (
                    <Button size="sm" variant="outline" onClick={onAddTembusan}>
                      +Tambah
                    </Button>
                  )}
                </div>

                {createTembusanMode && (
                  <div className=" mt-2 flex gap-2 items-end">
                    <div className="">
                      <Label htmlFor="NewNameTembusan">Nama Tembusan</Label>
                      <Input
                        type="text"
                        placeholder="Nama Tembusan"
                        value={newNameTembusan}
                        onChange={(e) => setNewNameTembusan(e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddTembusan}
                      variant="submit"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCreateTembusanMode(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
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
