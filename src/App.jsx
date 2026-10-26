import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './layouts/Layout'

import Home from './pages/Home'
import Wisata from './pages/Wisata'
import WisataShow from './pages/WisataShow'

import Budaya from './pages/Budaya'
import BudayaShow from './pages/BudayaShow'

import Kuliner from './pages/Kuliner'
import KulinerShow from './pages/KulinerShow'

import Sejarah from './pages/Sejarah'
import SejarahShow from './pages/SejarahShow'

import Umkm from './pages/Umkm'
import UmkmShow from './pages/UmkmShow'

import Login from './pages/Login'
import Register from './pages/Register'

import RiwayatPesanan from './pages/RiwayatPesanan'
import PengajuanWisata from './pages/PengajuanWisata'
import DashboardPengelola from './pages/DashboardPengelola'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================== PUBLIC PAGES ==================== */}
        <Route element={<Layout />}>

          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Wisata */}
          <Route path="/wisata" element={<Wisata />} />

          {/* Budaya */}
          <Route path="/budaya" element={<Budaya />} />

          {/* Kuliner */}
          <Route path="/kuliner" element={<Kuliner />} />

          {/* UMKM */}
          <Route path="/umkm" element={<Umkm />} />

          {/* Sejarah */}
          <Route path="/sejarah" element={<Sejarah />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Pesanan Tiket */}
          <Route path="/pesanan-tiket" element={<RiwayatPesanan />} />

        </Route>


        {/* ==================== DETAIL PAGES ==================== */}

        {/* Detail Wisata */}
        <Route
          path="/wisata/:slug"
          element={<WisataShow />}
        />

        {/* Detail Budaya */}
        <Route
          path="/budaya/:slug"
          element={<BudayaShow />}
        />

        {/* Detail Kuliner */}
        <Route
          path="/kuliner/:slug"
          element={<KulinerShow />}
        />

        {/* Detail Sejarah */}
        <Route
          path="/sejarah/:slug"
          element={<SejarahShow />}
        />

        {/* Detail UMKM */}
        <Route
          path="/umkm/:slug"
          element={<UmkmShow />}
        />


        {/* ==================== PENGELOLA ==================== */}

        {/* Pengajuan Wisata */}
        <Route
          path="/pengajuan-wisata"
          element={<PengajuanWisata />}
        />

        {/* Dashboard Pengelola */}
        <Route
          path="/dashboard"
          element={<DashboardPengelola />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App