import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import TableArsipSuratKeluar from './pages/Tables/TableArsipSuratKeluar';
import TableArsipSuratMasuk from './pages/Tables/TableArsipSuratMasuk';
import TableSuratMasuk from './pages/Tables/TableSuratMasuk';
import TableSuratKeluar from './pages/Tables/TableSuratKeluar';
import DetailSuratKeluar from './pages/Details/DetailSuratKeluar';
import DetailSuratMasuk from './pages/Details/DetailSuratMasuk';
import FormElements from './pages/Forms/FormElements';
import FormSuratMasuk from './pages/Forms/FormSuratMasuk';
import FormSuratKeluar from './pages/Forms/FormSuratKeluar';
import FormArchiveSuratKeluar from './pages/Forms/FormArchiveSuratKeluar';
import NotFound from './pages/OhterPage/NotFound';
import AppLayout from './layout/AppLayout';
import AuthLayout from './layout/AuthLayout';
import SignIn from './pages/AuthPages/SignIn';
import Calendar from "./pages/Calendar";
import UserProfiles from "./pages/UserProfiles";
import Dashboard from './pages/Dashboard';
import LogPerubahanList from './pages/Details/DetailsLogs';
import PengaturanUsers from './pages/ManageUsers';
import Pegawai from './pages/Pegawai';
import KlasifikasiSurat from './pages/KlasifikasiSurat';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Tujuan from './pages/Tujuan';
import Tembusan from './pages/Tembusan';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          {/* Dashboard Layout */}
          
          <Route element={<AuthProvider><AppLayout /></AuthProvider>}>

            <Route path='/dashboard' element={<Dashboard/>} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path='/atur-pengguna' element={<PengaturanUsers />} />
            <Route path='/atur-pegawai' element={<Pegawai />} />
            <Route path='/atur-klasifikasi' element={<KlasifikasiSurat />} />
            <Route path='/atur-tujuan' element={<Tujuan />} />
            <Route path='/atur-tembusan' element={<Tembusan />} />
            

            <Route path="/detail-surat-keluar/:id" element={<DetailSuratKeluar/>}/>    
            <Route path='/detail-surat-masuk/:id' element={<DetailSuratMasuk/>}/>
            <Route path='/all-logs' element={<LogPerubahanList/>}/>


            {/* Tables */}
            <Route path="/arsip-surat-keluar" element={<TableArsipSuratKeluar />} />
            <Route path="/arsip-surat-masuk" element={<TableArsipSuratMasuk />} />
            <Route path="/letter-in-tables" element={<TableSuratMasuk />} />
            <Route path="/letter-out-tables" element={<TableSuratKeluar />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/form-surat-masuk" element={<FormSuratMasuk />} />
            <Route path='/form-surat-keluar' element={<FormSuratKeluar />} />
            <Route path='/archive-surat-keluar' element={<FormArchiveSuratKeluar />} />
            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
         

          {/* Auth Layout */}
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
