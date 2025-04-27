import React, {useState, useCallback} from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import SuratMasukTable from "../../components/tables/SuratMasukTable";
import SearchBar from "../../components/form/SearchBar";
import { searchSuratMasuk } from "../../modules/fetch/surat-masuk";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/button/Button";
//import PageMeta from "../../components/common/PageMeta";

export default function TableSuratMasuk() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
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

  const handleInput = () => {
    navigate(`/form-surat-masuk`);
  }

  return (
    <>
      {/* <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      /> */}
      <PageBreadcrumb pageTitle="Surat Masuk" />
      <div className="space-y-6">
        <ComponentCard title="Tabel Surat Masuk">
        <Button 
            size="sm"
            variant="outline"
            onClick={handleInput}
        >
            Input Surat Masuk
        </Button>
        <div className="flex justify-end">
          <SearchBar onSearch={handleSearch} results={results} loading={loading} onSelect={handleSelectItem}/>
          </div>
          <SuratMasukTable />
        </ComponentCard>
      </div>
    </>
  );
}
