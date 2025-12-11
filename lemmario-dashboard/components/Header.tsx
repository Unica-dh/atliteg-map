'use client';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            AtLiTeG
          </h1>
          <p className="text-lg md:text-xl text-blue-100 font-medium">
            Atlante della Lingua e dei Testi della Cultura Gastronomica
          </p>
          <p className="text-sm text-blue-200 mt-2">
            Navigazione interattiva del lemmario gastronomico italiano
          </p>
        </div>
      </div>
    </header>
  );
}
