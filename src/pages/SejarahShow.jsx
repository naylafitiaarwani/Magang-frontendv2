import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Compass,
  Heart,
  MapPin,
  Minus,
  Navigation,
  Plus,
  ShieldCheck,
  Star,
  Ticket,
  Users,
} from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const LARAVEL_URL = 'http://127.0.0.1:8000'
const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || ''

function decodeHtml(value = '') {
  const txt = document.createElement('textarea')
  txt.innerHTML = value
  return txt.value
}

function formatRupiah(value) {
  const number = Number(value || 0)

  if (number === 0) {
    return 'Gratis'
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number)
}

function getImageUrl(image) {
  if (!image) return ''

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  return `${LARAVEL_URL}/storage/${image.replace(/^\/?storage\//, '')}`
}

function getWhatsappNumber(data) {
  if (!data) return ''

  return (
    data.whatsapp ||
    data.no_whatsapp ||
    data.nomor_whatsapp ||
    data.telepon ||
    data.no_telepon ||
    ''
  )
}

function loadSnapScript() {
  return new Promise((resolve, reject) => {
    if (window.snap) {
      resolve()
      return
    }

    const existingScript = document.getElementById('midtrans-snap-script')

    if (existingScript) {
      existingScript.onload = resolve
      existingScript.onerror = reject
      return
    }

    const script = document.createElement('script')

    script.id = 'midtrans-snap-script'
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY)

    script.onload = resolve
    script.onerror = reject

    document.body.appendChild(script)
  })
}

