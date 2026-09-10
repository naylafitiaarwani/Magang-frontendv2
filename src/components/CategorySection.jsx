import {
    Map,
    Utensils,
    Landmark,
    BookOpen,
    Store,
  } from 'lucide-react'
  
  const categories = [
    {
      title: 'Wisata',
      icon: Map,
    },
    {
      title: 'Kuliner',
      icon: Utensils,
    },
    {
      title: 'Budaya',
      icon: Landmark,
    },
    {
      title: 'Sejarah',
      icon: BookOpen,
    },
    {
      title: 'UMKM',
      icon: Store,
    },
  ]
  
  export default function CategorySection() {
    return (
      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-[1380px] px-6 sm:px-8 lg:px-10">
  
          {/* CATEGORY NAVIGATION */}
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-2">
  
              {categories.map((category) => {
                const Icon = category.icon
  
                return (
                  <a
                    key={category.title}
                    href={`/${category.title.toLowerCase()}`}
                    className="
                      group
                      relative
                      inline-flex
                      items-center
                      gap-2.5
                      rounded-full
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      text-gray-600
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#3542A5]
                      hover:bg-[#3542A5]
                      hover:text-white
                      hover:shadow-lg
                      hover:shadow-[#3542A5]/20
                    "
                  >
  
                    {/* ICON */}
                    <span
                      className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-[#3542A5]/10
                        transition-all
                        duration-300
                        group-hover:bg-white/15
                      "
                    >
                      <Icon
                        size={14}
                        strokeWidth={1.8}
                        className="
                          text-[#3542A5]
                          transition-all
                          duration-300
                          group-hover:scale-110
                          group-hover:text-white
                        "
                      />
                    </span>
  
                    {/* TITLE */}
                    <span>
                      {category.title}
                    </span>
  
                    {/* HOVER DOT */}
                    <span
                      className="
                        h-1
                        w-1
                        scale-0
                        rounded-full
                        bg-white
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:scale-100
                        group-hover:opacity-100
                      "
                    />
  
                  </a>
                )
              })}
  
            </div>
          </div>
  
        </div>
      </section>
    )
  }