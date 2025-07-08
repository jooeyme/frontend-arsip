import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal"; // Sesuaikan path modal kamu
import { useModal } from "../../hooks/useModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { getAllUser, createUser, deleteUser, getUserById, updateUser, forgotPassword } from "../../modules/fetch/user";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Swal from "sweetalert2";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [pengguna, setPengguna] = useState({})
  const inputModal = useModal();
  const editModal = useModal();
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    username: "",
    email: "",
    jabatan: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [formEditData, setFormEditData] = useState({
    nama_lengkap: "",
    username: "",
    jabatan: "",
    role: "",
  });

  const roleOptions = [
    { value: "super_admin", label: "Admin Super" },
    { value: "administrasi", label: "Administrasi" },
    { value: "ktu", label: "KTU" },
    { value: "kadep", label: "Ketua Departemen" },
    { value: "sekdep", label: "Sekretaris Departemen" },
  ];

  const handleSelectChangeRole = (value) => {
    console.log("apa isi value:", value)
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSelectEditRole = (value) => {
    console.log("apa isi value:", value)
    setFormEditData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const fetchData = async () => {
    try {
      const response = await getAllUser();
      setUsers(response.data);
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
      Swal.fire({
        title: 'Memproses...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const res = await createUser(formData);
      
      setUsers((prev) => [...prev, result.data]);
      inputModal.closeModal();
      setFormData({
        nama_lengkap: "",
        username: "",
        email: "",
        jabatan: "",
        role: "",
        password: "",
      });
      fetchData();

      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'User berhasil ditambahkan!',
      });
    } catch (error) {
      console.error('Error add user:', error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan saat tambah user.',
      }); 
    }
  };

  const handleEditUser = async (id) => {
    console.log("apa isi form edit:", formEditData)
    try {
       Swal.fire({
        title: 'Memproses...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const updated = await updateUser(id, formEditData);
      
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'User berhasil Diupdate!',
      });

      fetchData()
    } catch (error) {
      console.error('Error add user:', error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan saat add user.',
      }); 
    }
  }

  const handleEdit = async (id) => {
    // Memanggil useNavigate()
    editModal.openModal()  // Pindah ke halaman detail
    const user = await getUserById(id);
    setPengguna(user.data);

    setFormEditData({
      nama_lengkap: user.data.nama_lengkap || "",
      username: user.data.username || "",
      jabatan: user.data.jabatan || "",
      role: user.data.role || "",
  });
  };


  const handleDelete = async(id) => {
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
          await deleteUser(id);
          setUsers((prevData) =>
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
  }

  const handleForgotPassword = async(id) => {
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
          await forgotPassword(id);
          Swal.close();
          Swal.fire({
            title: "Data berhasil dibatalkan",
            icon: "success",
          });
        } catch (error) {
          console.error("Error Send Email Reset Password Data:", error.message);
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
          onClick={inputModal.openModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Tambah User
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
                    Nama Lengkap
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
                  >
                    Username
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
                  >
                    Jabatan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
                  >
                    Role
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
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-4 text-gray-500"
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 dark:text-white/90">
                        {user.nama_lengkap}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">
                        {user.username}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">
                        {user.email}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">
                        {user.jabatan}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">
                        {user.role}
                      </TableCell>
                      <TableCell className="flex px-5 py-4 sm:px-6 gap-2">
                        <Button size="sm" variant="edit" onClick={() => handleEdit(user.id)}>
                          detail
                        </Button>

                        <Button 
                        size="sm"
                        variant="delete"
                        onClick={() =>  handleDelete(user.id)}
                    >
                        delete
                      </Button>
                      <Button 
                        size="sm"
                        variant="submit"
                        onClick={() =>  handleForgotPassword(user.id)}
                    >
                        Reset Password
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
        isOpen={inputModal.isOpen}
        onClose={inputModal.closeModal}
        className="max-w-[700px] m-4 "
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Informasi Surat Masuk
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Informasi Surat Masuk
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                    <Input
                      type="text"
                      id="nama_lengkap"
                      name="nama_lengkap"
                      value={formData.nama_lengkap}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nama_lengkap: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="jabatan">Jabatan</Label>
                    <Input
                      type="text"
                      id="jabatan"
                      name="jabatan"
                      value={formData.jabatan}
                      onChange={(e) =>
                        setFormData({ ...formData, jabatan: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="jenis">Jenis</Label>
                    <Select
                      options={roleOptions}
                      placeholder="Select an option"
                      onChange={handleSelectChangeRole}
                      className="dark:bg-dark-900"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="text"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                    <Input
                      type="text"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Simpan
            </Button>
          </form>
        </div>
      </Modal>

    {/*EDIT MODAL */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        className="max-w-[700px] m-4 "
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Informasi Pengguna
            </h4>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault()
            handleEditUser(pengguna.id)}} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Informasi Surat Masuk
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                    <Input
                      type="text"
                      id="nama_lengkap"
                      name="nama_lengkap"
                      value={formEditData.nama_lengkap}
                      onChange={(e) =>
                        setFormEditData({
                          ...formEditData,
                          nama_lengkap: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      type="text"
                      id="username"
                      name="username"
                      value={formEditData.username}
                      onChange={(e) =>
                        setFormEditData({ ...formEditData, username: e.target.value })
                      }
                    />
                  </div>


                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="jabatan">Jabatan</Label>
                    <Input
                      type="text"
                      id="jabatan"
                      name="jabatan"
                      value={formEditData.jabatan}
                      onChange={(e) =>
                        setFormEditData({ ...formEditData, jabatan: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="jenis">Jenis</Label>
                    <Select
                      options={roleOptions}
                      defaultValue={formEditData.role}
                      placeholder="Select an option"
                      onChange={handleSelectEditRole}
                      className="dark:bg-dark-900"
                    />
                  </div>

                </div>
              </div>
            </div>

            <Button
              type="submit"
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
