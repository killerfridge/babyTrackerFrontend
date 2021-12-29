<script setup>
/*import * as Plotly from 'plotly.js-dist-min'*/
import {computed, onMounted} from "vue";
import useState from "../state";
import * as d3 from "d3";
import {formatLength} from "../utils";

const {url, getAuthHeader} = useState()

const props = defineProps({baby:Object})

const fullUrl = url + "sleep/" + props.baby.id + "/plot"

const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)

const render = data =>{
  const yParser = d3.utcParse('%Y-%m-%d')
  const xParser = d3.timeParse('%Y-%m-%d %H:%M')
  const lengthParser = d3.timeParse('%s')
  const lengthParser2 = d3.timeParse('%Y-%m-%d %H:%M:%S %Z')
  const lengthFormatter = d3.timeFormat('%Y-%m-%d %H:%M:%S')
  const timeFormatter = d3.timeFormat('%b %d, %H:%M')
  const parser = d3.utcParse("%Y-%m-%dT%H:%M:%S.%f%Z")
  const rectId = d => `feed-${props.baby.id}-${d.id}`

  const yData = d => yParser(String(d.sleep_start).slice(0, 10))
  const xWidth = d => lengthParser2(lengthFormatter(lengthParser(`${Math.floor(d.sleep_length)}`)) + ' +02:00')
  const xData  = d => xParser("1970-01-01 " + String(d.sleep_start).slice(11, 16))

  const plotAreaDiv = d3.select('#sleepChartMain' + props.baby.id)

  const tooltip = plotAreaDiv.append('div')
        .style('opacity', 0)
        .style('position', 'fixed')
        .attr('class', 'bg-gray-50 border border-gray-800 p-1 text-sm rounded-md')

  const mouseover = (d, i, n) =>{
    tooltip.style('opacity', 1).style('display', 'block')
    g.selectAll(`#${rectId(i)}`)
      .style('opacity', .9)
      .style('stroke-width', '2px')
      .style('stroke', 'black')
  }

  const mousemove = (d, i, n) =>{
    tooltip
      .style('left', (d.x + 5) + 'px')
      .style('top', (d.y - 30) + 'px')
      .html(
          `<div>${formatLength(i.sleep_length_label * 1000)} asleep</div>` +
          `<div>Start: ${timeFormatter(parser(i.sleep_start_label))}</div>` +
          `<div>End: ${timeFormatter(parser(i.sleep_end_label))}</div>`
      )
  }

  const mouseleave = (d, i, n) =>{
    tooltip.style('opacity', .0).style('left', '0px').style('top', '0px').style('display', 'none')
    g.selectAll(`#${rectId(i)}`)
      .style('opacity', .8)
      .style('stroke-width', '1px')
      .style('stroke', 'white')
      .style('stroke-opacity', .8)
  }

  const plotArea = {
    width: 0,
    height: 0
  }

  plotArea.height = plotAreaDiv.node().getBoundingClientRect().height
  plotArea.width = plotAreaDiv.node().getBoundingClientRect().width

  const svg = d3.select('#sleepChartMain' + props.baby.id)
        .append('svg')
        .attr('class', 'h-full w-full')
        .attr("style", "width: 100%;")
        .attr('viewBox', [0, 0, plotArea.width, plotArea.height])


  d3.select(window).on('resize', function(){
    plotArea.height = plotAreaDiv.node().getBoundingClientRect().height
    plotArea.width = plotAreaDiv.node().getBoundingClientRect().width
    svg.style('height', plotArea.height)
  })

    const margin = {
      top: 30,
      right: 10,
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

  g.append('g')
      .call(yAxis)
      .attr('transform', `translate(${margin.left - 10}, ${margin.top})`)

  const yAxisG = g.append('g')
      .call(xAxis)
      .attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)

  yAxisG.selectAll('text')
      .attr('transform', 'translate(12, 8)rotate(90)')
      .style('text-anchor', 'start')

  const gridlines = g.append('g')
      .call(xAxisGrid)
      .attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
      .attr('class', 'gridline')

  g.selectAll('.gridline')
      .attr('opacity', '0.1')

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
    .attr('class', 'sleep-bar')
    .attr('x', d => xScale(xData(d)))
      .attr('id', rectId)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave)

  g.append('text')
      .text(`${props.baby.name} Sleep Patterns`)
      .attr('transform', `translate(${innerWidth / 2} ,${margin.top - 15})`)
      .style('text-anchor', 'start')
}

const init = async () =>{
  /*const render = data => {
    const xValue = d => d.sleep_start
    const yValue = d => d.sleep_end
    const length = d => d.sleep_length
    const xDay = d => new Date(xValue(d)).getDay()
    const yTime = d => new Date(xValue(d)).getUTCHours()

    function getBars(data){

      const awakeColor = 'rgba(239, 68, 68, 0.2)'
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

        const sleep_length = data[i].sleep_length
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
      marker: {
        color: chartData.colors,
        line: {
          width: 1,
          color: 'white'
        },
        opacity: 0.7
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
      title: "Sleep Patterns"
    }
    Plotly.newPlot('sleepChartMain' + props.baby.id, trace, layout, config)
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
  <div class="w-full h-80" :id="'sleepChartMain' + baby.id"></div>
</template>

<script>
export default {
  name: "SleepChart"
}
</script>

<style scoped>

</style>
