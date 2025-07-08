import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal"; // Sesuaikan path modal kamu
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { getAllUser, createUser } from "../../modules/fetch/user";
import { getAllTembusan, createTembusan, deleteTembusan } from "../../modules/fetch/tembusan";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ManageTembusan() {
  const navigate = useNavigate();
  const [Tembusan, setTembusan] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
  });

  const fetchData = async () => {
    try {
      const response = await getAllTembusan();
      setTembusan(response);
      console.log("apa isi klas surat",response)
    } catch (error) {
      console.error("Error deleting Data:", error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await createTembusan(formData);
        setTembusan((prev) => [...prev, res.data]);
        setOpen(false);
        fetchData();
        setFormData({
            nama: "",
        });
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Data Pegawai berhasil ditambahkan!',
            });
    } catch (error) {
        console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan saat input data.',
        });
    }
  };

  const handleDeleteTembusan = (id) => {
    Swal.fire({
      title: "Konfirmasi Penghapusan",
      text: "Apakah Anda yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: 'Memproses...',
            text: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          await deleteTembusan(id);
          setTembusan((prevData) =>
            prevData.filter((data) => data.id !== id)
          );
          Swal.close();
          Swal.fire({
            title: "Data berhasil dibatalkan",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting Data:", error.message);
          Swal.close();
          Swal.fire({
            title: "Gagal menghapus data. Silahkan coba lagi!",
            icon: "error"
          });
        }
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold"></h1>
        <Button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Tambah Tembusan Surat
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
                  >
                    No
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
                  >
                    Nama Tembusan
                  </TableCell>
                  
                   <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
                  >
                    Aksi
                  </TableCell>


                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {Tembusan.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-4 text-gray-500"
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  Tembusan.map((klas, index) => (
                    <TableRow key={klas.id}>
                      <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 dark:text-white/90">
                        {klas.nama}
                      </TableCell>
                      
                      <TableCell className="px-5 py-4 sm:px-6">
                        <Button size="sm" variant="delete" onClick={() => handleDeleteTembusan(klas.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        className="max-w-[700px] m-4 "
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Input Data Tembusan Surat
            </h4>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">

                <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                  <div className="">
                    <Label htmlFor="nama">Nama Tembusan</Label>
                    <Input
                      type="text"
                      id="nama"
                      name="nama"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nama: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Simpan
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
