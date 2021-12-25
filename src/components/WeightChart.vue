<script setup>
import {ref, computed, onMounted, onUnmounted} from "vue";
import useState from "../state";
import * as d3 from 'd3'
/*import * as Plotly from 'plotly.js-dist-min'*/
//import {select, scaleLinear, selectAll} from 'd3'

const {url, getAuthHeader} = useState()
const plotData = ref({
  'data': null
})

const getPlotData = computed(()=>{
  return plotData.value.data
})

const fullUrl = url + 'weights/' + props.baby.id + '/plot'

const props = defineProps(
    {
      baby: Object
    }
)

const renderData = () =>{
  render(getPlotData.value)
}

const render = data => {
    const plotArea = [250, 400]
    const plotAreaDiv = d3.select(`#weightChart${props.baby.id}`)


    plotArea[0] = plotAreaDiv.node().getBoundingClientRect().height
    plotArea[1] = plotAreaDiv.node().getBoundingClientRect().width
        /*.attr('height', plotArea[0])
        .attr('width', plotArea[1])*/
    const margin = {
      top: 60,
      right: 50,
      bottom: 50,
      left: 50,
    }

    const innerWidth = plotArea[1] - (margin.left + margin.right)
    const innerHeight = plotArea[0] - (margin.top + margin.bottom)
    const svg = plotAreaDiv
        .append('svg')
        .attr('class', 'w-full h-full')
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .attr('viewBox', [0, 0, plotArea[1], plotArea[0]]);


    const parser = d3.utcParse("%Y-%m-%dT%H:%M:%S.%f%Z")
    const xData = d => Date.parse(d.created_at)
    const xData2 = d => parser(d.created_at)
    const yData = d => d.value

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yData))
        .range([innerHeight, 0])
        .nice();

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xData2))
        .range([0, innerWidth])
        .nice();

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('class', 'text-gray-500')

    const xAxis = d3.axisBottom(xScale)
        .ticks(5)
    const xAxisGrid = d3.axisBottom(xScale).tickSize(-innerHeight).ticks(5).tickFormat('')
    const yAxis = d3.axisLeft(yScale)
    const yAxisGrid = d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat('')

    g.append('g').call(yAxis)
    g.append('g').call(yAxisGrid).attr('class', 'gridline')
    g.append('g').call(xAxis).attr('transform', `translate(0, ${innerHeight})`)
    g.append('g').call(xAxisGrid).attr('transform', `translate(0, ${innerHeight})`).attr('class', 'gridline')

    g.selectAll('.gridline').style("stroke-dasharray", "5 5").attr('opacity', '0.3')

    const circles = g.selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cx', d => xScale(xData(d)))
        .attr('cy', 0)
        .attr('r', '5')
        .attr('stroke', 'steelblue')
        .attr('fill', '#10B981')
        .transition()
        .duration(1000)
        .ease(d3.easeBounce)
        .delay((d, i)=> 1/(i+1) * 2000)
        .attr('cy', d => yScale(yData(d)))

    const yAxisTitle = svg.append('g').attr('class', 'text-gray-500 text-sm').append('text')
        .text("Weight in KG")
        .attr('transform', `translate(${margin.left - 30}, ${innerHeight /2 + margin.top + margin.bottom})rotate(270)`)
        .attr('fill', 'currentColor')

    const topTitle = svg.append('g')
        .attr('class', 'text-gray-500 text-md')
        .append('text')
        .text(`${props.baby.name} Weight`)
        .attr('transform', `translate(${innerWidth/2 - margin.left/2}, ${margin.top - 15})`)
  }

const init = async () => {

  /*const render = data => {
    const xValues = d => d.created_at
    const yValues = d => d.value

    const trace = [{
      x: data.map(xValues),
      y: data.map(yValues),
      type: 'scatter',
      mode: 'markers',
      marker: {size:16, opacity: 0.8},
      hovertemplate: '<b>Weight</b>: %{y:.1f}kg<br>' +
                      '<b>Date</b>: %{x| %b %d}',
      name: "Weights"
    }]

    const layout = {
      autosize: true,
      showlegend: false,
      yaxis:{
        automargin: true,
        title: 'Weight (kg)'
      },
      xaxis: {
        tickformat: '%b-%d',
        title: 'Date',
      },
      margin: {
        l: 20,
        r: 20,
        t: 20,
        b: 40,
        pad: 0,
      }
    }

    const config = {
      displayModeBar: false,
      responsive: true,
    }

    Plotly.newPlot(`weightChart${props.baby.id}`, trace, layout, config)
  }*/

  await fetch(fullUrl, {
    method: "GET",
    headers: getAuthHeader.value
      }
  ).then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          return null
        }
      }
  ).then(data => {
    if (data){
      plotData.value.data = data
      renderData()
    }
    }).catch(error => console.log);
}
onMounted(()=>{
  init()
})

</script>

<template>
    <div :id="'weightChart' + baby.id" class="rounded-md"></div>
</template>

<script>
export default {
  name: "WeightChart"
}
</script>

<style scoped>

</style>
