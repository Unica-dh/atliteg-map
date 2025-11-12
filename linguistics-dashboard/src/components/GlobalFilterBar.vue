<template>
  <!-- Global Filter Bar -->
  <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 mb-6 border border-slate-200 dark:border-slate-800">
    <div class="flex flex-wrap items-center gap-4">
      <div class="flex items-center gap-3 flex-wrap">
        <!-- Category Chip/Dropdown -->
        <button class="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-4 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <span class="material-symbols-outlined text-xl">
            sell
          </span>
          <p class="text-sm font-medium">{{ selectedCategory || 'Category' }}</p>
          <span class="material-symbols-outlined text-xl">
            expand_more
          </span>
        </button>
        <!-- Time Period Chip/Dropdown -->
        <button class="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-4 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <span class="material-symbols-outlined text-xl">
            calendar_today
          </span>
          <p class="text-sm font-medium">Time Period: {{ selectedTimePeriod || '800 - 1200' }}</p>
          <span class="material-symbols-outlined text-xl">
            expand_more
          </span>
        </button>
      </div>
      <div class="ml-auto">
        <!-- Reset Filters Button -->
        <button @click="resetFilters" class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 gap-2 text-sm font-bold tracking-[0.015em] transition-colors">
          <span class="material-symbols-outlined text-xl">
            restart_alt
          </span>
          <span class="truncate">Reset Filters</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalFilterBar',
  data() {
    return {
      selectedCategory: null,
      selectedTimePeriod: '800 - 1200',
    };
  },
  methods: {
    resetFilters() {
      this.selectedCategory = null;
      this.selectedTimePeriod = '800 - 1200';
    },
  },
}
</script>
