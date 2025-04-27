import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BasicTables from "./pages/Tables/BasicTables";
import TableSuratMasuk from './pages/Tables/TableSuratMasuk';
import TableSuratKeluar from './pages/Tables/TableSuratKeluar';
import DetailSuratKeluar from './pages/Details/DetailSuratKeluar';
import DetailSuratMasuk from './pages/Details/DetailSuratMasuk';
import FormElements from './pages/Forms/FormElements';
import FormSuratMasuk from './pages/Forms/FormSuratMasuk';
import FormSuratKeluar from './pages/Forms/FormSuratKeluar';
import NotFound from './pages/OhterPage/NotFound';
import AppLayout from './layout/AppLayout';
import AuthLayout from './layout/AuthLayout';
import SignIn from './pages/AuthPages/SignIn';
import Calendar from "./pages/Calendar";
import UserProfiles from "./pages/UserProfiles";

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>


            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />

            <Route path="/detail-surat-keluar/:id" element={<DetailSuratKeluar/>}/>    
            <Route path='/detail-surat-masuk/:id' element={<DetailSuratMasuk/>}/>
            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/letter-in-tables" element={<TableSuratMasuk />} />
            <Route path="/letter-out-tables" element={<TableSuratKeluar />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/form-surat-masuk" element={<FormSuratMasuk />} />
            <Route path='/form-surat-keluar' element={<FormSuratKeluar />} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Auth Layout */}
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
