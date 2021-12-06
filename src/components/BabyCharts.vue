<script setup>
import WeightChart from "./WeightChart.vue";

const props = defineProps({baby:Object})
</script>

<template>
  <div class="border border-indigo-100 rounded-2xl shadow-md p-3 relative">
    <WeightChart :baby="baby" />
  </div>
</template>

<script>

export default {
  name: "BabyCharts",

}
</script>

<style scoped>

</style>
