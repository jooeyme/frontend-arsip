import React, {useCallback, useEffect, useState} from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SuratKeluarDetail from "../../components/detail/SuratKeluarDetail";
import Disposisi from "../../components/detail/Disposisi";
import Document from "../../components/detail/Document";
import { useParams } from "react-router-dom";
import { getByIdSuratKeluar, getTrackSuratKeluar } from "../../modules/fetch/surat-keluar";
import { getReviewsBySuratId } from '../../modules/fetch/review';
import ReviewList from "../../components/detail/ReviewList";
import SuratKeluarTracker from "../../components/detail/TrackSuratKeluar";
import { useAuth } from "../../context/AuthContext";

export default function DetailSuratKeluar() {
  const { user, loading } = useAuth();
  const { id } = useParams();
  const [detailData, setDetailData] = useState({});
  const [dataDocument, setDataDocument] = useState([]);
  const [dataTrack, setDataTrack] = useState([]);
  const [reviews, setReviews] = useState([]);


  const fetchData = useCallback(async () => {
    try {
      const response = await getByIdSuratKeluar(id);
      const track = await getTrackSuratKeluar(id);
      const review  = await getReviewsBySuratId(id);
      console.log("apa isi repsonse:", review.data);
      setDetailData(response.data);
      setDataDocument(response.data.documents);
      setDataTrack(track.data);
      setReviews(review.data);
    } catch (error) {
      console.log("Error fetching Surat keluar", error);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  },[fetchData])

  if (loading)   return <p>Loading…</p>;
  if (!user)     return <Navigate to="/signin" />
    
      const role = user.role; 
      const me = user.nama_lengkap;

      if (!detailData || !dataDocument) {
      return <p>Loading …</p>
    }

  return (
    <>
      <PageBreadcrumb pageTitle="Surat Keluar" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <SuratKeluarTracker timeline={dataTrack}/>
          <SuratKeluarDetail id={id} me={role} data={detailData} refreshData={fetchData}/>
          <ReviewList data={reviews} currentStatus={detailData.status} refreshData={fetchData}/>
          <Document data={dataDocument} refreshData={fetchData}/>
        </div>
      </div>
    </>
  );
}
