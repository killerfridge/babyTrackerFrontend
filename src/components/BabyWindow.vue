<script setup>
import Feed from "./Feed.vue";
import Sleep from "./Sleep.vue";
import Temperature from "./Temperature.vue";
import useState from "../state";
import Weight from "./Weight.vue";
import BabyCharts from "./BabyCharts.vue";

const {getAuthenticationStatus} = useState()

const props = defineProps({
  baby: Object
})


</script>

<template>
  <div class="w-screen md:max-w-3xl h-full p-5 overflow-x-hidden">
    <BabyCharts :baby="baby" />
    <div class="border border-indigo-100 rounded-2xl shadow-md relative">
      <font-awesome-icon :icon="['fa', 'cog']" class="absolute top-5 left-5 text-4xl" />
      <font-awesome-icon :icon="['fa', 'chart-bar']" class="absolute top-5 right-5 text-4xl" />
      <h1 class="font-extrabold uppercase text-4xl mt-3">{{baby.name}}</h1>
      <Feed v-if="getAuthenticationStatus" :baby="baby" />
      <Sleep v-if="getAuthenticationStatus" :baby="baby" />
      <div class="grid grid-cols-2">
        <Temperature :baby="baby" />
        <Weight :baby="baby"/>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "BabyWindow"
}
</script>

<style scoped>

</style>
