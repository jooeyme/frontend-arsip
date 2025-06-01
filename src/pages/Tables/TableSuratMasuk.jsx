import React, { useState, useCallback } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import SuratMasukTable from "../../components/tables/SuratMasukTable";
import SearchBar from "../../components/form/SearchBar";
import { searchSuratMasuk } from "../../modules/fetch/surat-masuk";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TableSuratMasuk() {
  const { user, loading } = useAuth();
  const [results, setResults] = useState([]);
  const [keyword, setKeyword] = useState(""); 
  const [loadingSearch, setLoading] = useState(false);

  const handleSearch = useCallback(async (kw) => {
    console.log("Mencari:", kw);
    setKeyword(kw);
    if (kw.trim().length < 3) {
      // clear hasil search kalau kurang dari 3 karakter
      return setResults([]);
    }
    setLoading(true);
    try {
      const results = await searchSuratMasuk(kw);
      setResults(results);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  console.log('user:', user)
  console.log('user:', loading)

  if (loading)   return <p>Loading…</p>;
  if (!user)     return <Navigate to="/signin" />
    
      const role = user.role; 
      const me = user.nama_lengkap;


  return (
    <>
      <PageBreadcrumb pageTitle="Surat Masuk" />
      <div className="space-y-6">
        <ComponentCard title="Tabel Surat Masuk">
          {/* <Button onClick={handleInput} variant="outline">
            <PlusCircle /> Tambah Surat Masuk
          </Button> */}
          <div className="flex justify-end">
            <SearchBar
              keyword={keyword}
              onKeywordChange={setKeyword}
              onSearch={handleSearch}
              loading={loadingSearch}
              
            />
          </div>
          <SuratMasukTable 
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
