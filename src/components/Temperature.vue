<script setup>
import {ref, computed, onMounted} from "vue";

import useState from "../state";

const {url, getAuthHeader} = useState()

const props = defineProps(
    {baby: Object}
)

const fullUrl = url + "temperatures/" + props.baby.id

const tempState = ref(false)
const previousTemperature = ref(36.5)
const averageTemperature = ref(36.5)
const newTemperature = ref(36.5)


const getPreviousTemperature = computed(()=>{
  return previousTemperature.value
})

const getAverageTemperature = computed(()=>{
  return averageTemperature.value
})

const switchTemp = () =>{
  tempState.value = !tempState.value
}

const openTemp = () =>{
  tempState.value = true
}

const closeTemp = () => {
  tempState.value = false
}

const getTempState = computed(()=>{
  return tempState.value
})

const getOpenClose = computed(()=>{
  if(getTempState.value){
    return "Collapse"
  } else {
    return "Expand"
  }
})

async function getTempData(){
  await fetch(fullUrl,{
    method: "GET",
    headers: getAuthHeader.value
  }).then(response => response.json())
  .then(data =>{
    if (data){
      previousTemperature.value = data.Temperature.value
      newTemperature.value = data.Temperature.value
      averageTemperature.value = data.avg
    }
  }
  ).catch(error => console.log)
}

async function postTempData(){
  const new_temp = JSON.stringify({
    value: newTemperature.value
  })
  const auth = getAuthHeader.value
  auth["Content-Type"] = "application/json"
  await fetch(fullUrl, {
    method: "POST",
    body: new_temp,
    headers: auth
  }).then(response => response.json())
  .then(data => {
    if (data){
      previousTemperature.value = data.Temperature.value
      averageTemperature.value = data.avg
    }
  }).catch(error => console.log)
  closeTemp()
}

onMounted(()=>{
  getTempData()
})

</script>

<template>
  <div class="p-3 h-full w-full">
    <div
        :class="getTempState ? 'h-60' : 'h-24'"
        class="bg-red-400 text-white rounded-md transition-all shadow-md flex items-center justify-center relative">
      <div :class="!getTempState ? '' : 'grid grid-cols-2 gap-4'" class="transition-transform text-sm md:text-lg justify-center">
        <p>Previous <b>{{getPreviousTemperature}}&deg</b></p>
        <p class="mb-3">Average <b>{{getAverageTemperature.toFixed(1)}}&deg</b></p>
        <div v-if="getTempState" class="col-span-2 justify-center">
          <input type="number" min=30 max=50 class="text-gray-900 p-1 rounded-md text-center w-36 mb-3" step="0.1" v-model="newTemperature"/>
          <div class="p-3 h-12 w-36 mx-auto rounded-md bg-gray-100 text-gray-900 transition-all cursor-pointer" @click="postTempData">Submit</div>
        </div>
      </div>
      <div class="w-full h-6 absolute bottom-0 bg-gray-100 rounded-b-md text-black cursor-pointer" @click="switchTemp" >{{ getOpenClose }}</div>
    </div>
  </div>

</template>

<script>
export default {
  name: "Temperature"
}
</script>

<style scoped>

</style>
