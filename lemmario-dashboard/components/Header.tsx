'use client';

export function Header() {
  return (
    <header
      className="relative shadow-sm overflow-hidden"
      style={{
        height: '70px',
        background: '#0B5FA5'
      }}
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: 'url(/immagine-testata.jpg)',
          backgroundPosition: 'center center',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-container mx-auto px-lg h-full flex items-center">
        <div className="flex items-center gap-3 w-full">
          {/* Logo placeholder - smaller */}
          <div
            className="flex-shrink-0 bg-white rounded-md p-1.5 w-12 h-12 flex items-center justify-center shadow-md"
            role="img"
            aria-label="AtLiTeG logo"
          >
            <span className="text-primary font-bold text-sm leading-tight">AtLi<br/>TeG</span>
          </div>

          {/* Title and description */}
          <div className="flex-1 min-w-0">
            <h1 className="text-text-inverse text-base md:text-lg font-semibold mb-0.5 leading-tight">
              Atlante della lingua e dei testi della cultura gastronomica italiana dall'età medievale all'Unità
            </h1>
            <p className="text-text-inverse/90 text-[10px] leading-tight line-clamp-1">
              PRIN 2017X8CZTM - PI prof.essoressa Giovanna Frosini, Università per Stranieri di Siena
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
