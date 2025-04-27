import React, {useState, useCallback} from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import SuratKeluarTable from "../../components/tables/suratKeluarTables";
import SearchBar from "../../components/form/SearchBar";
import Button from "../../components/ui/button/Button";
import { searchSuratKeluar } from "../../modules/fetch/surat-keluar";
import { useNavigate } from "react-router-dom";

export default function TableSuratKeluar() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = useCallback(async (keyword) => {
    console.log("Mencari:", keyword);
    setLoading(true);
    try {
      const results = await searchSuratKeluar(keyword);
      setResults(results);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  },[]);

  const handleSelectItem = (id) => {
    navigate(`/detail-surat-keluar/${id}`);
  };

  const handleInput = () => {
    navigate(`/form-surat-masuk`);
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Surat Keluar" />
      <div className="space-y-6">
        <ComponentCard title="Tabel Surat Keluar">
        <Button 
            size="sm"
            variant="outline"
            onClick={handleInput}
        >
            Input Surat Keluar
        </Button>
        <div className="flex justify-end">
          <SearchBar onSearch={handleSearch} results={results} loading={loading} onSelect={handleSelectItem}/>
        </div>
          <SuratKeluarTable />
        </ComponentCard>
      </div>
    </>
  );
}
