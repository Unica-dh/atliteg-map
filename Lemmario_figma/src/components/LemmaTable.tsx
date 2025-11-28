import { useState } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { Lemma } from '../data/mockData';

interface LemmaTableProps {
  lemmas: Lemma[];
}

const ITEMS_PER_PAGE = 10;

export function LemmaTable({ lemmas }: LemmaTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(lemmas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLemmas = lemmas.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-gray-900">Lemma Details</h2>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>LEMMA</TableHead>
              <TableHead>FORMA</TableHead>
              <TableHead>LOCATION</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>TIME PERIOD</TableHead>
              <TableHead>FREQUENCY</TableHead>
              <TableHead>SOURCE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentLemmas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No lemmas found
                </TableCell>
              </TableRow>
            ) : (
              currentLemmas.map((lemma) => (
                <TableRow key={lemma.IdLemma}>
                  <TableCell>{lemma.Lemma}</TableCell>
                  <TableCell className="text-gray-600">{lemma.Forma}</TableCell>
                  <TableCell className="text-gray-600">
                    {lemma.CollGeografica}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {lemma.Categoria}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {lemma.Datazione}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {lemma.Frequenza.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <a
                      href={lemma.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      Link
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing <span>{startIndex + 1}-{Math.min(endIndex, lemmas.length)}</span> of{' '}
          <span>{lemmas.length}</span>
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className="w-8"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
