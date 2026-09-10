import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Star } from 'lucide-react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet'
import L from 'leaflet'
import api from '../lib/api'

import 'leaflet/dist/leaflet.css'

const DEFAULT_CENTER = [-6.3275, 108.3200]
const LARAVEL_URL = 'http://127.0.0.1:8000'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function MapSection() {
  const [wisata, setWisata] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getWisata() {
      try {
        const response = await api.get('/wisata')

        const data = response.data.data || []

        const validData = data.filter(
          (item) =>
            item.latitude !== null &&
            item.longitude !== null &&
            item.latitude !== undefined &&
            item.longitude !== undefined
        )

        setWisata(validData)
      } catch (error) {
        console.error('Gagal mengambil data wisata:', error)
      } finally {
        setLoading(false)
      }
    }

    getWisata()
  }, [])

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">

        {/* Heading */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-[#5968F2]" />

            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#3542A5]">
              Explore Location
            </span>
          </div>

          <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl">
            Jelajahi
            <br />
            <span className="text-[#3542A5]">
              Indramayu
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-[15px]">
            Temukan berbagai destinasi wisata menarik di
            Indramayu melalui peta interaktif.
          </p>
        </div>

        {/* Map */}
        <div className="relative h-[520px] overflow-hidden rounded-[30px] border border-gray-100 shadow-sm lg:h-[650px]">

          {loading ? (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <div className="text-center">
                <MapPin
                  size={32}
                  className="mx-auto mb-3 animate-bounce text-[#3542A5]"
                />

                <p className="text-sm font-medium text-gray-500">
                  Memuat peta...
                </p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={12}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {wisata.map((item) => (
                <Marker
                  key={item.id}
                  position={[
                    Number(item.latitude),
                    Number(item.longitude),
                  ]}
                >
                  <Popup>
                    <div className="min-w-[200px]">

                      {item.gambar && (
                        <img
                          src={`${LARAVEL_URL}/storage/${item.gambar}`}
                          alt={item.nama}
                          className="mb-3 h-28 w-full rounded-xl object-cover"
                        />
                      )}

                      <h3 className="text-sm font-bold text-gray-900">
                        {item.nama}
                      </h3>

                      {item.lokasi && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                          <MapPin size={12} />
                          <span>{item.lokasi}</span>
                        </div>
                      )}

                      {item.rating && (
                        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#3542A5]">
                          <Star
                            size={12}
                            fill="currentColor"
                          />
                          {item.rating}
                        </div>
                      )}

                      <Link
                        to={`/wisata/${item.slug}`}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#3542A5]"
                      >
                        Lihat detail
                        <ArrowRight size={12} />
                      </Link>

                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Floating Information Card */}
          {!loading && (
            <div className="absolute left-5 top-5 z-[1000] w-[calc(100%-40px)] max-w-[390px] rounded-[24px] bg-white/95 p-6 shadow-xl backdrop-blur-md sm:left-7 sm:top-7 sm:p-7">

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3542A5]/10">
                  <MapPin
                    size={17}
                    className="text-[#3542A5]"
                  />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#3542A5]">
                  Explore Indramayu
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                Temukan tempat
                <br />
                menarik di sekitar Anda
              </h3>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Jelajahi lokasi berbagai destinasi wisata
                di Indramayu melalui peta interaktif.
              </p>

              <div className="mt-5 flex items-center gap-4">
                <div>
                  <p className="text-2xl font-bold text-[#3542A5]">
                    {wisata.length}
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-gray-400">
                    Destinasi
                  </p>
                </div>

                <div className="h-9 w-px bg-gray-200" />

                <div>
                  <p className="text-2xl font-bold text-[#3542A5]">
                    Indramayu
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-gray-400">
                    Jawa Barat
                  </p>
                </div>
              </div>

              <Link
                to="/wisata"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#3542A5] px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-[#3542A5]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2d388f]"
              >
                Jelajahi semua wisata

                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

            </div>
          )}

          {/* Bottom Map Label */}
          {!loading && wisata.length > 0 && (
            <div className="absolute bottom-5 right-5 z-[1000] hidden rounded-full bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-md sm:block">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#3542A5]" />

                <span className="text-[10px] font-semibold text-gray-600">
                  {wisata.length} lokasi wisata tersedia
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  )
}