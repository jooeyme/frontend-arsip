import React, {useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { format  } from 'date-fns';
import id from 'date-fns/locale/id'
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { getAllSuratMasuk } from "../../modules/fetch/surat-masuk";
import { useNavigate } from "react-router-dom";

const locale = id
export default function SuratMasukTable() {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate()
  
  const handleEdit = (id) => {
    // Memanggil useNavigate()
  navigate(`/detail-surat-masuk/${id}`);  // Pindah ke halaman detail
  
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllSuratMasuk();
        console.log("apa isi repsonse:", response)
        setTableData(response.data);
      } catch (error) {
        console.log("Error fetching Surat Masuk", error);
      }
    };
  
    fetchData();
  },[])

  const formatDateString = (dateString) => {
    if (!dateString) return 'Invalid date';
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy', {locale});
    
  };
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
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
                </TableCell>{" "}
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
                  Keterangan
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((order) => (
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
                    {order.keterangan}
                  </TableCell>
                  <TableCell className="flex px-4 py-3 gap-2.5 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Button 
                      size="sm"
                      variant="edit"
                      onClick={() => handleEdit(order.id)}
                  >
                      edit
                  </Button>
                  <Button 
                      size="sm"
                      variant="delete"
                  >
                      delete
                  </Button>
                    {/* {order.budget} */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
