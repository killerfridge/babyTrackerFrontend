<script setup>
// import * as Plotly from 'plotly.js-dist-min'
import * as d3 from 'd3'
import {onMounted} from "vue";
import useState from "../state";
const {url, getAuthHeader} = useState()

const props = defineProps({baby:Object})

const fullUrl = url + "feeds/" + props.baby.id + "/plot"

const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)

function render(data){

  const yParser = d3.utcParse('%Y-%m-%d')
  const xParser = d3.timeParse('%Y-%m-%d %H:%M')
  const lengthParser = d3.timeParse('%s')
  const lengthParser2 = d3.timeParse('%Y-%m-%d %H:%M:%S %Z')
  const lengthFormatter = d3.timeFormat('%Y-%m-%d %H:%M:%S')

  const yData = d => yParser(String(d.feed_start).slice(0, 10))
  const xWidth = d => lengthParser2(lengthFormatter(lengthParser(`${Math.floor(d.feed_length)}`)) + ' +02:00')
  const xData  = d => xParser("1970-01-01 " + String(d.feed_start).slice(11, 16))

  const plotAreaDiv = d3.select('#feedChartMain' + props.baby.id)
  const plotArea = {
    width: 0,
    height: 0
  }

  plotArea.height = plotAreaDiv.node().getBoundingClientRect().height
  plotArea.width = plotAreaDiv.node().getBoundingClientRect().width

  const svg = d3.select('#feedChartMain' + props.baby.id)
        .append('svg')
        .attr('class', 'h-full w-full')
        .attr("style", "width: 100%; max-height: 100%; height: auto%;")
        .attr('viewBox', [0, 0, plotArea.width, plotArea.height])

    const margin = {
      top: 30,
      right: 50,
      bottom: 50,
      left: 60,
    }

  const innerHeight = plotArea.height - (margin.top + margin.bottom)
  const innerWidth = plotArea.width - (margin.left + margin.right)

  const yScale = d3.scaleTime()
    .domain(d3.extent(data, yData))
    .range([innerHeight, 0])
    .nice()

  const xScale = d3.scaleTime()
    .domain([xParser('1970-01-01 00:00'), xParser('1970-01-02 00:00')])
    .range([0, innerWidth])
    .nice()

  const yAxis = d3.axisLeft(yScale)
  const xAxis = d3.axisBottom(xScale).ticks(d3.timeHour.every(1), '%H:%M')
  const xAxisGrid = d3.axisBottom(xScale).tickSize(-innerHeight).ticks(d3.timeHour.every(1)).tickFormat('')

  const g = svg.append('g')
  g.append('g').call(yAxis).attr('transform', `translate(${margin.left - 10}, ${margin.top})`)
  const yAxisG = g.append('g').call(xAxis).attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
  yAxisG.selectAll('text')
      .attr('transform', 'translate(12, 8)rotate(90)')
      .style('text-anchor', 'start')

  const gridlines = g.append('g').call(xAxisGrid).attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`).attr('class', 'gridline')
  g.selectAll('.gridline').style("stroke-dasharray", "5 5").attr('opacity', '0.3')
  gridlines.selectAll('path').remove()

  const barHeight = yScale(yParser('2020-01-01')) - yScale(yParser('2020-01-02'))
  const barOffset = barHeight / 2

  g.selectAll('rect').data(data)
    .enter()
    .append('rect')
    .attr('y', d => yScale(yData(d)))
    .attr('width', d => xScale(xWidth(d)))
    .attr('height', barHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top - barOffset})`)
    .attr('class', 'feed-bar')
    .attr('x', d => xScale(xData(d)))
}

const init = async () =>{
  /*const render = data => {
    //const xValue = d => d.feed_start

    function getBars(data){

      const noFeedColor = 'rgba(1, 1, 1, 0.0)'
      const feedColor = 'rgba(37 99 235, 0.7)'

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
      bargap: 0.01,
      xaxis: {
        automargin: true,
        range: [0, 1440],
        tickvals: range(0, 1441, 60),
        ticktext: range(0, 1441, 60).map(t=>`${Math.round(t/60)}:00`),
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
  }*/

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
