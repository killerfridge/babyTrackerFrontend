<script setup>
import * as Plotly from "plotly.js-dist-min"
import useState from "../state";
import {onMounted, ref, computed} from "vue";

const {url, getAuthHeader} = useState()
const props = defineProps({baby: Object})
const chartLoaded = ref(false)
const loading = ref(false)

const getLoading = computed(()=>{
  return loading.value
})

function changeLoading(bool) {
  loading.value = bool
}

const getChartLoaded = computed(()=>{
  return chartLoaded.value
})

const setChartLoaded = (bool) =>{
  chartLoaded.value = bool
}

const fullUrl = url + "temperatures/" + props.baby.id + "/plot"

const init = async () =>{

  const render = data => {
    const xValues = d => d.created_at
    const yValues = d => d.value

    const trace = [{
      y: data.map(yValues),
      type: 'box',
      name: 'Temperature<br>Range'
    }]

    const config = {
      responsive: true,
      displayModeBar: false,

    }

    const layout = {
      autosize: true,
      yaxis: {
        automargin: true,
        range: [35, 40],
        title: "Temperature (C)"
      },
      xaxis: {
        automargin: true
      },
      margin: {
        l:40,
        t:20,
        b:20,
        r:20,
        pad: 0
      }
    }

    Plotly.newPlot(`tempchart${props.baby.id}`, trace, layout, config)
  }

  await fetch(fullUrl, {
    method: "GET",
    headers: getAuthHeader.value
  }).then(response =>{
    if (response.status === 200){

      return response.json()
    } else {
      return null
    }
  })
  .then(data => {
    if (data){
      render(data)
      setChartLoaded(true)
    }
  }).catch(error => console.log)
}

onMounted(()=>{
  changeLoading(true)
  init()
  changeLoading(false)
})

</script>

<template>

  <div class="w-1/2 h-80" :id="'tempchart' + baby.id"></div>

</template>

<script>
export default {
  name: "TempChart"
}
</script>

<style scoped>

</style>
