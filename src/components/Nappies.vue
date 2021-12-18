<script setup>
import {ref, computed, onMounted} from "vue";
import useState from "../state";
import {formatLength} from "../utils";

const {url, getAuthHeader} = useState();

const props = defineProps({
  baby: Object
})

const nappies = ref({
  wet: null,
  solid: null,
  wetToday: 0,
  solidToday: 0
})

const millisecondsSinceStart = ref({
  'wet': 0,
  'solid': 0
})

function nappyTimer(){
  if (getNappies.value.wet) {
      const lastWetDate = new Date(getNappies.value.wet)
      millisecondsSinceStart.value.wet = Math.max(0, Date.now() - lastWetDate)
    }else{
      millisecondsSinceStart.value.wet = 0
    }
  if (getNappies.value.solid) {
    const lastSolidDate = new Date(getNappies.value.solid)
    millisecondsSinceStart.value.solid = Math.max(0, Date.now() - lastSolidDate)
  } else {
    millisecondsSinceStart.value.solid = 0
  }
}

const getNappies = computed(()=>{
  return nappies.value
})

const getWetTime = computed(()=>{
  return formatLength(millisecondsSinceStart.value.wet)
})

const getSolidTime = computed(()=>{
  return formatLength(millisecondsSinceStart.value.solid)
})

const nappyIntervalTimer = () =>{
  const timer = setInterval(nappyTimer, 1000)
}

async function init() {
  const fullUrl = url + 'nappies/' + `${props.baby.id}/` + 'latest'

  await fetch(fullUrl, {
    method: 'GET',
    headers: getAuthHeader.value
  }).then(response => response.json())
  .then(data => {
    nappies.value.wet = data.wet.created_at
    nappies.value.solid = data.solid.created_at
    nappies.value.wetToday = data.wet_today.wet_count
    nappies.value.solidToday = data.solid_today.solid_count
  }).catch(errors => console.log)
}

async function logNappy(t){
  const newBody = JSON.stringify({
    'nappy_type': t
  })
  const fullUrl = url + `nappies/${props.baby.id}`
  const auth = getAuthHeader.value
  auth['Content-Type'] = 'application/json'

  await fetch(fullUrl, {
    method: 'POST',
    body: newBody,
    headers: auth
  }).then(response => response.json())
    .then(data => {
      if (data.nappy_type === 2){
        nappies.value.solid = data.created_at
        nappies.value.solidToday += 1
      } else {
        nappies.value.wet = data.created_at
        nappies.value.wetToday += 1
      }
    }).catch(errors => console.log)

}

onMounted(()=>{
  init()
  nappyIntervalTimer()
})

</script>

<template>
  <div class="h-full p-3 transition-all">
      <div
          class="transition-all bg-green-200 shadow-md rounded-lg h-full w-full items-center justify-center text-xl">
        <div class="py-3 font-bold text-gray-800">Nappies</div>
        <div class="flex pb-3">
          <div @click="logNappy('wee')" class="transition-all rounded-md p-3 ml-4 mr-2 bg-green-500 text-md text-white w-1/2 cursor-pointer hover:bg-green-600">
            <p class="mt-3">Last <b>Wet</b> Nappy:<br>{{getWetTime}} ago</p>
            <p class="my-3">Wet Nappies In Last 24 Hours: {{getNappies.wetToday}}</p>
          </div>
          <div @click="logNappy('poo')" class="rounded-md p-3 ml-2 mr-4 bg-green-500 text-white w-1/2 cursor-pointer hover:bg-green-600 transition-all">
            <p class="mt-3">Last <b>Solid</b> Nappy:<br>{{getSolidTime}} ago</p>
            <p class="my-3">Solid Nappies in Last 24 Hours: {{getNappies.solidToday}}</p>
          </div>
        </div>

      </div>
    </div>
</template>

<script>
export default {
  name: "Nappies"
}
</script>

<style scoped>

</style>
