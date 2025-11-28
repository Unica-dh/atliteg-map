import { FileText, MapPin, Calendar, Tag, Hash, ExternalLink } from 'lucide-react';
import { Lemma } from '../data/mockData';
import { Button } from './ui/button';

interface LemmaDetailProps {
  lemma: Lemma | null;
  allLemmas: Lemma[];
}

export function LemmaDetail({ lemma, allLemmas }: LemmaDetailProps) {
  if (!lemma) {
    return (
      <div className="space-y-4">
        <h2 className="text-gray-900">Dettaglio Lemma</h2>
        <div className="flex items-center justify-center h-[400px] text-gray-400">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Seleziona un punto sulla mappa</p>
            <p className="text-sm">per visualizzare i dettagli del lemma</p>
          </div>
        </div>
      </div>
    );
  }

  // Trova tutte le forme associate a questo lemma
  const associatedForms = allLemmas.filter(l => l.Lemma.toLowerCase() === lemma.Lemma.toLowerCase());
  const uniqueForms = Array.from(new Set(associatedForms.map(l => l.Forma)));

  return (
    <div className="space-y-4">
      <h2 className="text-gray-900">Dettaglio Lemma</h2>
      
      <div className="space-y-4">
        {/* Lemma e Forma */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <div className="mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Lemma</span>
                <p className="text-xl text-gray-900 mt-1">{lemma.Lemma}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Forma</span>
                <p className="text-gray-700">{uniqueForms.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informazioni geografiche e temporali */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Collezione Geografica</span>
              <p className="text-gray-900">{lemma.CollGeografica}</p>
              <p className="text-xs text-gray-500 mt-1">{lemma.TipoCollGeografica}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Datazione</span>
              <p className="text-gray-900">{lemma.Anno}</p>
              <p className="text-sm text-gray-600 mt-1">Periodo: {lemma.Periodo}</p>
              <p className="text-xs text-gray-500 mt-1">{lemma.Datazione}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Tag className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Categoria</span>
              <p className="text-gray-900">{lemma.Categoria}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Hash className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Frequenza</span>
              <p className="text-gray-900">{lemma.Frequenza}</p>
            </div>
          </div>
        </div>

        {/* Link esterno */}
        {lemma.URL && (
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => window.open(lemma.URL, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Visualizza dettagli completi</span>
          </Button>
        )}

        {/* ID Lemma */}
        <div className="text-xs text-gray-400 text-center pt-2 border-t">
          ID Lemma: {lemma.IdLemma} • ID Periodo: {lemma.IDPeriodo}
        </div>
      </div>
    </div>
  );
}