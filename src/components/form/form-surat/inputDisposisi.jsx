import React, { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import Button from "../../ui/button/Button";
import Swal from "sweetalert2";
import { getUserName } from "../../../modules/fetch/user";
import { createDisposisi } from "../../../modules/fetch/disposisi";

export default function DisposisiInputModal({ isOpen, onClose, suratId, onCreated, refresh }) {
  // form state
  const [form, setForm] = useState({
    tindakan: "",
    diteruskan: "",
    ket_disposisi: ""
  });

  // user options
  const [users, setUsers] = useState([]);
  const options = users.map(u => ({ value: u.nama_lengkap, label: u.nama_lengkap }));

  useEffect(() => {
    if (isOpen) {
      // reset form when opened
      setForm({ tindakan: "", diteruskan: "", ket_disposisi: "" });
      // load users
      (async () => {
        try {
          const res = await getUserName();
          setUsers(res.data);
        } catch (err) {
          console.error("Error fetching users", err);
        }
      })();
    }
  }, [isOpen]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelect = (value) => {
    
    setForm(prev => ({...prev, diteruskan: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      Swal.fire({
        title: 'Memproses... ',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
      const payload = { 
        no_agenda: suratId,
        ...form };
      const res = await createDisposisi(payload);
      Swal.close();
      Swal.fire('Berhasil', 'Disposisi berhasil dibuat', 'success');
      // notify parent
      refresh();
      onClose();
    } catch (err) {
      Swal.close();
      console.error(err);
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Tambah Disposisi
            </h4>
          </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="h-[450px] overflow-y-auto px-2 pb-3">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                <div className="col-span-1">
                <Label>Tindakan</Label>
                <Input
                    name="tindakan"
                    value={form.tindakan}
                    onChange={handleChange}
                    required
                />
                </div>
                <div className="col-span-1">
                <Label>Diteruskan Ke</Label>
                <Select
                    options={options}
                    value={options.find(o => o.value === form.diteruskan)}
                    onChange={handleSelect}
                    className="dark:bg-dark-900"
                    required
                />
                </div>
                <div className="col-span-1">
                <Label>Keterangan Disposisi</Label>
                <Input
                    name="ket_disposisi"
                    value={form.ket_disposisi}
                    onChange={handleChange}
                />
                </div>
                </div>
                </div>
                <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>Batal</Button>
                <Button size="sm" variant="submit" type="submit">Simpan</Button>
                </div>
            </form>
      </div>
    </Modal>
  );
}
