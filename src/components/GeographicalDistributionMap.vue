<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 sm:p-6 border border-slate-200 dark:border-slate-800">
    <h2 class="text-lg font-semibold text-scholarly-blue dark:text-slate-200 mb-4">Geographical Distribution of Lemmas</h2>
    <!-- SearchBar -->
    <div class="mb-4">
      <label class="flex flex-col min-w-40 h-12 w-full">
        <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
          <div class="text-slate-400 dark:text-slate-500 flex border-none bg-slate-100 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
            <span class="material-symbols-outlined">search</span>
          </div>
          <input v-model="searchQuery" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-slate-100 dark:bg-slate-800 focus:border-none h-full placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search Lemmas..." />
        </div>
      </label>
    </div>
    <!-- Map -->
    <div class="w-full bg-center bg-no-repeat aspect-[16/10] bg-cover rounded-lg object-cover" data-alt="A world map with light blue oceans and light grey continents, showing data points over Europe." data-location="Europe" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBeiqqUWxlXzhLUSTrjvUHLtI0pcN5v4YI4DfXVqnAaSey3QSNM6QzgbBperY-j4tHeNxn65k6a-rl0mdyiBvbZRk5RKg1h8d40xw8jnlc3EY9khaMUlUVKkHk2Btv3PUjAsygcz8fb49gebH7hqogX20_ZtUcRZu8qBFnPRqtSoxQamKILPkyI6geHghxMep1u5ENq4Vi40hstK1Gyht5rrSHhakb2S1yJBizMlwCIjsFdNJ-HCXZz3-f4Wzc7FjtoJQQLg4QJGCQ");'></div>
  </div>
</template>

<script>
export default {
  name: 'GeographicalDistributionMap',
  data() {
    return {
      searchQuery: '',
    };
  },
}
</script>
