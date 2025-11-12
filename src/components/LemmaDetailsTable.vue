<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 sm:p-6 border border-slate-200 dark:border-slate-800 overflow-x-auto">
    <h2 class="text-lg font-semibold text-scholarly-blue dark:text-slate-200 mb-4">Lemma Details</h2>
    <div class="min-w-full">
      <table class="w-full text-sm text-left text-slate-600 dark:text-slate-400">
        <thead class="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800">
          <tr>
            <th scope="col" class="px-6 py-3 rounded-l-lg">Lemma</th>
            <th scope="col" class="px-6 py-3">Definition</th>
            <th scope="col" class="px-6 py-3">Category</th>
            <th scope="col" class="px-6 py-3">Time Period</th>
            <th scope="col" class="px-6 py-3">Frequency</th>
            <th scope="col" class="px-6 py-3 rounded-r-lg">Source</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lemma in paginatedData" :key="lemma.lemma" class="bg-white dark:bg-slate-900 border-b dark:border-slate-800">
            <th scope="row" class="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{{ lemma.lemma }}</th>
            <td class="px-6 py-4">{{ lemma.definition }}</td>
            <td class="px-6 py-4">{{ lemma.category }}</td>
            <td class="px-6 py-4">{{ lemma.timePeriod }}</td>
            <td class="px-6 py-4">{{ lemma.frequency }}</td>
            <td class="px-6 py-4"><a href="#" class="font-medium text-primary hover:underline">Link</a></td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <nav class="flex items-center justify-between pt-4" aria-label="Table navigation">
      <span class="text-sm font-normal text-slate-500 dark:text-slate-400">Showing <span class="font-semibold text-slate-900 dark:text-white">{{ (currentPage - 1) * 10 + 1 }}-{{ Math.min(currentPage * 10, totalItems) }}</span> of <span class="font-semibold text-slate-900 dark:text-white">{{ totalItems }}</span></span>
      <ul class="inline-flex items-center -space-x-px">
        <li>
          <a @click.prevent="prevPage" href="#" class="block px-3 py-2 ml-0 leading-tight text-slate-500 bg-white border border-slate-300 rounded-l-lg hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white">
            <span class="sr-only">Previous</span>
            <span class="material-symbols-outlined text-xl">chevron_left</span>
          </a>
        </li>
        <li v-for="page in totalPages" :key="page">
          <a @click.prevent="goToPage(page)" href="#" class="px-3 py-2 leading-tight" :class="{'text-primary bg-slate-100 dark:bg-slate-700': currentPage === page, 'text-slate-500 bg-white border border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white': currentPage !== page}">{{ page }}</a>
        </li>
        <li>
          <a @click.prevent="nextPage" href="#" class="block px-3 py-2 leading-tight text-slate-500 bg-white border border-slate-300 rounded-r-lg hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white">
            <span class="sr-only">Next</span>
            <span class="material-symbols-outlined text-xl">chevron_right</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'LemmaDetailsTable',
  data() {
    return {
      lemmas: [
        { lemma: 'bellum', definition: 'war', category: 'Noun', timePeriod: 'c. 950', frequency: '2,842' },
        { lemma: 'magnus', definition: 'great, large', category: 'Adjective', timePeriod: 'c. 890', frequency: '1,987' },
        { lemma: 'facio', definition: 'to make, to do', category: 'Verb', timePeriod: 'c. 1100', frequency: '1,530' },
        { lemma: 'bene', definition: 'well', category: 'Adverb', timePeriod: 'c. 1050', frequency: '1,211' },
        { lemma: 'rex', definition: 'king', category: 'Noun', timePeriod: 'c. 900', frequency: '1,115' },
        { lemma: 'deus', definition: 'god', category: 'Noun', timePeriod: 'c. 850', frequency: '1,012' },
        { lemma: 'amor', definition: 'love', category: 'Noun', timePeriod: 'c. 1200', frequency: '987' },
        { lemma: 'fortis', definition: 'strong, brave', category: 'Adjective', timePeriod: 'c. 1000', frequency: '876' },
        { lemma: 'dico', definition: 'to say, to tell', category: 'Verb', timePeriod: 'c. 975', frequency: '765' },
        { lemma: 'semper', definition: 'always', category: 'Adverb', timePeriod: 'c. 1150', frequency: '654' },
        { lemma: 'homo', definition: 'man, person', category: 'Noun', timePeriod: 'c. 800', frequency: '543' },
      ],
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.lemmas.slice(start, end);
    },
    totalItems() {
      return this.lemmas.length;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
  },
}
</script>
