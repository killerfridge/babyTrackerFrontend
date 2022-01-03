<script setup>
import WeightChart from "./WeightChart.vue";
import TempChart from "./TempChart.vue";
import SleepChart from "./SleepChart.vue";
import FeedChart from "./FeedChart.vue";

const props = defineProps({baby:Object})
</script>

<template>
    <div class="block md:flex">
      <WeightChart :baby="baby" class="block w-full md:w-1/2 h-80 md:flex"/>
      <TempChart :baby="baby"  class="block w-full md:w-1/2 h-80 md:flex"/>
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
