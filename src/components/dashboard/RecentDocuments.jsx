import React, {useState, useEffect} from "react";
import { formatDistanceToNow } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../ui/table";
  import { format  } from 'date-fns';
  import id from 'date-fns/locale/id'
import Button from "../ui/button/Button";
import { getRecentLetters, getDashboardSuratMasuk, getAdminArchive, getKadepList, getDisposisiList } from "../../modules/fetch/surat-masuk";
import { getDashboardSuratKeluar } from "../../modules/fetch/surat-keluar";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Badge from "../ui/badge/Badge";

const locale = id
export default function RecentDocuments({user}) {
    //const { user, loading } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

     useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        // 1) ambil kedua daftar
        const [resMasuk, resKeluar] = await Promise.all([
          getDashboardSuratMasuk(),
          getDashboardSuratKeluar()
        ])

        

        // 2) normalize & tag jenis
        const masuk  = resMasuk.data.map(item => ({
          ...item,
          jenis_surat: 'masuk',
          timestamp: item.tgl_terima || item.createdAt
        }))
        const keluar = resKeluar.data.map(item => ({
          ...item,
          jenis_surat: 'keluar',
          timestamp: item.tgl_input || item.createdAt
        }))

        

        // 3) gabung + sort descending
        const all = [...masuk, ...keluar]
          .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))


        setTableData(all)
      } catch (err) {
        console.error(err)
        setTableData([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user.role])


 

  
    

  const formatDateString = (dateString) => {
      if (!dateString) return 'Invalid date';
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', {locale});
      
    };
  
  const handleDetail = (id, jenis) => {
    if(jenis === 'masuk') {
      navigate(`/detail-surat-masuk/${id}`);
     } else {
      navigate(`/detail-surat-keluar/${id}`);
     }
      
    
  }


  if (loading) return <p>Memuat data surat terbaru...</p>;

  return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-100">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                Jenis Surat
            </TableCell>
            <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                Nomor Surat
            </TableCell>
            <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                Perihal
            </TableCell>
            <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                Tanggal Surat
            </TableCell>
            <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                Status
                </TableCell>
                <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                Keterangan
                </TableCell>
                <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                Aksi
                </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="px-4 py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                Tidak ada data surat yang memerlukan tindakan Anda
              </TableCell>
            </TableRow>
          ) : (
            tableData.map((order, i) => (
              <TableRow key={i} >
                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.jenis_surat}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.no_surat}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.perihal}
                    
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {formatDateString(order.tgl_surat)}
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
                          : order.status === "waiting_to_archive"
                          ? "waiting_to_archive"
                          : order.status === "draft"
                          ? "draft"
                          : order.status === "review"
                          ? "review"
                          : order.status === "Dept_Review"
                          ? "review"
                          : order.status === "waiting_number"
                          ? "waiting_for_signature"
                          : order.status === "revisi"
                          ? "diproses"
                          : order.status === "waiting_signature"
                          ? "waiting_for_signature"
                          : order.status === "signed"
                          ? "signed"
                          : order.status === "completed"
                          ? "selesai"
                          : order.status === "diarsipkan"
                          ? "archived"
                          : "error"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.keterangan}
                  </TableCell>
                  <TableCell className="flex px-4 py-3 gap-2.5 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Button 
                      size="sm"
                      variant="edit"
                      onClick={() => handleDetail(order.id, order.jenis_surat)}
                  >
                      detail
                  </Button>
                    {/* {order.budget} */}
                  </TableCell>
              </TableRow>
            ))
          )}
          </TableBody>
        </Table>
      </div>
      </div>
      </div>
    
  );
}