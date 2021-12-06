<script setup>
import * as Plotly from 'plotly.js-dist-min'
import {computed} from "vue";
import useState from "../state";

const {url, getAuthHeader} = useState()

const props = defineProps({baby:Object})

const fullUrl = url + "sleep/" + props.baby.id + "/plot"

</script>

<template>
  <div class="w-1/2 h-60" :id="'sleepChartMain' + baby.id"></div>
  <div class="w-1/2 h-60" :id="'sleepChartSecondary' + baby.id"></div>
</template>

<script>
export default {
  name: "SleepChart"
}
</script>

<style scoped>

</style>
