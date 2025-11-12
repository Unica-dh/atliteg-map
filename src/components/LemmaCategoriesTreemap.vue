<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 sm:p-6 border border-slate-200 dark:border-slate-800">
    <h2 class="text-lg font-semibold text-scholarly-blue dark:text-slate-200 mb-4">Lemma Categories by Frequency</h2>
    <!-- Treemap Visualization Placeholder -->
    <div class="w-full aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 flex flex-wrap gap-1 content-start">
      <div class="flex items-center justify-center w-[65%] h-[59%] bg-[#4e79a7] text-white text-sm font-semibold p-2 rounded">Noun</div>
      <div class="flex items-center justify-center w-[34%] h-[39%] bg-[#f28e2b] text-white text-sm font-semibold p-2 rounded">Adjective</div>
      <div class="flex items-center justify-center w-[34%] h-[19%] bg-[#e15759] text-white text-sm font-semibold p-2 rounded">Verb</div>
      <div class="flex items-center justify-center w-[39%] h-[40%] bg-[#76b7b2] text-white text-sm font-semibold p-2 rounded">Adverb</div>
      <div class="flex items-center justify-center w-[25%] h-[40%] bg-[#59a14f] text-white text-sm font-semibold p-2 rounded">Pronoun</div>
      <div class="flex items-center justify-center w-[34%] h-[19%] bg-[#edc948] text-white text-sm font-semibold p-2 rounded">Other</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LemmaCategoriesTreemap',
}
</script>
