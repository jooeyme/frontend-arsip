// UserTable.jsx
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getAllUser } from "../../modules/fetch/user";

const DetailButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-1 px-3 rounded-md"
  >
    detail
  </button>
);

const DeleteButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md"
  >
    delete
  </button>
);

const StatusBadge = ({ status }) => {
  const color = status === "completed" ? "bg-green-200 text-green-700" : "bg-gray-200 text-gray-700";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      {status}
    </span>
  );
};


// Custom Styles (optional)
const customStyles = {
  table: {
    style: {
      borderRadius: "0.5rem",
     
    },
  },
  headRow: {
    style: {
      backgroundColor: "#f9fafb",
      borderTopLeftRadius: "0.5rem",
      borderTopRightRadius: "0.5rem",
      fontWeight: "500",
      fontSize: "14px"
    },
  },
  headCells: {
    style: {
      fontSize: "14px",
      paddingTop: "12px",
      paddingBottom: "12px",
      paddingLeft: "16px",
    },
  },

  rows: {
    style: {
      fontSize: "14px",
      paddingLeft: "16px",
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #f3f4f6",
    },
  },
  pagination: {
    style: {
      display: "flex",
      border: "1px",
      alignItems: "center",
      padding: "10px",
      fontSize: "14px",
      borderTop: "1px solid #e5e7eb",
    },
  },
};

// Kolom yang akan ditampilkan di table
const columns = [
  {
    name: "Nama Lengkap",
    selector: row => row.nama_lengkap,
    sortable: true,
  },
  {
    name: "Email",
    selector: row => row.email,
    sortable: true,
  },
  {
    name: "Username",
    selector: row => row.username,
  },
  {
    name: "Aksi",
    cell: row => (
      <div className="flex gap-2">
        <DetailButton onClick={() => alert(`Detail surat ${row.nomor}`)} />
        <DeleteButton onClick={() => alert(`Hapus surat ${row.nomor}`)} />
      </div>
    ),
  },
];

const UserTable = () => {
  const [data, setData] = useState([]); // untuk menyimpan data
  const [loading, setLoading] = useState(true); // indikator loading
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Fungsi ambil data dari API
  const fetchData = async () => {
    try {
      const response = await getAllUser();
      setData(response.data); // simpan data ke state
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false); // matikan loading
    }
  };

  // Ambil data saat komponen dimuat
  useEffect(() => {
    fetchData();
    setFilteredData(data);
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchText(keyword);
    const result = data.filter((item) =>
      item.nama_lengkap.toLowerCase().includes(keyword) ||
      item.username.toLowerCase().includes(keyword) ||
      item.email.toLowerCase().includes(keyword)
    );
    setFilteredData(result);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold mb-2 sm:mb-0">Daftar Surat</h1>
        </div>
      <input
          type="text"
          className="border px-3 py-2 rounded-md text-sm w-full sm:w-64"
          placeholder="Cari surat..."
          value={searchText}
          onChange={handleSearch}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        customStyles={customStyles}
        pagination
        highlightOnHover
        responsive
        persistTableHead
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 15]}
      />
    </div>
  );
};

export default UserTable;
