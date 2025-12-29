'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

interface MenuItem {
  label: string;
  items: {
    label: string;
    href: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Il progetto',
    items: [
      { label: 'Presentazione', href: 'https://www.atliteg.org/contenuti/presentazione/8235' },
      { label: 'Gruppo di lavoro', href: 'https://www.atliteg.org/gruppo-di-lavoro' },
      { label: 'Partner', href: 'https://www.atliteg.org/contenuti/partner/8236' },
      { label: 'Contatti', href: 'https://www.atliteg.org/contenuti/contatti/8238' },
    ],
  },
  {
    label: 'Corpus',
    items: [
      { label: 'Elenco opere', href: 'https://corpus.atliteg.org/elenco-opere' },
      { label: 'Ricerca nel corpus', href: 'https://corpus.atliteg.org/ricerca' },
      { label: 'Elenco ricette', href: 'https://corpus.atliteg.org/ricette' },
      { label: 'Elenco menù', href: 'https://corpus.atliteg.org/menu' },
    ],
  },
  {
    label: 'Vocabolario',
    items: [
      { label: 'Presentazione', href: 'https://www.atliteg.org/contenuti/vocabolario-presentazione/8391' },
      { label: 'Avvertenze per la consultazione', href: 'https://www.atliteg.org/contenuti/vocabolario-avvertenze/8392' },
      { label: 'Lemmario', href: 'https://vocabolario.atliteg.org/lemmario' },
      { label: 'Formario', href: 'https://vocabolario.atliteg.org/formario' },
      { label: 'Bibliografia e sitografia', href: 'https://www.atliteg.org/contenuti/presentazione/8393' },
    ],
  },
  {
    label: 'Atlante',
    items: [
      { label: 'Presentazione', href: 'https://www.atliteg.org/contenuti/atlante-presentazione/8394' },
    ],
  },
  {
    label: 'Attività e Pubblicazioni',
    items: [
      { label: 'Eventi', href: 'https://www.atliteg.org/eventi' },
      { label: 'News', href: 'https://www.atliteg.org/news-e-avvisi' },
      { label: 'Pubblicazioni', href: 'https://www.atliteg.org/pubblicazioni' },
      { label: 'AtLiTeG e la Crusca', href: 'https://www.atliteg.org/sezioni/atliteg-e-crusca/23' },
      { label: 'Iter Gastronomicum', href: 'https://www.atliteg.org/sezioni/iter-gastronomicum/1029' },
    ],
  },
  {
    label: 'Terza missione',
    items: [
      { label: 'AtLiTeG e Treccani', href: 'https://www.atliteg.org/contenuti/treccani/8395' },
      { label: 'AtLiTeG per la scuola', href: 'https://www.atliteg.org/sezioni/atliteg-per-la-scuola/22' },
      { label: 'AtLiTeG e Casa Artusi', href: 'https://www.atliteg.org/contenuti/casa-artusi/8397' },
      { label: 'AtLiTeG e La Cucina Italiana', href: 'https://www.atliteg.org/contenuti/cucina-italiana/8396' },
    ],
  },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<number | null>(null);

  return (
    <header
      className="relative shadow-md overflow-visible"
      style={{
        background: 'linear-gradient(135deg, #0B5FA5 0%, #0D4A8F 100%)'
      }}
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: 'url(/immagine-testata.jpg)',
          backgroundPosition: 'center center',
        }}
      />

      {/* Content - Single Row Layout */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-2 md:px-4 py-1">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <Image
              src="/AtLiTeG_logo.webp"
              alt="AtLiTeG Logo"
              width={50}
              height={55}
              priority
              className="w-10 h-auto md:w-[50px]"
            />
            <div className="hidden md:block">
              <h1 className="text-white text-[18px] font-bold leading-tight">
                AtLiTeG - Atlante gastronomico italiano
              </h1>
              <p className="text-white/90 text-xs leading-tight mt-0.5">
                PRIN 2017XRCZTM - Università per Stranieri di Siena
              </p>
            </div>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex flex-wrap gap-0.5 items-center justify-center">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="relative nav-dropdown"
                  onMouseEnter={() => setOpenDropdown(index)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className="text-white text-xs lg:text-[13px] font-medium uppercase px-2 lg:px-2.5 py-1 hover:bg-white/10 rounded-md transition-all flex items-center gap-0.5 whitespace-nowrap"
                    aria-expanded={openDropdown === index}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown size={13} className={`transition-transform ${openDropdown === index ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-full left-0 mt-0.5 bg-white rounded-md shadow-lg overflow-hidden transition-all duration-200 min-w-[250px] ${
                      openDropdown === index ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}
                    style={{ zIndex: 9999 }}
                  >
                    <ul className="py-2">
                      {item.items.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            href={subItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm"
                          >
                            {subItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-1.5 hover:bg-white/10 rounded-md transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[10001] overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-bold text-blue-900 leading-tight">
              Atlante della lingua e dei testi della cultura<br />gastronomica italiana dall'età medievale all'Unità
            </h2>
            <hr className="mt-4 border-gray-300" />
          </div>

          <nav>
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => setOpenMobileDropdown(openMobileDropdown === index ? null : index)}
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md font-medium text-gray-800 flex items-center justify-between transition-colors"
                  >
                    <span className="uppercase text-sm">{item.label}</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${openMobileDropdown === index ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Mobile Dropdown Items */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openMobileDropdown === index ? 'max-h-96 mt-2' : 'max-h-0'
                    }`}
                  >
                    <ul className="ml-4 space-y-1">
                      {item.items.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            href={subItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-[10000]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}
