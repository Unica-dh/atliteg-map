<template>
  <div class="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 flex flex-col min-h-screen">
    <TopNavBar />
    <main class="flex-grow p-4 md:p-6 lg:p-8">
      <div class="max-w-screen-2xl mx-auto">
        <GlobalFilterBar />
        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <!-- Left Column: Map and Search -->
          <div class="lg:col-span-3 flex flex-col gap-6">
            <GeographicalDistributionMap />
          </div>
          <!-- Right Column: Treemap -->
          <div class="lg:col-span-2 flex flex-col gap-6">
            <LemmaCategoriesTreemap />
          </div>
          <!-- Bottom Row: Data Table -->
          <div class="lg:col-span-5">
            <LemmaDetailsTable />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import TopNavBar from './TopNavBar.vue'
import GlobalFilterBar from './GlobalFilterBar.vue'
import GeographicalDistributionMap from './GeographicalDistributionMap.vue'
import LemmaCategoriesTreemap from './LemmaCategoriesTreemap.vue'
import LemmaDetailsTable from './LemmaDetailsTable.vue'

export default {
  name: 'Dashboard',
  components: {
    TopNavBar,
    GlobalFilterBar,
    GeographicalDistributionMap,
    LemmaCategoriesTreemap,
    LemmaDetailsTable,
  },
}
</script>

<style scoped>
</style>
