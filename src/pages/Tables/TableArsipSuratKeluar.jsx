import React, { useCallback, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ArsipSuratKeluarTable from "../../components/tables/arsipSuratKeluarTable";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { downloadArchivedSuratKeluar, searchSuratKeluar } from "../../modules/fetch/surat-keluar";
import SearchBar from "../../components/form/SearchBar";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/button/Button";
//import PageMeta from "../../components/common/PageMeta";

export default function TableArsipSuratKeluar() {
  const { user, loading } = useAuth();
  const [results, setResults] = useState([]);
  const [keyword, setKeyword] = useState(""); 
  const [loadingSearch, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = useCallback(async (kw) => {
    setKeyword(kw);
    if (kw.trim().length < 3) {
      // clear hasil search kalau kurang dari 3 karakter
      return setResults([]);
    }
    setLoading(true);
    try {
      const results = await searchSuratKeluar(kw);
      setResults(results);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  },[]);

  const handleDownload = async() => {
    const { isConfirmed } = await Swal.fire({
      title: 'Konfirmasi Download',
      text:  'Apakah Anda yakin ingin mengunduh arsip Surat Keluar?',
      icon:  'question',
      showCancelButton:  true,
      confirmButtonText: 'Ya, Unduh',
      cancelButtonText:  'Batal'
    })
    if (isConfirmed) {
      try {
        await downloadArchivedSuratKeluar()
      } catch (err) {
        Swal.fire('Error', err.message, 'error')
      }
  }
  }
  const handleSelectItem = (id) => {
    navigate(`/detail-surat-keluar/${id}`);
  };

  const handleInput = () => {
    navigate(`/form-surat-keluar`);
  }

  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/signin" />
    
      const role = user.role; 
      const me = user.nama_lengkap;

  return (
    <>
      {/* <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      /> */}
      <PageBreadcrumb pageTitle="Arsip Surat Keluar" />
      <div className="space-y-6">
        <ComponentCard title="Tabel Arsip Surat Keluar">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
          >
            Download Arsip
          </Button>
          <div className="flex justify-end">
          <SearchBar
              keyword={keyword}
              onKeywordChange={setKeyword}
              onSearch={handleSearch}
              loading={loadingSearch}
          />
        </div>
          <ArsipSuratKeluarTable 
            me={role}
            searchResults={results}
            loadingSearch={loadingSearch}
            keyword={keyword}
          />
        </ComponentCard>
      </div>
    </>
  );
}
