import React, {useEffect, useState} from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SuratMasukDetail from "../../components/detail/SuratMasukDetail";
import Disposisi from "../../components/detail/Disposisi";
import Document from "../../components/detail/Document";
import { useParams } from "react-router-dom";
import { getByIdSuratMasuk, editSuratMasuk } from "../../modules/fetch/surat-masuk";

export default function DetailSuratMasuk() {
  const { id } = useParams();
  const [detailData, setDetailData] = useState({});
  const [dataDocument, setDataDocument] = useState([])

  console.log("apa isi id", detailData)
  console.log("isi document:", dataDocument)

  const fetchData = async () => {
    try {
      const response = await getByIdSuratMasuk(id);
      console.log("apa isi repsonse:", response)
      setDetailData(response.data);
      setDataDocument(response.data.Documents)
    } catch (error) {
      console.log("Error fetching Surat Masuk", error);
    }
  };

  useEffect(() => {
  
    fetchData();
  },[id])

  return (
    <>
      <PageBreadcrumb pageTitle="Surat Masuk" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <SuratMasukDetail data={detailData} refreshData={fetchData}/>
          <Disposisi />
          <Document data={dataDocument}/>
        </div>
      </div>
    </>
  );
}
