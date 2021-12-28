<script setup>
import * as d3 from 'd3'
import {onMounted} from "vue";
import useState from "../state";
import {formatLength} from "../utils";
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
  const timeFormatter = d3.timeFormat('%b %d, %H:%M')
  const parser = d3.utcParse("%Y-%m-%dT%H:%M:%S.%f%Z")
  const rectId = d => `feed-${props.baby.id}-${d.id}`

  const yData = d => yParser(String(d.feed_start).slice(0, 10))
  const xWidth = d => lengthParser2(lengthFormatter(lengthParser(`${Math.floor(d.feed_length)}`)) + ' +02:00')
  const xData  = d => xParser("1970-01-01 " + String(d.feed_start).slice(11, 16))

  const plotAreaDiv = d3.select('#feedChartMain' + props.baby.id)

  const tooltip = plotAreaDiv.append('div')
        .style('opacity', 0)
        .style('position', 'fixed')
        .attr('class', 'bg-gray-50 border border-gray-800 p-1 text-sm rounded-md')

  const mouseover = (d, i, n) =>{
    tooltip.style('opacity', 1)
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
          `<div>${formatLength(i.feed_length_label * 1000)} feed</div>` +
          `<div>Start: ${timeFormatter(parser(i.feed_start_label))}</div>` +
          `<div>End: ${timeFormatter(parser(i.feed_end_label))}</div>`
      )

  }

  const mouseleave = (d, i, n) =>{
    tooltip.style('opacity', .0).style('left', '0px').style('top', '0px')
    g.selectAll(`#${rectId(i)}`)
      .style('opacity', .6)
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
    .attr('class', 'feed-bar')
    .attr('x', d => xScale(xData(d)))
      .attr('id', rectId)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave)
}

const init = async () =>{

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
