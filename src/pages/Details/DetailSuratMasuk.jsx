import React, {useCallback, useEffect, useState} from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SuratMasukDetail from "../../components/detail/SuratMasukDetail";
import Disposisi from "../../components/detail/Disposisi";
import Document from "../../components/detail/Document";
import { Navigate, useParams } from "react-router-dom";
import { getByIdSuratMasuk, getTrackSuratMasuk } from "../../modules/fetch/surat-masuk";
import { useAuth } from "../../context/AuthContext";
import TrackSuratMasuk from "../../components/detail/TrackSuratMasuk";

export default function DetailSuratMasuk() {
  const { user, loading } = useAuth();
  const { id } = useParams();
  const [detailData, setDetailData] = useState({});
  const [dataDocument, setDataDocument] = useState([]);
  const [disposisi, setDisposisi] = useState([]);
  const [no_agenda, setNo_agenda] = useState("");
  const [statusSurat, setStatusSurat] = useState("");
  const [dataTrack, setDataTrack] = useState([])

   const fetchData = useCallback(async () => {
      try {
        const response = await getByIdSuratMasuk(id);
        const track = await getTrackSuratMasuk(id); 
        setDetailData(response.data);
        setNo_agenda(response.data.no_agenda_masuk)
        setDataDocument(response.data.documents);
        setDisposisi(response.data.disposisi || []);
        setStatusSurat(response.data.status);
        setDataTrack(track.data)
      } catch (error) {
        console.log("Error fetching Surat Masuk", error);
      }
    }, [id])

  useEffect(() => {
    fetchData();
  },[fetchData]);

   console.log('user:', user)
  console.log('user:', loading)


  if (loading)   return <p>Loading…</p>;
  if (!user)     return <Navigate to="/signin" />
    
      const role = user.role; 
      const me = user.nama_lengkap;

    if (!detailData || !dataDocument || !disposisi || !no_agenda) {
      return <p>Loading …</p>
    }

  return (
    <>
      <PageBreadcrumb pageTitle="Surat Masuk" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <TrackSuratMasuk events={dataTrack}/>
          <SuratMasukDetail id={id} data={detailData} refreshData={fetchData} me={role}/>
          <Disposisi data={disposisi} ID={no_agenda} refreshData={fetchData} role={role} me={me} statusSurat={statusSurat}/>
          <Document data={dataDocument} me={role}/>
        </div>
      </div>
    </>
  );
}
