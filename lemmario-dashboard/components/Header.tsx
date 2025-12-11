'use client';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-[#4C6EF5] to-[#5B7EFF] shadow-lg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-normal">
            AtLiTeG
          </h1>
          <p className="text-xl md:text-2xl text-white font-normal mb-2">
            Atlante della Lingua e dei Testi della Cultura Gastronomica
          </p>
          <p className="text-base md:text-lg text-white/90 mt-1">
            Navigazione interattiva del lemmario gastronomico italiano
          </p>
        </div>
      </div>
    </header>
  );
}
