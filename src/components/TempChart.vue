<script setup>
import * as Plotly from "plotly.js-dist-min"
import useState from "../state";
import {onMounted} from "vue";

const {url, getAuthHeader} = useState()
const props = defineProps({baby: Object})

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
        range: [25, 45]
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
    }
  }).catch(error => console.log)
}

onMounted(()=>{
  init()
})

</script>

<template>
  <div class="w-1/2 h-60" :id="'tempchart' + baby.id"></div>
</template>

<script>
export default {
  name: "TempChart"
}
</script>

<style scoped>

</style>
