<script setup>
import useState from "../state";
import {ref, computed, onMounted} from "vue";
import {formatLength} from "../utils";
const {url, getAuthHeader} = useState()
const props = defineProps(
    {baby: Object}
)

const sleepState = ref({
  sleep_end: Date.now(),
  sleep_start: Date.now(),
  sleep_length: 0,
})


const millisecsSinceStart = ref(0)
const currentSleepLength = ref(0)

const getSleepState = computed(()=>{
  return sleepState.value
})

const setSleepState = (v) =>{
  sleepState.value = v
}

const changeIsSleeping = () => {
  props.baby.is_awake = !props.baby.is_awake
}


const fullUrl = url + 'sleep/' + props.baby.id

async function sleepBaby(){
  await fetch(fullUrl, {
    method: 'POST',
    headers: getAuthHeader.value
  }).then(response => {
    if (response.status === 200){
      return response.json()
    } else {
      return null
    }
  }).then(data => {
    if (data) {
      setSleepState(data)
    } else {
      setSleepState({
        sleep_end: Date.now(),
        sleep_start: Date.now(),
        sleep_length: 0
      })
    }}).catch(error => {
    console.log(error)
    setSleepState({
        sleep_end: Date.now(),
        sleep_start: Date.now(),
        sleep_length: 0
      }
    )
  })
  currentSleepLength.value = 0
  millisecsSinceStart.value = 0
  changeIsSleeping()
}

async function getSleep(){
  await fetch(fullUrl, {
    headers: getAuthHeader.value
  }).then(response => {
    if (response.status === 200){
      return response.json()
    }
  }).then(data => setSleepState(data))
  .catch(error => console.log)
}

function sleepTimer(){
  if (getSleepState.value.sleep_end) {
      const lastSleptDate = new Date(getSleepState.value.sleep_end)
      millisecsSinceStart.value = Math.max(0, Date.now() - lastSleptDate)
    }
    else if (getSleepState.value.sleep_start){
        const sleepStartDate = new Date(getSleepState.value.sleep_start)
        currentSleepLength.value = Date.now() - sleepStartDate
    } else {
      millisecsSinceStart.value = 0
    }
}

const lastSlept = () =>{
  const timer = setInterval(sleepTimer, 1000)
}

const getTimeSinceSleep = computed(()=>{
  return formatLength(millisecsSinceStart.value)
})

const getTimeSinceStart = computed(()=>{
  return formatLength(currentSleepLength.value)
})

onMounted(()=>{
  if (props.baby.id){
    sleepTimer()
    getSleep()
    lastSlept()
  }
})
</script>

<template>

    <div class="h-60 p-3 transition-all">
      <div
          @click="sleepBaby"
          :class="baby.is_awake ? 'bg-green-500 text-white' : 'bg-indigo-100'"
          class="transition-all shadow-md cursor-pointer rounded-lg h-full w-full flex items-center justify-center text-xl">
        <div v-if="baby.is_awake">
          <p>Yay! {{ baby.name }} is <b>Awake!</b></p>
          <p>Time Awake: {{getTimeSinceSleep}}</p>
          <p>Last Sleep Duration: {{formatLength(getSleepState.sleep_length * 1000)}}</p>
        </div>
        <div v-else>
          <p>Shhhh! {{ baby.name }} is <b>Sleeping!</b></p>
          <p>Current Sleep Duration: {{getTimeSinceStart}}</p>
        </div>
      </div>

    </div>

</template>

<script>
export default {
  name: "Sleep"
}
</script>

<style scoped>

</style>
