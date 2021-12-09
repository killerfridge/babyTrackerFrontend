<script setup>
import * as Plotly from 'plotly.js-dist-min'
import {computed, onMounted} from "vue";
import useState from "../state";

const {url, getAuthHeader} = useState()

const props = defineProps({baby:Object})

const fullUrl = url + "sleep/" + props.baby.id + "/plot"

const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)

const init = async () =>{
  const render = data => {
    const xValue = d => d.sleep_start
    /*const yValue = d => d.sleep_end
    const length = d => d.sleep_length
    const xDay = d => new Date(xValue(d)).getDay()
    const yTime = d => new Date(xValue(d)).getUTCHours()*/

    function getBars(data){

      const awakeColor = 'rgba(1, 1, 1, 0.0)'
      const asleepColor = '#10B981'

      const endData = {
        x: [],
        y: [],
        colors: [],
        name: []
      }

      function toMinutes(d){
        return (d.getHours() * 60) + d.getMinutes()
      }

      function getDelta(d1, d2){
        return toMinutes(d2) - toMinutes(d1)
      }

      function getFirstAwake(d1){
        return (d1.getHours() * 60) + d1.getMinutes()
      }

      let mins_in_day = 1440

      for (let i = 0; i < data.length; i++){
        const date_start = new Date(data[i].sleep_start)
        let date_end = new Date(Date.now())
        if (data[i].sleep_end){
          date_end = new Date(data[i].sleep_end)
        }

        /*const sleep_length = data[i].sleep_length*/
        let awake_period = 0
        let sleep_period = 0

        if (i === 0){
          // If it is the first session logged, fill the first part of the bar
          awake_period = getFirstAwake(date_start)
          // mins in day will be for overflowing
          mins_in_day -= awake_period
        }else{
          // create a bar to fill from the end of the previous sleep
          // to the start of this one
          const awake_start = new Date(data[i-1].sleep_end)
          awake_period = getDelta(awake_start, date_start)
          if (awake_period < 0){
            endData.y.push(new Date(awake_start.toDateString()))
            // if the awake period is < 0 it indicates the sleep from the previous day
            // went over midnight, and the awake start and end dates aren't the same
            // the mins in day remainder for the previous day should be whatever is needed to fill up
            endData.x.push(mins_in_day)
            endData.colors.push(awakeColor)
            endData.name.push('awake')
            // the minutes awake
            awake_period = getFirstAwake(date_start)
            mins_in_day = 1440
          }
          mins_in_day -= awake_period
        }
        sleep_period = getDelta(date_start, date_end)
        if (sleep_period < 0){
          sleep_period = mins_in_day
          endData.y.push(new Date(date_end.toDateString()))
          endData.x.push(getFirstAwake(date_end))
          endData.colors.push(asleepColor)
          endData.name.push('asleep')
          mins_in_day = 1440 - getFirstAwake(date_end)
        }

        endData.y.push(new Date(date_start.toDateString()))
        endData.x.push(awake_period)
        endData.colors.push(awakeColor)
        endData.name.push('awake')

        endData.y.push(new Date(date_start.toDateString()))
        endData.x.push(sleep_period)
        endData.colors.push(asleepColor)
        endData.name.push('asleep')
      }

      return endData
    }

    const chartData = getBars(data)

    const trace = [{
      y: chartData.y,
      x: chartData.x,
      type: 'bar',
      text: chartData.name,
      marker: {
        color: chartData.colors
      },
      orientation: 'h',
      hovertemplate: '<b>%{x:.0f}</b> minutes %{text}' +
          '<extra></extra>',
      textposition: 'center',
      uniformtext_mode: 'hide'
    }]

    const config = {
      responsive: true,
      displayModeBar: false
    }

    const layout = {
      barmode: 'stack',
      xaxis: {
        automargin: true,
        range: [0, 1440],
        tickvals: range(0, 1441, 120),
        ticktext: range(0, 1441, 120).map(t=>`${Math.round(t/60)}:00`),
        title: "Time"
      },
      yaxis: {
        automargin: true,
        title: "Date",
        tickformat: "%b-%d",
        dtick: 1000 * 60 * 60 * 24,
      },
      margin: {
        t:40,
        b:20,
        l:20,
        r:20,
        pad:0
      },
      autosize:true,
      title: "Sleep Patterns"
    }
    Plotly.newPlot('sleepChartMain' + props.baby.id, trace, layout, config)
  }

  await fetch(fullUrl, {
    method: "GET",
    headers: getAuthHeader.value
  }).then(response => {
    if (response.status === 200){
      return response.json()
    } else {
      return null
    }
  }).then(data => {
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
  <div class="w-full h-80" :id="'sleepChartMain' + baby.id"></div>
  <div v-if="false" class="w-1/2 h-80" :id="'sleepChartSecondary' + baby.id"></div>
</template>

<script>
export default {
  name: "SleepChart"
}
</script>

<style scoped>

</style>