export default function WisataShow() {
  const { slug } = useParams()
  const navigate = useNavigate()
  // FIX: AuthContext tidak menyediakan `token` langsung di value-nya.
  // Yang tersedia adalah getToken() dan authHeader(). Sebelumnya kode
  // memakai `const { user, token } = useAuth()` sehingga `token` selalu
  // undefined dan pengguna yang sudah login tetap dilempar ke /login.
  const { user, getToken, authHeader } = useAuth()

  const [wisata, setWisata] = useState(null)
  const [tiket, setTiket] = useState([])

  const [loading, setLoading] = useState(true)
  const [loadingTiket, setLoadingTiket] = useState(false)
  const [error, setError] = useState('')

  const [selectedTickets, setSelectedTickets] = useState({})
  const [pemesan, setPemesan] = useState({
    nama: '',
    email: '',
    no_hp: '',
  })

  const [processing, setProcessing] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [pesananSukses, setPesananSukses] = useState(null)

  const [activeGallery, setActiveGallery] = useState(0)

  useEffect(() => {
    const fetchWisata = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await axios.get(
          `${LARAVEL_URL}/api/wisata/${slug}`
        )

        const wisataData = response.data?.data || response.data

        setWisata(wisataData)

        if (wisataData?.is_tiket_aktif) {
          try {
            setLoadingTiket(true)

            const tiketResponse = await axios.get(
              `${LARAVEL_URL}/api/wisata/${slug}/tiket`
            )

            const tiketData =
              tiketResponse.data?.data || tiketResponse.data || []

            setTiket(Array.isArray(tiketData) ? tiketData : [])
          } catch (ticketError) {
            console.error('Gagal mengambil tiket:', ticketError)
            setTiket([])
          } finally {
            setLoadingTiket(false)
          }
        }
      } catch (err) {
        console.error(err)

        setError(
          err.response?.data?.message ||
            'Data wisata tidak dapat dimuat.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchWisata()
    }
  }, [slug])

  useEffect(() => {
    if (!user) return

    setPemesan((prev) => ({
      ...prev,
      nama:
        user.name ||
        user.nama ||
        user.username ||
        prev.nama,
      email: user.email || prev.email,
      no_hp:
        user.no_hp ||
        user.phone ||
        user.telepon ||
        prev.no_hp,
    }))
  }, [user])

  const imageUrl = useMemo(() => {
    if (!wisata) return ''

    return getImageUrl(
      wisata.gambar ||
        wisata.image ||
        wisata.foto ||
        wisata.thumbnail
    )
  }, [wisata])

  /*
   * ============================================================
   * DUMMY CONTENT
   * Bisa nanti diganti dengan data dari API.
   * ============================================================
   */

  const galleryDummy = useMemo(() => {
    if (!imageUrl) return []

    return [
      imageUrl,
      imageUrl,
      imageUrl,
      imageUrl,
    ]
  }, [imageUrl])

  const aktivitasDummy = [
    {
      icon: '📸',
      title: 'Berfoto',
      description:
        'Abadikan momen dengan berbagai spot menarik di sekitar destinasi.',
    },
    {
      icon: '🌿',
      title: 'Menikmati Suasana',
      description:
        'Nikmati suasana dan pemandangan khas destinasi bersama orang terdekat.',
    },
    {
      icon: '👨‍👩‍👧',
      title: 'Liburan Bersama',
      description:
        'Tempat yang cocok untuk menghabiskan waktu bersama keluarga dan teman.',
    },
  ]

  const fasilitasDummy = [
    'Area Parkir',
    'Toilet',
    'Mushola',
    'Gazebo',
    'Area Kuliner',
    'Spot Foto',
  ]

  const tipsDummy = [
    'Datang pada pagi atau sore hari untuk mendapatkan suasana yang lebih nyaman.',
    'Gunakan pakaian dan alas kaki yang nyaman selama berada di area wisata.',
    'Jaga kebersihan dan ikuti aturan yang berlaku di lokasi wisata.',
  ]

  const jumlahTiket = useMemo(() => {
    return Object.values(selectedTickets).reduce(
      (total, quantity) => total + quantity,
      0
    )
  }, [selectedTickets])

  const totalHarga = useMemo(() => {
    return tiket.reduce((total, item) => {
      const quantity = selectedTickets[item.id] || 0

      return total + quantity * Number(item.harga || 0)
    }, 0)
  }, [tiket, selectedTickets])

  const updateQuantity = (ticketId, amount, maxStock = null) => {
    setSelectedTickets((prev) => {
      const current = prev[ticketId] || 0
      let next = current + amount

      if (next < 0) next = 0

      if (maxStock !== null && maxStock !== undefined) {
        next = Math.min(next, Number(maxStock))
      }

      return {
        ...prev,
        [ticketId]: next,
      }
    })
  }

  const handleCheckout = async () => {
    setCheckoutError('')

    // FIX: ambil token lewat getToken() dari AuthContext, bukan
    // destructuring `token` yang tidak pernah ada di context value.
    const token = getToken()

    if (!user || !token) {
      navigate('/login', {
        state: {
          from: `/wisata/${slug}`,
        },
      })

      return
    }

    if (jumlahTiket === 0) {
      setCheckoutError('Pilih minimal satu tiket terlebih dahulu.')
      return
    }

    if (!pemesan.nama || !pemesan.email || !pemesan.no_hp) {
      setCheckoutError(
        'Lengkapi nama, email, dan nomor HP terlebih dahulu.'
      )
      return
    }

    try {
      setProcessing(true)

      const items = tiket
        .filter((item) => (selectedTickets[item.id] || 0) > 0)
        .map((item) => ({
          tiket_id: item.id,
          jumlah: selectedTickets[item.id],
        }))

      const response = await axios.post(
        `${LARAVEL_URL}/api/wisata/${slug}/pesanan-tiket`,
        {
          ...pemesan,
          items,
        },
        {
          headers: {
            // FIX: pakai authHeader() dari context supaya format
            // "Authorization: Bearer <token>" konsisten dengan
            // pemanggilan API lain di aplikasi.
            ...authHeader(),
            Accept: 'application/json',
          },
        }
      )

      const orderData = response.data?.data || response.data

      if (!orderData?.snap_token) {
        throw new Error('Snap token tidak ditemukan.')
      }

      await loadSnapScript()

      window.snap.pay(orderData.snap_token, {
        onSuccess: function (result) {
          setPesananSukses(result)
          setSelectedTickets({})
        },

        onPending: function (result) {
          setPesananSukses(result)
        },

        onError: function () {
          setCheckoutError(
            'Pembayaran gagal diproses. Silakan coba lagi.'
          )
        },

        onClose: function () {
          setProcessing(false)
        },
      })
    } catch (err) {
      console.error(err)

      setCheckoutError(
        err.response?.data?.message ||
          err.message ||
          'Pesanan tidak dapat diproses.'
      )
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-5 py-10">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-6 overflow-hidden rounded-[32px] bg-white shadow-sm">
            <div className="h-[420px] animate-pulse bg-slate-200" />

            <div className="space-y-4 p-8">
              <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />
              <div className="h-20 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (error || !wisata) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-20">
        <div className="mx-auto max-w-xl rounded-[28px] bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Compass size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Wisata tidak ditemukan
          </h1>

          <p className="mt-3 text-slate-500">
            {error || 'Data destinasi belum tersedia.'}
          </p>

          <Link
            to="/wisata"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#3542A5] px-6 py-3 font-semibold text-white transition hover:bg-[#5968F2]"
          >
            <ArrowLeft size={18} />
            Kembali ke wisata
          </Link>
        </div>
      </main>
    )
  }

  const nama =
    wisata.nama ||
    wisata.name ||
    'Destinasi Wisata'

  const kategori =
    wisata.kategori ||
    wisata.category ||
    'Destinasi Wisata'

  const lokasi =
    wisata.lokasi ||
    wisata.location ||
    'Indramayu'

  const deskripsi =
    decodeHtml(wisata.deskripsi || wisata.description || '').trim() ||
    'Belum ada deskripsi untuk destinasi wisata ini.'

  const rating = wisata.rating || 0
  const jumlahUlasan = wisata.jumlah_ulasan || wisata.review_count || 0

  const hargaMulai =
    wisata.harga_mulai ??
    wisata.harga ??
    wisata.price ??
    0

  const jamOperasional =
    wisata.jam_operasional ||
    wisata.jam_buka ||
    wisata.operational_hours ||
    'Jam operasional belum tersedia'

  const mapsQuery = encodeURIComponent(
    `${nama}, ${lokasi}, Indramayu`
  )

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#0b1020]">
        <div className="absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#5968F2]/20 blur-3xl" />
          <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#3542A5]/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-6">
          <Link
            to="/wisata"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Kembali ke wisata
          </Link>

          <div className="mt-7 grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-2xl">
              <div className="relative aspect-[16/9]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={nama}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-800 text-white/50">
                    <Compass size={60} />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute left-5 top-5">
                  <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[#3542A5] shadow-lg">
                    {kategori}
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-sm font-medium text-white/90">
                      <Star
                        size={16}
                        fill="currentColor"
                        className="text-yellow-400"
                      />
                      {rating || 'Baru'}
                      {jumlahUlasan > 0 && (
                        <span className="text-white/60">
                          ({jumlahUlasan} ulasan)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="hidden rounded-full bg-white/15 p-3 text-white backdrop-blur md:flex">
                    <Heart size={20} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pb-2 text-white">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#aeb8ff]">
                Explore Indramayu
              </p>

              <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
                {nama}
              </h1>

              <div className="mt-5 flex items-center gap-2 text-white/70">
                <MapPin size={19} className="text-[#aeb8ff]" />
                <span>{lokasi}</span>
              </div>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/65">
                Temukan pengalaman menarik dan nikmati suasana
                khas destinasi wisata di Indramayu.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#3542A5] transition hover:bg-slate-100"
                >
                  <Navigation size={17} />
                  Lihat lokasi
                </a>

                {wisata.is_tiket_aktif && tiket.length > 0 && (
                  <a
                    href="#tiket"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
                  >
                    <Ticket size={17} />
                    Pesan tiket
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK INFO
      ====================================================== */}
      <section className="relative z-10 mx-auto -mt-1 max-w-7xl px-5">
        <div className="grid overflow-hidden rounded-[26px] bg-white shadow-xl shadow-slate-200/50 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 border-b border-slate-100 p-6 sm:border-r lg:border-b-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#3542A5]">
              <MapPin size={21} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Lokasi
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-bold text-slate-800">
                {lokasi}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-slate-100 p-6 lg:border-b-0 lg:border-r">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <Clock3 size={21} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Jam buka
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {jamOperasional}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-slate-100 p-6 sm:border-r lg:border-b-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-500">
              <Star size={21} fill="currentColor" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Rating
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {rating || 'Belum ada rating'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <Ticket size={21} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Harga tiket
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {formatRupiah(hargaMulai)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5968F2]">
              Tentang destinasi
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
              Kenali tempatnya sebelum kamu berkunjung.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-500">
              Informasi singkat mengenai destinasi yang bisa
              membantu kamu merencanakan kunjungan.
            </p>
          </div>

          <div>
            <p className="text-base leading-8 text-slate-600">
              {deskripsi}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-[#3542A5]">
                    <Compass size={19} />
                  </div>

                  <span className="font-bold text-slate-800">
                    Pengalaman lokal
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Nikmati karakter dan suasana khas destinasi
                  wisata Indramayu.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-50 p-2.5 text-green-600">
                    <Users size={19} />
                  </div>

                  <span className="font-bold text-slate-800">
                    Cocok untuk bersama
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Bisa menjadi pilihan untuk menghabiskan waktu
                  bersama keluarga maupun teman.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          GALLERY
      ====================================================== */}
      {galleryDummy.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-20">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5968F2]">
                Gallery
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Lihat suasananya
              </h2>
            </div>

            <span className="hidden text-sm text-slate-400 sm:block">
              Preview destinasi
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.6fr_0.7fr]">
            <div className="relative overflow-hidden rounded-[28px] bg-slate-200">
              <div className="aspect-[16/10]">
                <img
                  src={galleryDummy[activeGallery]}
                  alt={`${nama} gallery`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                  {activeGallery + 1} / {galleryDummy.length}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveGallery(
                        activeGallery === 0
                          ? galleryDummy.length - 1
                          : activeGallery - 1
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
                  >
                    <ArrowLeft size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveGallery(
                        activeGallery === galleryDummy.length - 1
                          ? 0
                          : activeGallery + 1
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
                  >
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {galleryDummy.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveGallery(index)}
                  className={`group relative overflow-hidden rounded-[22px] ${
                    activeGallery === index
                      ? 'ring-4 ring-[#5968F2]'
                      : ''
                  }`}
                >
                  <div className="aspect-square">
                    <img
                      src={image}
                      alt={`${nama} ${index + 1}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/0" />
                </button>
              ))}
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            * Foto gallery sementara menggunakan gambar utama
            sampai data gallery tersedia dari API.
          </p>
        </section>
      )}

      {/* =====================================================
          LOKASI
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="overflow-hidden rounded-[32px] bg-[#0b1020]">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#aeb8ff]">
                Lokasi
              </p>

              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Siap menjelajahi {nama}?
              </h2>

              <p className="mt-5 leading-7 text-white/60">
                Temukan lokasi destinasi ini dan mulai
                rencanakan perjalananmu.
              </p>

              <div className="mt-7 flex items-start gap-3">
                <MapPin
                  size={21}
                  className="mt-1 shrink-0 text-[#aeb8ff]"
                />

                <div>
                  <p className="font-bold text-white">
                    {lokasi}
                  </p>

                  <p className="mt-1 text-sm text-white/50">
                    Indramayu, Jawa Barat
                  </p>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#3542A5] transition hover:bg-slate-100"
              >
                Buka Google Maps
                <ArrowRight size={17} />
              </a>

              <p className="mt-4 text-xs text-white/30">
                * Lokasi sementara menggunakan pencarian nama
                destinasi.
              </p>
            </div>

            <div className="relative min-h-[320px] overflow-hidden bg-gradient-to-br from-[#3542A5] to-[#5968F2]">
              <div className="absolute inset-0 opacity-20">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '28px 28px',
                  }}
                />
              </div>

              <div className="relative flex h-full items-center justify-center p-10">
                <div className="text-center text-white">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                    <Navigation size={35} />
                  </div>

                  <p className="mt-5 text-lg font-bold">
                    {nama}
                  </p>

                  <p className="mt-1 text-sm text-white/70">
                    {lokasi}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TICKET
      ====================================================== */}
      {wisata.is_tiket_aktif && (
        <section
          id="tiket"
          className="scroll-mt-10 border-t border-slate-200 bg-white py-20"
        >
          <div className="mx-auto max-w-7xl px-5">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5968F2]">
                Tiket masuk
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                Pesan tiket kunjungan
              </h2>

              <p className="mt-4 text-slate-500">
                Pilih jenis tiket dan jumlah yang kamu butuhkan.
              </p>
            </div>

            {loadingTiket ? (
              <div className="mt-10 grid gap-4 lg:grid-cols-2">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-32 animate-pulse rounded-2xl bg-slate-100"
                  />
                ))}
              </div>
            ) : tiket.length === 0 ? (
              <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <Ticket
                  size={35}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-4 font-bold text-slate-700">
                  Tiket belum tersedia
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Silakan cek kembali beberapa saat lagi.
                </p>
              </div>
            ) : (
              <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
                <div className="space-y-4">
                  {tiket.map((item) => {
                    const quantity =
                      selectedTickets[item.id] || 0

                    const maxStock =
                      item.stok ??
                      item.stock ??
                      null

                    return (
                      <div
                        key={item.id}
                        className="rounded-[24px] border border-slate-200 bg-white p-6 transition hover:border-[#cbd1ff] hover:shadow-lg hover:shadow-slate-200/50"
                      >
                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                          <div>
                            <h3 className="text-lg font-black text-slate-900">
                              {item.nama ||
                                item.nama_tiket ||
                                item.name ||
                                'Tiket'}
                            </h3>

                            {item.deskripsi && (
                              <p className="mt-2 text-sm leading-6 text-slate-500">
                                {decodeHtml(item.deskripsi)}
                              </p>
                            )}

                            <p className="mt-3 font-bold text-[#3542A5]">
                              {formatRupiah(item.harga)}
                            </p>

                            {maxStock !== null && (
                              <p className="mt-1 text-xs text-slate-400">
                                Stok: {maxStock}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 self-start rounded-full bg-slate-100 p-1.5 sm:self-center">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  -1,
                                  maxStock
                                )
                              }
                              disabled={quantity === 0}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:text-[#3542A5] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="w-7 text-center font-bold text-slate-800">
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  1,
                                  maxStock
                                )
                              }
                              disabled={
                                maxStock !== null &&
                                quantity >= Number(maxStock)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3542A5] text-white shadow-sm transition hover:bg-[#5968F2] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* CHECKOUT CARD */}
                <div className="lg:sticky lg:top-6 lg:self-start">
                  <div className="rounded-[28px] bg-[#0b1020] p-7 text-white shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                        <Ticket size={21} />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/50">
                          Pesanan
                        </p>

                        <p className="font-bold">
                          Ringkasan tiket
                        </p>
                      </div>
                    </div>

                    <div className="my-6 h-px bg-white/10" />

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">
                        Jumlah tiket
                      </span>

                      <span className="font-bold">
                        {jumlahTiket}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-white/50">
                        Total
                      </span>

                      <span className="text-xl font-black">
                        {formatRupiah(totalHarga)}
                      </span>
                    </div>

                    <div className="my-6 h-px bg-white/10" />

                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-white/60">
                          Nama pemesan
                        </label>

                        <input
                          type="text"
                          value={pemesan.nama}
                          onChange={(e) =>
                            setPemesan({
                              ...pemesan,
                              nama: e.target.value,
                            })
                          }
                          placeholder="Nama lengkap"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#5968F2]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold text-white/60">
                          Email
                        </label>

                        <input
                          type="email"
                          value={pemesan.email}
                          onChange={(e) =>
                            setPemesan({
                              ...pemesan,
                              email: e.target.value,
                            })
                          }
                          placeholder="nama@email.com"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#5968F2]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold text-white/60">
                          Nomor HP
                        </label>

                        <input
                          type="tel"
                          value={pemesan.no_hp}
                          onChange={(e) =>
                            setPemesan({
                              ...pemesan,
                              no_hp: e.target.value,
                            })
                          }
                          placeholder="08xxxxxxxxxx"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#5968F2]"
                        />
                      </div>
                    </div>

                    {checkoutError && (
                      <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-xs leading-5 text-red-200">
                        {checkoutError}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={processing}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#5968F2] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#6d7af7] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {processing
                        ? 'Memproses...'
                        : 'Lanjutkan pembayaran'}

                      {!processing && <ArrowRight size={17} />}
                    </button>

                    <p className="mt-4 text-center text-[11px] leading-5 text-white/35">
                      Pembayaran diproses secara aman melalui
                      Midtrans.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          SUCCESS
      ====================================================== */}
      {pesananSukses && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[30px] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <Check size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-900">
              Pesanan berhasil dibuat
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Silakan cek status pembayaran dan detail tiket
              pada halaman pesanan kamu.
            </p>

            <div className="mt-7 grid gap-3">
              <Link
                to="/pesanan-tiket"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3542A5] px-5 py-3 font-bold text-white transition hover:bg-[#5968F2]"
              >
                Lihat pesanan
                <ArrowRight size={17} />
              </Link>

              <button
                type="button"
                onClick={() => setPesananSukses(null)}
                className="rounded-full px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}


      {/* =====================================================
          MOBILE BOTTOM NAV
      ====================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl gap-3">
          <Link
            to="/wisata"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700"
          >
            <ArrowLeft size={17} />
            Kembali
          </Link>

          {wisata.is_tiket_aktif && tiket.length > 0 && (
            <a
              href="#tiket"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#3542A5] py-3 text-sm font-bold text-white"
            >
              <Ticket size={17} />
              Pesan tiket
            </a>
          )}
        </div>
      </div>
    </main>
  )
}