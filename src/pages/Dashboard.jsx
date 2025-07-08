import React, { use, useEffect, useState } from "react";
import StatsCard from "../components/dashboard/StatsCard";
import RecentDocuments from "../components/dashboard/RecentDocuments";
import QuickActions from "../components/dashboard/QuickActions";
import { Navigate, useNavigate } from "react-router-dom";
import { getDashboardStats } from "../modules/fetch/dokumen";
import ComponentCard from "../components/common/ComponentCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { useAuth } from "../context/AuthContext";


export default function Dashboard() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [Stats, setStats] = useState([]);

    const fetchData = async() => {
        try {
            const response = await getDashboardStats();

            setStats(response);
            
        } catch (error) {
            console.error("Error fetching data", error.message);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

  const mockDocuments = [
    { nomor: "001/SM/2025", jenis: "masuk", tanggal: new Date(), status: "pending" },
    { nomor: "002/SK/2025", jenis: "keluar", tanggal: new Date(), status: "disposisi" },
  ];

  if (loading)   return <p>Loading…</p>;
    if (!user)     return <Navigate to="/signin" />
  

  return (
    <>
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        Dashboard ({user.role})
      </h2>
      </div>
    <div className="space-y-6">
      <StatsCard stats={Stats}/>
      {user.role === 'administrasi' && (
      <QuickActions 
        onAddSuratMasuk={() => navigate(`/form-surat-masuk`)} 
        onAddSuratKeluar={() => navigate(`/form-surat-keluar`)} 
      />
      )}
      <ComponentCard title="Daftar Surat Menunggu Aksi">
      <RecentDocuments user={user}/>
      </ComponentCard>
      
    </div>
    </>
  );
}
