<script setup>
/*import * as Plotly from 'plotly.js-dist-min'*/
import {computed, onMounted, ref} from "vue";
import useState from "../state";
import * as d3 from "d3";
import {formatLength} from "../utils";

const {url, getAuthHeader} = useState()

const props = defineProps({baby:Object})

const fullUrl = url + "sleep/" + props.baby.id + "/plot"
const feedUrl = url + 'feeds/' + props.baby.id + '/plot'
const nappyUrl = url + 'nappies/' + props.baby.id + '/plot'

const plotData = ref({
  data: [],
})

const getPlotData = computed(()=>{
  return plotData.value.data
})


const parsers = {
  yParser: d3.utcParse('%Y-%m-%d'),
  xParser: d3.timeParse('%Y-%m-%d %H:%M'),
  lengthParser: d3.timeParse('%s'),
  lengthParser2: d3.timeParse('%Y-%m-%d %H:%M:%S %Z'),
  lengthFormatter: d3.timeFormat('%Y-%m-%d %H:%M:%S'),
  timeFormatter: d3.timeFormat('%b %d, %H:%M'),
  parser: d3.utcParse("%Y-%m-%dT%H:%M:%S.%f%Z")
}

const render = data =>{
  const lengthFormatter = d3.timeFormat('%Y-%m-%d %H:%M:%S')
  const timeFormatter = d3.timeFormat('%b %d, %H:%M')
  const glyphId = d => `id-${props.baby.id}-${d.id}`
  const sleepFeedFilter = d => d.dataType !== 1 || d.dataType !== 2 || d.dataType !== 3;
  const nappyFilter = d => d.dataType > 0

  const yData = d => parsers.yParser(String(d.start).slice(0, 10))
  const xWidth = d => parsers.lengthParser2(parsers.lengthFormatter(parsers.lengthParser(`${Math.floor(d.length)}`)) + ' +02:00')
  const xData  = d => parsers.xParser("1970-01-01 " + String(d.start).slice(11, 16))
  const hueClass = d =>{
    if(d.dataType==='sleep'){
      return 'sleep-bar'
    }
    if(d.dataType==='feed'){
      return 'feed-bar'
    }
    if(d.dataType===1){
      return 'wee'
    }
    if (d.dataType===2){
      return 'poo'
    }
    if (d.dataType===3){
      return 'weepoo'
    }
    return null
  }

  const plotAreaDiv = d3.select('#sleepChartMain' + props.baby.id)

  const tooltip = plotAreaDiv.append('div')
        .style('opacity', 0)
        .style('position', 'fixed')
        .attr('class', 'bg-gray-50 border border-gray-800 p-1 text-sm rounded-md')

  const mouseover = (d, i, n) =>{
    const id = glyphId(i)
    tooltip.style('opacity', 1).style('display', 'block')
    g.selectAll('#' + id)
      .style('opacity', .9)
      .style('stroke-width', '2px')
      .style('stroke', 'black')
  }

  const mousemove = (d, i, n) =>{
    const tooltipText = () =>{
      if(i.dataType==='feed'){
        return 'feed'
      }else if(i.dataType==='sleep'){
        return 'asleep'
      }
    }
    tooltip
      .style('left', (d.x + 5) + 'px')
      .style('top', (d.y - 30) + 'px')
      .html(
          `<div>${formatLength(i.length_label * 1000)} ${tooltipText()}</div>` +
          `<div>Start: ${timeFormatter(parsers.parser(i.start_label))}</div>` +
          `<div>End: ${timeFormatter(parsers.parser(i.end_label))}</div>`
      )
  }

  const mouseleave = (d, i, n) =>{
    const id = glyphId(i)
    tooltip.style('opacity', .0).style('left', '0px').style('top', '0px').style('display', 'none')
    g.selectAll('#' + id)
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
    .domain([parsers.xParser('1970-01-01 00:00'), parsers.xParser('1970-01-02 00:00')])
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

  const barHeight = yScale(parsers.yParser('2020-01-01')) - yScale(parsers.yParser('2020-01-02'))
  console.log(barHeight)
  console.log(yScale.domain())
  const barOffset = barHeight / 2

  function updateRender(){
    g.selectAll('rect').data(data.filter(sleepFeedFilter))
    .enter()
    .append('rect')
    .attr('y', d => yScale(yData(d)))
    .attr('width', d => xScale(xWidth(d)))
    .attr('height', barHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top - barOffset})`)
    .attr('class', d=>hueClass(d))
    .attr('x', d => xScale(xData(d)))
      .attr('id', glyphId)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave)
    .exit().remove()

    g.selectAll('circle').data(data.filter(nappyFilter))
      .enter()
      .append('circle')
      .attr('cx', d => xScale(xData(d)))
      .attr('cy', d=> yScale(yData(d)))
      .attr('r', 5)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('class', d=>hueClass(d))
      .attr('id', glyphId)
        .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave)
      .exit().remove()
  }

  updateRender()
  g.append('text')
      .text(`${props.baby.name} Sleep Patterns`)
      .attr('transform', `translate(${innerWidth / 2} ,${margin.top - 15})`)
      .style('text-anchor', 'start')
}

const init = async () =>{

  await fetch(nappyUrl, {
    method:"GET",
    headers: getAuthHeader.value
  }).then(response=>response.json())
  .then(data=>{
    function dataMapper(d){
      return{
        start: d.created_at,
        start_label: d.created_at,
        end_label: d.created_at,
        length: d.created_at,
        length_label: d.created_at,
        dataType: d.nappy_type,
        id: `nappy${d.id}`
      }
    }
    data.forEach(d=>plotData.value.data.push(dataMapper(d)))
  }).catch(error=>console.log(error))

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
      function dataMapper (d){
        return {
          start: d.sleep_start,
          start_label: d.sleep_start_label,
          end_label: d.sleep_end_label,
          length: d.sleep_length,
          length_label: d.sleep_length_label,
          dataType: "sleep",
          id: `sleep${d.id}`
        }
      }
      data.forEach(d=>plotData.value.data.push(dataMapper(d)))
    }
  }).catch(error => console.log)

  await fetch(feedUrl, {
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
      function dataMapper (d){
        return {
          start: d.feed_start,
          start_label: d.feed_start_label,
          end_label: d.feed_end_label,
          length: d.feed_length,
          length_label: d.feed_length_label,
          dataType: "feed",
          id: `feed${d.id}`
        }
      }
      data.forEach(d=>plotData.value.data.push(dataMapper(d)))
    }
  }).catch(error => console.log)

  render(getPlotData.value)

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
