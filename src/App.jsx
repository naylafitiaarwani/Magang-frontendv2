import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './layouts/Layout'

import Home from './pages/Home'
import Wisata from './pages/Wisata'
import Budaya from './pages/Budaya'
import Kuliner from './pages/Kuliner'
import Umkm from './pages/Umkm'
import Sejarah from './pages/Sejarah'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout />}>

          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Wisata */}
          <Route
            path="/wisata"
            element={<Wisata />}
          />

          {/* Budaya */}
          <Route
            path="/budaya"
            element={<Budaya />}
          />

          {/* Kuliner */}
          <Route
            path="/kuliner"
            element={<Kuliner />}
          />

          {/* UMKM */}
          <Route
            path="/umkm"
            element={<Umkm />}
          />

          {/* Sejarah */}
          <Route
            path="/sejarah"
            element={<Sejarah />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App