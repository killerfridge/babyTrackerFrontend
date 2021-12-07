<script setup>
import WeightChart from "./WeightChart.vue";
import TempChart from "./TempChart.vue";
import SleepChart from "./SleepChart.vue";

const props = defineProps({baby:Object})
</script>

<template>
    <div class="flex">
      <WeightChart :baby="baby" />
      <TempChart :baby="baby" />
    </div>
    <div class="flex">
      <SleepChart :baby="baby" />
    </div>

</template>

<script>

export default {
  name: "BabyCharts",

}
</script>

<style scoped>

</style>
