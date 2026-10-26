import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'

import 'swiper/css'

import api from '../lib/api'

const LARAVEL_URL = 'http://127.0.0.1:8000'

export default function ExploreSection() {
  const [items, setItems] = useState([])
  const [swiper, setSwiper] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(1)

  useEffect(() => {
    async function getExploreData() {
      try {
        const [
          wisataResponse,
          kulinerResponse,
          sejarahResponse,
        ] = await Promise.all([
          api.get('/wisata'),
          api.get('/kuliner'),
          api.get('/sejarah'),
        ])

        const wisata = wisataResponse.data.data || []
        const kuliner = kulinerResponse.data.data || []
        const sejarah = sejarahResponse.data.data || []

        const exploreData = [
          ...kuliner.map((item) => ({
            ...item,
            type: 'kuliner',
          })),

          ...sejarah.map((item) => ({
            ...item,
            type: 'sejarah',
          })),

          ...wisata.map((item) => ({
            ...item,
            type: 'wisata',
          })),
        ]

        setItems(exploreData)
      } catch (error) {
        console.error(
          'Gagal mengambil data eksplorasi:',
          error
        )
      }
    }

    getExploreData()
  }, [])

  function getImage(item) {
    if (!item?.gambar) {
      return '/images/placeholder.jpg'
    }

    return `${LARAVEL_URL}/storage/${item.gambar}`
  }

  function getDetailUrl(item) {
    if (item.type === 'wisata') {
      return `/wisata/${item.slug}`
    }

    if (item.type === 'kuliner') {
      return `/kuliner/${item.slug}`
    }

    if (item.type === 'sejarah') {
      return `/sejarah/${item.slug}`
    }

    return '#'
  }

  function getTypeLabel(type) {
    if (type === 'wisata') return 'Wisata'
    if (type === 'kuliner') return 'Kuliner'
    if (type === 'sejarah') return 'Sejarah'

    return ''
  }

  return (
    <section
      id="eksplorasi"
      className="relative overflow-hidden bg-[#092F4A] py-16 lg:py-20"
    >

      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0">

        <img
          src={`${LARAVEL_URL}/images/home/8juBP4QHYlR05ZnMYe77tbSAopoCTDWFwUjID0qp.png`}
          alt=""
          className="h-full w-full object-cover opacity-90 blur-[8px]"
        />

        <div className="absolute inset-0 bg-[#052B45]/85" />

      </div>


      {/* ================= CONTENT ================= */}

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-10">

        <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">


          {/* ================= LEFT ================= */}

          <div className="flex flex-col justify-between">

            <div>

              <h2 className="max-w-[320px] text-3xl font-bold leading-[1.12] text-white lg:text-[32px]">
                Banyak Tempat, Kuliner,
                Sejarah dan Lainnya
                untuk Dieksplor!
              </h2>

              <p className="mt-5 max-w-[300px] text-sm leading-[1.65] text-gray-200">
                Jelajahi kekayaan Indramayu mulai dari
                destinasi menarik, kuliner khas, hingga
                UMKM dan budaya lokal. Semua yang kamu
                butuhkan untuk mengenal Indramayu, ada
                di sini.
              </p>

              <Link
                to="/wisata"
                className="mt-6 inline-flex border border-white px-5 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-[#092F4A]"
              >
                Jelajahi Lainnya
              </Link>

            </div>


            {/* ================= CONTROLLER ================= */}

            <div className="relative z-30 mt-12">

              <div className="flex items-center justify-between">

                <span className="text-sm text-white">
                  <strong>
                    {String(currentSlide).padStart(2, '0')}
                  </strong>
                  /
                  {String(Math.max(items.length, 1)).padStart(2, '0')}
                </span>


                <div className="relative z-40 flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() => swiper?.slidePrev()}
                    className="relative z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-[#092F4A] text-white transition hover:bg-white hover:text-[#092F4A]"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => swiper?.slideNext()}
                    className="relative z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-[#092F4A] text-white transition hover:bg-white hover:text-[#092F4A]"
                    aria-label="Next"
                  >
                    <ChevronRight size={16} />
                  </button>

                </div>

              </div>


              {/* ================= PROGRESS ================= */}

              <div className="mt-3 h-[2px] w-full bg-white/30">

                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{
                    width: `${
                      items.length
                        ? (currentSlide / items.length) * 100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

          </div>


          {/* ================= CARDS ================= */}

          <div className="min-w-0 overflow-hidden">

            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={1.15}
              onSwiper={setSwiper}
              onSlideChange={(slider) => {
                setCurrentSlide(slider.activeIndex + 1)
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                  spaceBetween: 18,
                },

                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },

                1024: {
                  slidesPerView: 2.5,
                  spaceBetween: 22,
                },

                1280: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
              className="!overflow-hidden"
            >

{items.map((item) => (
  <SwiperSlide
    key={`${item.type}-${item.id}`}
    className="!h-auto"
  >
    <div className="flex h-[500px] flex-col overflow-hidden bg-white shadow-lg">

      {/* IMAGE */}
      <img
        src={getImage(item)}
        alt={item.nama || item.judul}
        className="h-[245px] w-full shrink-0 object-cover"
      />

      {/* CONTENT */}
      <div className="flex h-[255px] flex-col p-5">

        {/* CATEGORY */}
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5968F2]">
          {getTypeLabel(item.type)}
        </span>

        {/* TITLE */}
        <h3 className="mt-2 line-clamp-1 text-base font-bold text-gray-900">
          {item.nama || item.judul}
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
          {item.deskripsi}
        </p>

        {/* LOCATION */}
        {item.lokasi && (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={13} />

            <span className="line-clamp-1">
              {item.lokasi}
            </span>
          </div>
        )}

        {/* DETAIL */}
        <Link
          to={getDetailUrl(item)}
          className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold text-[#1A5D8E] transition hover:text-[#134872]"
        >
          Lihat Detail
          <ChevronRight size={14} />
        </Link>

      </div>

    </div>
  </SwiperSlide>
))}

              

            </Swiper>

          </div>

        </div>

      </div>

    </section>
  )
}