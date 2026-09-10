import {
  ArrowRight,
  Map,
  Utensils,
  Landmark,
  BookOpen,
  Store,
} from 'lucide-react'

const LARAVEL_URL = 'http://127.0.0.1:8000'

const features = [
  {
    title: 'Wisata',
    description: 'Destinasi menarik untuk dijelajahi.',
    icon: Map,
    link: '/wisata',
  },
  {
    title: 'Kuliner',
    description: 'Ragam cita rasa khas Indramayu.',
    icon: Utensils,
    link: '/kuliner',
  },
  {
    title: 'Budaya',
    description: 'Tradisi dan kesenian lokal.',
    icon: Landmark,
    link: '/budaya',
  },
  {
    title: 'Sejarah',
    description: 'Cerita di balik Indramayu.',
    icon: BookOpen,
    link: '/sejarah',
  },
  {
    title: 'UMKM',
    description: 'Produk unggulan masyarakat lokal.',
    icon: Store,
    link: '/umkm',
  },
]

export default function AboutSection() {
  return (
    <section
      id="tentang"
      className="bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">

        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">

          {/* =========================
              LEFT - ILLUSTRATION
          ========================== */}
          <div className="flex justify-center">

            <div className="relative">

              {/* DECORATION */}
              <div
                className="
                  absolute
                  -left-6
                  -top-6
                  h-24
                  w-24
                  rounded-full
                  bg-[#3542A5]/5
                "
              />

              <img
                src={`${LARAVEL_URL}/images/home/J7N7LBGlcBOgBehRxQH5NYJ4yIkj1EBfvOzJfkrQ.png`}
                alt="Tentang Indramayu Eksplor"
                className="
                  relative
                  z-10
                  h-auto
                  w-full
                  max-w-[470px]
                "
              />

            </div>

          </div>

          {/* =========================
              RIGHT - CONTENT
          ========================== */}
          <div>

            {/* LABEL */}
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[#5968F2]" />

              <span
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-[#3542A5]
                "
              >
                Tentang Indramayu
              </span>
            </div>

            {/* TITLE */}
            <h2
              className="
                text-4xl
                font-bold
                leading-[1.08]
                tracking-tight
                text-gray-900
                sm:text-5xl
              "
            >
              Mengenal{' '}
              <span className="text-[#3542A5]">
                Indramayu
              </span>
              <br />
              Lebih Dekat
            </h2>

            {/* DESCRIPTION */}
            <div
              className="
                mt-6
                max-w-[590px]
                space-y-3
                text-sm
                leading-7
                text-gray-500
                sm:text-[15px]
              "
            >
              <p>
                Indramayu merupakan daerah di pesisir utara
                Jawa Barat yang memiliki beragam potensi
                wisata, budaya, kuliner, sejarah, dan UMKM
                lokal.
              </p>

              <p>
                Setiap sudutnya memiliki cerita dan kekayaan
                yang menjadi bagian dari identitas masyarakat
                Indramayu.
              </p>
            </div>

{/* FEATURES */}
<div className="mt-8 grid max-w-[600px] grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
  {features.map((feature) => {
    const Icon = feature.icon

    return (
      <a
        key={feature.title}
        href={feature.link}
        className="group flex items-start gap-3"
      >
        <div
          className="
            flex h-9 w-9 shrink-0 items-center justify-center
            rounded-full bg-[#3542A5]/10
            transition-all duration-300
            group-hover:bg-[#3542A5]
          "
        >
          <Icon
            size={16}
            strokeWidth={1.8}
            className="
              text-[#3542A5]
              transition-colors duration-300
              group-hover:text-white
            "
          />
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-900">
            {feature.title}
          </h3>

          <p className="mt-1 text-[10px] leading-4 text-gray-400">
            {feature.description}
          </p>
        </div>
      </a>
    )
  })}
</div>

            {/* BUTTON */}
            <a
              href="/sejarah"
              className="
                group
                mt-8
                inline-flex
                items-center
                gap-2.5
                rounded-full
                bg-[#3542A5]
                px-6
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-[#3542A5]/20
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#2d388f]
                hover:shadow-xl
              "
            >
              <span>Kenali Lebih Lanjut</span>

              <ArrowRight
                size={16}
                strokeWidth={2}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </a>

          </div>

        </div>
      </div>
    </section>
  )
}