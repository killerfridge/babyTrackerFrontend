<script setup>
import Feed from "./Feed.vue";
import Sleep from "./Sleep.vue";
import Temperature from "./Temperature.vue";
import useState from "../state";
import Weight from "./Weight.vue";
import BabyCharts from "./BabyCharts.vue";
import Settings from "./Settings.vue";
import {ref, computed} from "vue";
import Nappies from "./Nappies.vue";

const {getAuthenticationStatus} = useState()

const props = defineProps({
  baby: Object
})

const chartsView = ref(false)
const whichView = ref(
    {
      settings: false,
      charts: false,
      main: true
    }
)

const getView = computed(()=>{
  return whichView.value
})

const getChartsView = computed(()=>{
  return chartsView.value
})

const switchChartsView = () =>{
  whichView.value.charts = true
  whichView.value.main = false
  whichView.value.settings = false
}

const switchMainView = () =>{
  whichView.value.charts = false
  whichView.value.main = true
  whichView.value.settings = false
}

const switchSettingsView = () => {
  whichView.value.charts = false
  whichView.value.main = false
  whichView.value.settings = true
}


</script>

<template>
  <div class="w-screen md:max-w-3xl h-full p-5 overflow-x-hidden">
    <div v-if="getView.charts" class="border border-indigo-100 rounded-2xl shadow-md pr-3 pl-3 pb-3 relative">
      <font-awesome-icon :icon="['fa', 'cog']" class="absolute top-5 left-5 text-4xl" @click="switchSettingsView"/>
      <font-awesome-icon :icon="['fa', 'home']" class="absolute top-5 right-5 text-4xl cursor-pointer" @click="switchMainView" />
      <h1 class="font-extrabold uppercase text-4xl mt-3 mb-5">{{baby.name}}</h1>
      <BabyCharts :baby="baby" />
    </div>
    <div v-if="getView.main" class="border border-indigo-100 rounded-2xl shadow-md relative">
      <font-awesome-icon :icon="['fa', 'cog']" class="absolute top-5 left-5 text-4xl" @click="switchSettingsView" />
      <font-awesome-icon :icon="['fa', 'chart-bar']" class="absolute top-5 right-5 text-4xl cursor-pointer" @click="switchChartsView"  />
      <h1 class="font-extrabold uppercase text-4xl mt-3">{{baby.name}}</h1>
      <Feed v-if="getAuthenticationStatus" :baby="baby" />
      <Sleep v-if="getAuthenticationStatus" :baby="baby" />
      <Nappies v-if="getAuthenticationStatus" :baby="baby" />
      <div class="grid grid-cols-2">
        <Temperature :baby="baby" />
        <Weight :baby="baby"/>
      </div>
    </div>
    <div v-if="getView.settings" class="border border-indigo-100 rounded-2xl shadow-md h-96 pr-3 pl-3 pb-3 relative">
      <h1 class="font-extrabold uppercase text-4xl mt-3">{{baby.name}}</h1>
      <font-awesome-icon :icon="['fa', 'home']" class="absolute top-5 left-5 text-4xl" @click="switchMainView"/>
      <font-awesome-icon :icon="['fa', 'chart-bar']" class="absolute top-5 right-5 text-4xl cursor-pointer" @click="switchChartsView"  />
      <div class="h-full w-full flex items-center justify-center">
         <Settings :baby="baby" />
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
