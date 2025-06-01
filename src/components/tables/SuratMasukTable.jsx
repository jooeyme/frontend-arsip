import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { format } from "date-fns";
import id from "date-fns/locale/id";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import {
  getAllSuratMasuk,
  deleteSuratMasuk,
  searchSuratMasuk,
} from "../../modules/fetch/surat-masuk";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SearchBar from "../form/SearchBar";


const locale = id;

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// split text by keyword (case-insensitive) and wrap matches in <mark>
function highlightText(text, keyword) {
  if (!keyword) return text;
  const pattern = new RegExp(`(${escapeRegExp(keyword)})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part) ? (
      <mark key={i} className="bg-yellow-200">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SuratMasukTable({ 
  me, 
  keyword = "",
  searchResults = [],
  loadingSearch }) {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [results, setResults] = useState([]);
  const [loadingAuth, setLoading] = useState(false);

  const handleSearch = useCallback(async (keyword) => {
    console.log("Mencari:", keyword);
    setLoading(true);
    try {
      const results = await searchSuratMasuk(keyword);
      setResults(results);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectItem = (id) => {
    navigate(`/detail-surat-masuk/${id}`);
  };

  const handleEdit = (id) => {
    // Memanggil useNavigate()
    navigate(`/detail-surat-masuk/${id}`); // Pindah ke halaman detail
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Konfirmasi Penghapusan",
      text: "Apakah Anda yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("apa isi id:", id);
        try {
          Swal.fire({
            title: "Memproses...",
            text: "Mohon tunggu sebentar",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          await deleteSuratMasuk(id);

          setTableData((prevData) => prevData.filter((data) => data.id !== id));
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
            icon: "error",
          });
        }
      }
    });
  };

  const fetchData = useCallback(async () => {
      try {
        
        const response = await getAllSuratMasuk( page, limit, statusFilter, jenisFilter );
        console.log("apa isi repsonse:", response.total);

        setTableData(response.data);
        setTotal(response.total);
      } catch (error) {
        console.log("Error fetching Surat Masuk", error);
      }
    }, [page, limit, statusFilter, jenisFilter]);

  useEffect(() => {
    if (keyword.trim().length < 3) {
      fetchData();
    }
  }, [fetchData, keyword]);

  const isSearching     = keyword.trim().length >= 3;
  const hasSearchResult = searchResults.length > 0;

  const totalPages = Math.ceil(total / limit);

  const formatDateString = (dateString) => {
    if (!dateString) return "Invalid date";
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy", { locale });
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1); // reset ke halaman pertama
  };
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`relative inline-flex cursor-pointer items-center px-2 py-1 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0 ${
              i === page ? 'z-10 bg-blue-500 text-white' : 'text-gray-900 hover:bg-gray-50'
            }`}
          >
            {i}
          </button>
        );
      } else if (pages[pages.length - 1] !== '...') {
        pages.push(
          <span
            key={i + 'dots'}
            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
          >
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <>
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <label className="mr-2 font-medium text-sm text-gray-700 text-start  dark:text-gray-400">Show:</label>
          <select value={limit} onChange={handleLimitChange} className="border font-medium text-sm text-gray-700 text-start  dark:text-gray-400 cursor-pointer p-1 rounded">
            <option value={2}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={100}>100</option>
          </select>
          <span className="ml-2 font-medium text-sm text-gray-700 text-start  dark:text-gray-400">entri per halaman</span>
        </div>
      
      
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border p-1 rounded font-medium text-sm text-gray-700 text-start  dark:text-gray-400"
        >
          <option value="">Semua Status</option>
          <option value="diterima">Diterima</option>
          <option value="didisposisikan">Didisposisikan</option>
          <option value="diproses">Diproses</option>
          <option value="selesai">Selesai</option>
          <option value="diarsipkan">Diarsipkan</option>
        </select>
        <select
          value={jenisFilter}
          onChange={(e) => { setJenisFilter(e.target.value); setPage(1); }}
          className="border p-1 rounded font-medium text-sm text-gray-700 text-start  dark:text-gray-400"
        >
          <option value="">Semua Jenis</option>
          <option value="internal">Internal</option>
          <option value="eksternal">Eksternal</option>
        </select>
        </div>
    

      {/* <div>
      <SearchBar
        onSearch={handleSearch}
        results={results}
        loading={loadingAuth}
        onSelect={handleSelectItem}
      />
      </div> */}
      </div>
    
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      
      <div className="max-w-full overflow-x-auto">
        
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {isSearching ? (
                <>
                  <TableCell 
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Nomor Agenda
                  </TableCell>
                  <TableCell 
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Nama Dokumen
                  </TableCell>
                  <TableCell 
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Snippet
                  </TableCell>
                  <TableCell 
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Aksi
                  </TableCell>
                </>
              ) : (
                <>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nomor Agenda
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Perihal
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tanggal Diterima
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nomor Surat
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tanggal Surat
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Asal Surat
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Aksi
                </TableCell>
                </>
              )}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {isSearching && hasSearchResult && searchResults.map(item => {
              const src = item._source;
              const snippet = src.content
                .split(" ")
                .slice(0, 15)
                .join(" ") + " ...";
              return (
                <TableRow key={item._id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {src.no_agenda}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {src.name_doc}
                    </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {highlightText(snippet, keyword)}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="edit" onClick={() => handleEdit(item._id)}>
                      detail
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}

            {/** SEARCH TIDAK DITEMUKAN **/}
            {isSearching && !hasSearchResult && !loadingSearch && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                  Data surat tidak ditemukan
                </TableCell>
              </TableRow>
            )}
              
              {!isSearching && tableData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {order.no_agenda_masuk}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.perihal}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {formatDateString(order.tgl_terima)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.no_surat}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {formatDateString(order.tgl_surat)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.asal_surat}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      variant="solid"
                      size="md"
                      color={
                        order.status === "diterima"
                          ? "diterima"
                          : order.status === "didisposisikan"
                          ? "didisposisikan"
                          : order.status === "diproses"
                          ? "diproses"
                          : order.status === "selesai"
                          ? "selesai"
                          : order.status === "diarsipkan"
                          ? "archived"
                          : "error"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex px-4 py-3 gap-2.5 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Button
                      size="sm"
                      variant="edit"
                      onClick={() => handleEdit(order.id)}
                    >
                      detail
                    </Button>
                { me === "administrasi" && (
                    <Button
                      size="sm"
                      variant="delete"
                      onClick={() => handleDelete(order.id)}
                    >
                      delete
                    </Button>
                )}
                    {/* {order.budget} */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>


        </div>
        
      </div>
    </div>

{/* PAGINATION UI */}
{!isSearching && (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
              <span className="font-medium">{total}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="relative inline-flex cursor-pointer items-center rounded-l-md p-1 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="relative inline-flex cursor-pointer items-center rounded-r-md p-1 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
)}
    </>
  );
}
