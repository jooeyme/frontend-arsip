import React, {useEffect, useState} from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SuratKeluarDetail from "../../components/detail/SuratKeluarDetail";
import Disposisi from "../../components/detail/Disposisi";
import Document from "../../components/detail/Document";
import { useParams } from "react-router-dom";
import { getByIdSuratKeluar } from "../../modules/fetch/surat-keluar";

export default function DetailSuratKeluar() {
  const { id } = useParams();
  const [detailData, setDetailData] = useState({});
  const [dataDocument, setDataDocument] = useState([])
  
  console.log("apa isi detail data", detailData)
  console.log("apa isisi docut:", dataDocument)

  const fetchData = async () => {
    try {
      const response = await getByIdSuratKeluar(id);
      console.log("apa isi repsonse:", response)
      setDetailData(response.data);
      setDataDocument(response.data.Documents)
    } catch (error) {
      console.log("Error fetching Surat keluar", error);
    }
  };

  useEffect(() => {
  
    fetchData();
  },[id])

  return (
    <>
      <PageBreadcrumb pageTitle="Surat Keluar" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <SuratKeluarDetail data={detailData} refreshData={fetchData}/>
          <Document data={dataDocument}/>
        </div>
      </div>
    </>
  );
}
