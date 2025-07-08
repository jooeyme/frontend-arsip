import React, {useState, useCallback} from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import SuratKeluarTable from "../../components/tables/suratKeluarTables";
import SearchBar from "../../components/form/SearchBar";
import { searchSuratKeluar } from "../../modules/fetch/surat-keluar";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SuratKeluarDataTable from "../../components/tables/TableData";
import UserTable from "../../components/tables/ReactTableData";

export default function TableSuratKeluar() {
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

  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/signin" />
    
      const role = user.role; 
      const me = user.nama_lengkap;
  
  return (
    <>
      <PageBreadcrumb pageTitle="Surat Keluar" />
      <div className="space-y-6">
        <ComponentCard title="Tabel Surat Keluar">
        {/* <div className="flex justify-end">
          <SearchBar 
              keyword={keyword}
              onKeywordChange={setKeyword}
              onSearch={handleSearch}
              loading={loadingSearch}
          />
        </div> */}
          <SuratKeluarTable 
            me={role}
            searchResults={results}
            loadingSearch={loadingSearch}
            keyword={keyword}
          />

          {/* <SuratKeluarDataTable 
          me={role}
          />

          <UserTable /> */}
        </ComponentCard>
      </div>
    </>
  );
}
