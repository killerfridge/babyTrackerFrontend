<script setup>
import * as Plotly from 'plotly.js-dist-min'
import {onMounted} from "vue";
import useState from "../state";
const {url, getAuthHeader} = useState()

const props = defineProps({baby:Object})

const fullUrl = url + "feeds/" + props.baby.id + "/plot"

const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)

const init = async () =>{
  const render = data => {
    //const xValue = d => d.feed_start

    function getBars(data){

      const noFeedColor = 'rgba(1, 1, 1, 0.0)'
      const feedColor = 'rgb(37 99 235)'

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

      function getDayStartPeriod(d1){
        return (d1.getHours() * 60) + d1.getMinutes()
      }

      let mins_in_day = 1440

      for (let i = 0; i < data.length; i++){
        const date_start = new Date(data[i].feed_start)
        let date_end = new Date(Date.now())
        if (data[i].feed_end){
          date_end = new Date(data[i].feed_end)
        }

        /*const sleep_length = data[i].sleep_length*/
        let nofeed_period = 0
        let feed_period = 0

        if (i === 0){
          // If it is the first session logged, fill the first part of the bar
          nofeed_period = getDayStartPeriod(date_start)
          // mins in day will be for overflowing
          mins_in_day -= nofeed_period
        }else{
          // create a bar to fill from the end of the previous sleep
          // to the start of this one
          const feed_start = new Date(data[i-1].feed_end)
          nofeed_period = getDelta(feed_start, date_start)
          if (nofeed_period < 0){
            endData.y.push(new Date(feed_start.toDateString()))
            // if the awake period is < 0 it indicates the sleep from the previous day
            // went over midnight, and the awake start and end dates aren't the same
            // the mins in day remainder for the previous day should be whatever is needed to fill up
            endData.x.push(mins_in_day)
            endData.colors.push(noFeedColor)
            endData.name.push('not feeding')
            // the minutes awake
            nofeed_period = getDayStartPeriod(date_start)
            mins_in_day = 1440
          }
          mins_in_day -= nofeed_period
        }
        feed_period = getDelta(date_start, date_end)
        if (feed_period < 0){
          feed_period = mins_in_day
          endData.y.push(new Date(date_end.toDateString()))
          endData.x.push(getDayStartPeriod(date_end))
          endData.colors.push(feedColor)
          endData.name.push('feeding')
          mins_in_day = 1440 - getDayStartPeriod(date_end)
        }

        endData.y.push(new Date(date_start.toDateString()))
        endData.x.push(nofeed_period)
        endData.colors.push(noFeedColor)
        endData.name.push('not feeding')

        endData.y.push(new Date(date_start.toDateString()))
        endData.x.push(feed_period)
        endData.colors.push(feedColor)
        endData.name.push('feeding')
      }

      return endData
    }

    const chartData = getBars(data)

    const trace = [{
      y: chartData.y,
      x: chartData.x,
      type: 'bar',
      marker: {
        color: chartData.colors,
        line: {
          width: 1,
          color: 'white'
        }
      },
      orientation: 'h',
      hovertemplate: '<b>%{x:.0f}</b> minutes' +
          '<extra></extra>',
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
        title: "Time",
        zeroline: false
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
      title: "Feed Patterns"
    }
    Plotly.newPlot('feedChartMain' + props.baby.id, trace, layout, config)
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
  <div class="w-full h-80" :id="'feedChartMain' + baby.id"></div>
</template>

<script>
export default {
  name: "FeedChart"
}
</script>

<style scoped>

</style>
