import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react'
import api from '../lib/api'

const LARAVEL_URL = 'http://127.0.0.1:8000'

export default function RecommendationSection() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getEvents() {
      try {
        const response = await api.get('/event')
        setEvents(response.data.data || [])
      } catch (error) {
        console.error('Gagal mengambil data event:', error)
      } finally {
        setLoading(false)
      }
    }

    getEvents()
  }, [])

  function getImage(event) {
    if (!event?.gambar) {
      return '/images/placeholder.jpg'
    }

    return `${LARAVEL_URL}/storage/${event.gambar}`
  }

  function formatDate(date) {
    if (!date) return '-'

    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  function getDateRange(event) {
    if (!event.tanggal_selesai) {
      return formatDate(event.tanggal_mulai)
    }

    return `${formatDate(event.tanggal_mulai)} - ${formatDate(
      event.tanggal_selesai
    )}`
  }

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[#5968F2]" />

              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#3542A5]">
                Agenda Indramayu
              </span>
            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
              Event & Agenda
              <br />
              <span className="text-[#3542A5]">
                di Indramayu
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-[15px]">
              Temukan berbagai event dan kegiatan menarik yang
              berlangsung di Indramayu.
            </p>
          </div>

          <Link
            to="/event"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#3542A5]"
          >
            Lihat semua event

            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="h-[500px] animate-pulse rounded-[28px] bg-gray-100" />

            <div className="grid gap-6">
              <div className="h-[237px] animate-pulse rounded-[28px] bg-gray-100" />
              <div className="h-[237px] animate-pulse rounded-[28px] bg-gray-100" />
            </div>
          </div>
        )}

        {/* EMPTY */}
        {!loading && events.length === 0 && (
          <div className="rounded-3xl border border-gray-100 bg-gray-50 px-6 py-16 text-center">
            <CalendarDays
              size={36}
              className="mx-auto mb-4 text-[#3542A5]"
            />

            <h3 className="text-lg font-bold text-gray-900">
              Belum ada event
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Event dan agenda terbaru akan ditampilkan di sini.
            </p>
          </div>
        )}

        {/* EVENTS */}
        {!loading && events.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">

            {/* EVENT UTAMA */}
            {events[0] && (
              <article className="group relative min-h-[500px] overflow-hidden rounded-[28px] bg-gray-900">

                <img
                  src={getImage(events[0])}
                  alt={events[0].nama}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                {/* CATEGORY */}
                {events[0].kategori && (
                  <span className="absolute left-6 top-6 rounded-full bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-[#3542A5] shadow-lg">
                    {events[0].kategori}
                  </span>
                )}

                {/* CONTENT */}
                <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">

                  <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/85">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} />
                      <span>{getDateRange(events[0])}</span>
                    </div>

                    {events[0].lokasi && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{events[0].lokasi}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
                    {events[0].nama}
                  </h3>

                  {events[0].deskripsi && (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 line-clamp-2">
                      {events[0].deskripsi}
                    </p>
                  )}

                  <Link
                    to={`/event/${events[0].slug}`}
                    className="group/link mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#3542A5] transition-all duration-300 hover:bg-[#3542A5] hover:text-white"
                  >
                    Lihat detail

                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover/link:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            )}

            {/* EVENT SAMPING */}
            <div className="grid gap-6">

              {events.slice(1, 3).map((event) => (
                <article
                  key={event.id}
                  className="group grid overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[180px_1fr] lg:grid-cols-1"
                >

                  {/* IMAGE */}
                  <div className="relative h-52 overflow-hidden sm:h-full lg:h-52">
                    <img
                      src={getImage(event)}
                      alt={event.nama}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {event.kategori && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#3542A5] shadow-sm">
                        {event.kategori}
                      </span>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-col justify-center p-6">

                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#3542A5]">
                      <CalendarDays size={14} />
                      <span>{getDateRange(event)}</span>
                    </div>

                    <h3 className="line-clamp-2 text-xl font-bold leading-snug text-gray-900">
                      {event.nama}
                    </h3>

                    {event.lokasi && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                        <MapPin
                          size={15}
                          className="shrink-0 text-[#5968F2]"
                        />

                        <span className="line-clamp-1">
                          {event.lokasi}
                        </span>
                      </div>
                    )}

                    <Link
                      to={`/event/${event.slug}`}
                      className="group/link mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#3542A5]"
                    >
                      Lihat detail

                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover/link:translate-x-1"
                      />
                    </Link>

                  </div>
                </article>
              ))}

            </div>
          </div>
        )}

      </div>
    </section>
  )
}