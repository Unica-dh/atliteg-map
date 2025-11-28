import { FileText, MapPin, Calendar, Tag, Hash, ExternalLink } from 'lucide-react';
import type { Lemma } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { parseCategories } from '../utils/categoryParser';
import { EmptyState } from './EmptyState';

interface LemmaDetailProps {
  lemma: Lemma | null;
  allLemmas: Lemma[];
}

export function LemmaDetail({ lemma, allLemmas }: LemmaDetailProps) {
  if (!lemma) {
    return (
      <div className="space-y-4">
        <h2 className="text-gray-900 text-lg font-semibold">Dettaglio Lemma</h2>
        <EmptyState
          icon="file-text"
          title="Nessun lemma selezionato"
          message="Seleziona un punto sulla mappa, un lemma dall'indice alfabetico o dalla timeline per visualizzare i dettagli"
        />
      </div>
    );
  }

  // Trova tutte le forme associate a questo lemma
  const associatedForms = allLemmas.filter(l => 
    l.Lemma.toLowerCase() === lemma.Lemma.toLowerCase()
  );
  const uniqueForms = Array.from(new Set(associatedForms.map(l => l.Forma)));
  const uniqueLocations = Array.from(new Set(associatedForms.map(l => l.CollGeografica)));
  
  // Parse categorie multiple
  const categories = parseCategories(lemma.Categoria);

  return (
    <div className="space-y-4" role="region" aria-label="Dettagli lemma selezionato">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900 text-lg font-semibold">Dettaglio Lemma</h2>
        <Badge variant="outline">
          {associatedForms.length} attestazion{associatedForms.length === 1 ? 'e' : 'i'}
        </Badge>
      </div>
      
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {/* Lemma e Forme */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <div className="mb-3">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Lemma</span>
                  <p className="text-xl font-semibold text-gray-900 mt-1">{lemma.Lemma}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    Form{uniqueForms.length === 1 ? 'a' : 'e'} ({uniqueForms.length})
                  </span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {uniqueForms.map((forma, index) => (
                      <Badge key={index} variant="secondary">
                        {forma}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informazioni geografiche */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Distribuzione Geografica</span>
              <div className="mt-2 space-y-1">
                {uniqueLocations.map((location, index) => (
                  <div key={index} className="text-sm text-gray-900">
                    • {location}
                  </div>
                ))}
              </div>
              {uniqueLocations.length > 1 && (
                <p className="text-xs text-gray-500 mt-2">
                  {uniqueLocations.length} localit{uniqueLocations.length === 1 ? 'à' : 'à'}
                </p>
              )}
            </div>
          </div>

          {/* Informazioni temporali */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Datazione</span>
              <p className="text-lg font-medium text-gray-900 mt-1">{lemma.Anno}</p>
              <p className="text-sm text-gray-600 mt-1">{lemma.Periodo}</p>
            </div>
          </div>

          {/* Categorie */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Tag className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                Categori{categories.length === 1 ? 'a' : 'e'} ({categories.length})
              </span>
              <div className="flex flex-wrap gap-1 mt-2">
                {categories.map((cat, index) => (
                  <Badge key={index} variant="outline">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Frequenza */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Hash className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Frequenza</span>
              <p className="text-lg font-medium text-gray-900 mt-1">{lemma.Frequenza}</p>
            </div>
          </div>

          {/* Tutte le attestazioni */}
          {associatedForms.length > 1 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Tutte le attestazioni ({associatedForms.length})
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {associatedForms
                  .sort((a, b) => a.Anno - b.Anno)
                  .map((attestation, index) => (
                    <div 
                      key={`${attestation.IdLemma}-${index}`}
                      className="text-xs bg-white p-2 rounded border"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-blue-600">{attestation.Forma}</span>
                        <span className="text-gray-500">{attestation.Anno}</span>
                      </div>
                      <div className="text-gray-600">{attestation.CollGeografica}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Link esterno */}
          {lemma.URL && (
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => window.open(lemma.URL, '_blank', 'noopener,noreferrer')}
              aria-label={`Apri dettagli completi di ${lemma.Lemma} in una nuova finestra`}
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              <span>Visualizza dettagli completi</span>
            </Button>
          )}

          {/* ID Lemma */}
          <div className="text-xs text-gray-400 text-center pt-2 border-t">
            ID Lemma: {lemma.IdLemma}
            {lemma.IdAmbito && ` • ID Ambito: ${lemma.IdAmbito}`}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}