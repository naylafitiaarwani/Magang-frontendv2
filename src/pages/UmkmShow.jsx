import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  MessageCircle,
  Store,
  Phone,
  Package,
} from 'lucide-react'
import axios from 'axios'

const LARAVEL_URL = 'http://127.0.0.1:8000'

const decodeHtml = (value = '') =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")

const formatRupiah = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

const getWhatsappNumber = (value = '') => {
  const number = value.replace(/\D/g, '')

  if (number.startsWith('0')) {
    return `62${number.slice(1)}`
  }

  return number
}

export default function UmkmShow() {
  const { slug } = useParams()

  const [umkm, setUmkm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // ============================================================
  // FETCH DATA
  // ============================================================

  useEffect(() => {
    const fetchUmkm = async () => {
      try {
        setLoading(true)
        setError(false)

        const response = await axios.get(
          `${LARAVEL_URL}/api/umkm/${slug}`
        )

        setUmkm(response.data.data)
      } catch (err) {
        console.error(
          'Gagal mengambil detail UMKM:',
          err
        )

        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchUmkm()
    }
  }, [slug])

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return <LoadingState />
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !umkm) {
    return <ErrorState />
  }

  // ============================================================
  // DATA
  // ============================================================

  const nama = decodeHtml(umkm.nama || '')
  const namaPelaku = decodeHtml(
    umkm.nama_pelaku || ''
  )
  const kategori = decodeHtml(
    umkm.kategori || ''
  )
  const lokasi = decodeHtml(
    umkm.lokasi || ''
  )
  const deskripsi = decodeHtml(
    umkm.deskripsi || ''
  )

  const imageUrl = umkm.gambar
    ? `${LARAVEL_URL}/storage/${umkm.gambar}`
    : '/images/placeholder.jpg'

  const whatsappNumber = getWhatsappNumber(
    umkm.kontak || ''
  )

  const produk = Array.isArray(umkm.produk)
    ? umkm.produk
    : []

  const paragraphs = deskripsi
    .split(/\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <main className="min-h-screen bg-white">

      {/* ========================================================
          HERO
      ======================================================== */}

      <section className="relative overflow-hidden bg-[#0b1020] text-white">

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">

          <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#5968F2]/20 blur-[110px]" />

          <div className="absolute -bottom-48 left-[10%] h-[450px] w-[450px] rounded-full bg-[#3542A5]/20 blur-[100px]" />

          <div className="absolute inset-0 opacity-[0.035]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
          </div>

        </div>


        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-8 lg:pb-24">

          {/* Back */}
          <Link
            to="/umkm"
            className="
              group
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-white/55
              transition
              hover:text-white
            "
          >
            <ArrowLeft
              size={17}
              className="
                transition-transform
                duration-300
                group-hover:-translate-x-1
              "
            />

            Kembali ke UMKM
          </Link>


          {/* Hero content */}
          <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">

            {/* Image */}
            <div
              className="
                relative
                overflow-hidden
                rounded-[32px]
                bg-slate-800
                shadow-2xl
                shadow-black/30
              "
            >

              <div className="aspect-[4/3]">

                <img
                  src={imageUrl}
                  alt={nama}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                  onError={(e) => {
                    e.currentTarget.src =
                      '/images/placeholder.jpg'
                  }}
                />

              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Category */}
              {kategori && (
                <span
                  className="
                    absolute
                    left-5
                    top-5
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    px-4
                    py-2
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-white
                    backdrop-blur-xl
                  "
                >
                  {kategori}
                </span>
              )}

            </div>


            {/* Information */}
            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-9 bg-[#8d98ff]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#aab1ff]">
                  UMKM Indramayu
                </span>

              </div>


              <h1
                className="
                  mt-6
                  text-4xl
                  font-bold
                  leading-[1.05]
                  tracking-[-0.035em]
                  text-white
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                {nama}
              </h1>


              {namaPelaku && (
                <p className="mt-5 text-sm text-white/55 sm:text-base">
                  Dikelola oleh{' '}
                  <span className="font-semibold text-white/85">
                    {namaPelaku}
                  </span>
                </p>
              )}


              {lokasi && (
                <div className="mt-5 flex items-start gap-2.5 text-sm text-white/55">

                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-[#8d98ff]"
                  />

                  <span>
                    {lokasi}
                  </span>

                </div>
              )}


              {/* Contact */}
              {umkm.kontak && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    mt-9
                    inline-flex
                    items-center
                    gap-3
                    rounded-full
                    bg-[#5968F2]
                    px-6
                    py-3.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-[#3542A5]/30
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#6d7af5]
                    hover:shadow-xl
                  "
                >

                  <MessageCircle size={18} />

                  Hubungi UMKM

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </a>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">


        {/* ======================================================
            ABOUT
        ====================================================== */}

        {paragraphs.length > 0 && (
          <section className="border-b border-slate-200 py-20 lg:py-24">

            <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">

              {/* Heading */}
              <div>

                <div className="flex items-center gap-3">

                  <span className="h-px w-8 bg-[#5968F2]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#5968F2]">
                    Tentang Usaha
                  </p>

                </div>

                <h2
                  className="
                    mt-4
                    text-3xl
                    font-bold
                    tracking-tight
                    text-slate-900
                    sm:text-4xl
                  "
                >
                  Mengenal lebih dekat
                </h2>

              </div>


              {/* Description */}
              <div className="space-y-7">

                {paragraphs.map(
                  (paragraph, index) => (
                    <p
                      key={index}
                      className={
                        index === 0
                          ? `
                            text-lg
                            leading-8
                            text-slate-700
                            sm:text-xl
                            sm:leading-9
                          `
                          : `
                            text-base
                            leading-8
                            text-slate-500
                            sm:text-lg
                            sm:leading-9
                          `
                      }
                    >
                      {paragraph}
                    </p>
                  )
                )}

              </div>

            </div>

          </section>
        )}


        {/* ======================================================
            PRODUCTS
        ====================================================== */}

        {produk.length > 0 && (
          <section className="py-20 lg:py-24">

            {/* Header */}
            <div className="mb-12 flex items-end justify-between gap-6">

              <div>

                <div className="flex items-center gap-3">

                  <span className="h-px w-8 bg-[#5968F2]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#5968F2]">
                    Produk Unggulan
                  </p>

                </div>

                <h2
                  className="
                    mt-4
                    text-3xl
                    font-bold
                    tracking-tight
                    text-slate-900
                    sm:text-4xl
                  "
                >
                  Produk dari {nama}
                </h2>

              </div>


              <div
                className="
                  hidden
                  items-center
                  gap-2
                  rounded-full
                  bg-slate-100
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-slate-500
                  sm:flex
                "
              >
                <Package size={14} />

                {produk.length} produk
              </div>

            </div>


            {/* Product grid */}
            <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">

              {produk.map((item) => {

                const productName =
                  decodeHtml(item.nama || '')

                const productDescription =
                  decodeHtml(item.deskripsi || '')

                const productImage =
                  item.gambar
                    ? `${LARAVEL_URL}/storage/${item.gambar}`
                    : '/images/placeholder.jpg'

                const price =
                  formatRupiah(item.harga)

                return (
                  <article
                    key={item.id}
                    className="group"
                  >

                    {/* Image */}
                    <div
                      className="
                        relative
                        overflow-hidden
                        rounded-[28px]
                        bg-slate-100
                        shadow-sm
                        transition
                        duration-500
                        group-hover:-translate-y-1
                        group-hover:shadow-xl
                        group-hover:shadow-slate-900/10
                      "
                    >

                      <div className="aspect-[4/3]">

                        <img
                          src={productImage}
                          alt={productName}
                          className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-700
                            ease-out
                            group-hover:scale-105
                          "
                          onError={(e) => {
                            e.currentTarget.src =
                              '/images/placeholder.jpg'
                          }}
                        />

                      </div>

                      {/* Overlay */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/25
                          via-transparent
                          to-transparent
                          opacity-0
                          transition
                          duration-500
                          group-hover:opacity-100
                        "
                      />

                    </div>


                    {/* Product info */}
                    <div className="pt-5">

                      <div className="flex items-start justify-between gap-4">

                        <h3
                          className="
                            text-lg
                            font-bold
                            leading-tight
                            text-slate-900
                            transition-colors
                            duration-300
                            group-hover:text-[#3542A5]
                          "
                        >
                          {productName}
                        </h3>

                        <span
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-slate-200
                            text-slate-400
                            transition
                            duration-300
                            group-hover:border-[#3542A5]
                            group-hover:bg-[#3542A5]
                            group-hover:text-white
                          "
                        >
                          <ArrowRight size={13} />
                        </span>

                      </div>


                      {price && (
                        <p className="mt-3 text-sm font-bold text-[#3542A5]">
                          {price}
                        </p>
                      )}


                      {productDescription && (
                        <p
                          className="
                            mt-3
                            line-clamp-3
                            text-sm
                            leading-6
                            text-slate-500
                          "
                        >
                          {productDescription}
                        </p>
                      )}

                    </div>

                  </article>
                )
              })}

            </div>

          </section>
        )}


        {/* ======================================================
            CONTACT CTA
        ====================================================== */}

        {umkm.kontak && (
          <section className="pb-4">

            <div
              className="
                relative
                overflow-hidden
                rounded-[32px]
                bg-[#3542A5]
                px-7
                py-10
                text-white
                sm:px-10
                lg:px-14
                lg:py-12
              "
            >

              {/* Decorative circles */}
              <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

              <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#8d98ff]/20 blur-3xl" />


              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
                    Tertarik dengan produk ini?
                  </p>

                  <h2 className="mt-3 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">
                    Hubungi {nama} secara langsung.
                  </h2>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-white/60">
                    Tanyakan produk, harga, ketersediaan,
                    atau informasi lainnya langsung kepada
                    pelaku UMKM.
                  </p>

                </div>


                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-3
                    rounded-full
                    bg-white
                    px-6
                    py-3.5
                    text-sm
                    font-bold
                    text-[#3542A5]
                    shadow-xl
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-slate-50
                  "
                >

                  <MessageCircle size={18} />

                  Hubungi sekarang

                  <ArrowRight size={16} />

                </a>

              </div>

            </div>

          </section>
        )}


        {/* ======================================================
            BOTTOM NAVIGATION
        ====================================================== */}

        <div className="mt-12 border-t border-slate-200 pt-8">

          <Link
            to="/umkm"
            className="
              group
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-slate-600
              transition
              hover:text-[#5968F2]
            "
          >

            <ArrowLeft
              size={17}
              className="
                transition-transform
                duration-300
                group-hover:-translate-x-1
              "
            />

            Lihat UMKM lainnya

          </Link>

        </div>

      </div>

    </main>
  )
}


// ============================================================
// LOADING STATE
// ============================================================

function LoadingState() {
  return (
    <main className="min-h-screen bg-white">

      <section className="bg-[#0b1020]">

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

          <div className="h-5 w-32 animate-pulse rounded-full bg-white/10" />

          <div className="mt-14 grid gap-12 lg:grid-cols-2">

            <div className="aspect-[4/3] animate-pulse rounded-[32px] bg-white/10" />

            <div className="space-y-6 pt-8">

              <div className="h-3 w-32 animate-pulse rounded-full bg-white/10" />

              <div className="h-14 w-4/5 animate-pulse rounded-xl bg-white/10" />

              <div className="h-5 w-48 animate-pulse rounded-full bg-white/10" />

              <div className="h-5 w-64 animate-pulse rounded-full bg-white/10" />

              <div className="h-12 w-40 animate-pulse rounded-full bg-white/10" />

            </div>

          </div>

        </div>

      </section>


      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">

          <div className="space-y-4">

            <div className="h-3 w-28 animate-pulse rounded-full bg-slate-100" />

            <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-100" />

          </div>

          <div className="space-y-5">

            <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-slate-100" />

          </div>

        </div>

      </div>

    </main>
  )
}


// ============================================================
// ERROR STATE
// ============================================================

function ErrorState() {
  return (
    <main className="min-h-screen bg-white">

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">

        <div className="max-w-md text-center">

          <div
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-[24px]
              bg-slate-100
            "
          >
            <Store
              size={30}
              className="text-slate-400"
            />
          </div>


          <h1 className="mt-7 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            UMKM tidak ditemukan
          </h1>


          <p className="mt-3 text-sm leading-6 text-slate-500">
            Data UMKM yang kamu cari tidak tersedia
            atau mungkin sudah tidak aktif.
          </p>


          <Link
            to="/umkm"
            className="
              mt-8
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#3542A5]
              px-6
              py-3.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-[#3542A5]/20
              transition
              hover:bg-[#5968F2]
            "
          >

            <ArrowLeft size={17} />

            Kembali ke UMKM

          </Link>

        </div>

      </div>

    </main>
  )
}