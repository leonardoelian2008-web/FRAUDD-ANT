import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface LinkItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  description: string;
  links: LinkItem[];
}

interface CardNavProps {
  logo: string;
  logoAlt: string;
  items: NavItem[];
  cta: { label: string; href: string; onClick?: () => void };
  stagger?: number;
  speed?: number;
  maxWidth?: number;
}

export default function CardNav({
  logo,
  logoAlt,
  items,
  cta,
  stagger = 100,
  speed = 450,
  maxWidth = 1152,
}: CardNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 pb-2">
      <div className="relative mx-auto" style={{ maxWidth }}>
        <nav className="relative z-20 flex items-center justify-between px-5 sm:px-7 py-3 rounded-full bg-white/90 backdrop-blur-xl border border-green-100 shadow-lg shadow-green-900/5">

          {/* MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-green-50 text-green-800 hover:bg-yellow-100 transition-all duration-300 active:scale-95"
          >
            <span className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
              {isOpen ? <X size={19} /> : <Menu size={19} />}
            </span>
            <span className="font-semibold text-sm">
              {isOpen ? 'Tutup' : 'Menu'}
            </span>
          </button>

          {/* LOGO CENTER */}
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 cursor-pointer group"
            onClick={closeMenu}
          >
            <img
              src={logo}
              alt={logoAlt}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            />

            <div className="hidden sm:block">
              <h2 className="font-extrabold text-lg tracking-tight text-green-950">
                FRAUD-ANT
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">
                Guardians of Digital Space
              </p>
            </div>
          </div>

          {/* CTA */}
          
{/* CTA */}
<a
  href={cta.href}
  onClick={(event) => {
    if (cta.onClick) {
      event.preventDefault();
      cta.onClick();
    }
    closeMenu();
  }}
  className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300 whitespace-nowrap"
  style={{
    backgroundColor: "#ffffff",
    color: "#166534",
    minWidth: "185px",
    minHeight: "46px",
    opacity: 1,
    visibility: "visible",
    position: "relative",
    zIndex: 30,
  }}
>
  <span
    style={{
      color: "#166534",
      display: "inline-block",
      fontWeight: 700,
      visibility: "visible",
      opacity: 1,
    }}
  >
    {cta.label}
  </span>

  <ArrowUpRight
    size={16}
    color="#166534"
    strokeWidth={2.5}
  />
</a>

        </nav>

        {/* ANIMATED CARD PANEL */}
        <div
          className={`absolute top-[calc(100%+10px)] left-0 right-0 z-10 overflow-hidden transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen
              ? 'max-h-[700px] opacity-100 translate-y-0 visible'
              : 'max-h-0 opacity-0 -translate-y-5 invisible'
          }`}
          style={{ transitionDuration: `${speed}ms` }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-3xl border border-green-100 bg-white/95 backdrop-blur-xl p-6 shadow-xl shadow-green-950/10 transition-all ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-yellow-300 hover:shadow-2xl ${
                  isOpen
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{
                  transitionDuration: `${speed}ms`,
                  transitionDelay: `${isOpen ? idx * stagger : 0}ms`,
                }}
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-yellow-100/70 blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">
                      FRAUD-ANT / 0{idx + 1}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-green-800">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-green-950 mb-2">
                    {item.label}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-5">
                    {item.description}
                  </p>

                  <div className="border-t border-green-100 pt-4 space-y-2">
                    {item.links.map((link, linkIdx) => (
                      <a
                        key={linkIdx}
                        href={link.href}
                        onClick={closeMenu}
                        className="group flex items-center justify-between py-2 text-sm font-semibold text-slate-600 hover:text-green-700 transition-colors duration-200"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight
                          size={15}
                          className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isOpen && (
          <button
            aria-label="Tutup menu"
            onClick={closeMenu}
            className="fixed inset-0 top-0 z-[-1] cursor-default"
          />
        )}
      </div>
    </header>
  );
}