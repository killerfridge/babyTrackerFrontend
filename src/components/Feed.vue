<script setup>
import useState from "../state";
import {ref, computed, onMounted} from "vue";
import {formatLength} from "../utils";

const props = defineProps(
    {baby: Object}
)

const feedState = ref({
  feed_end: Date.now(),
  feed_start: Date.now(),
  feed_length: 0,
})
const minsSinceStart = ref(0)
const hoursSinceStart = ref(0)
const secsSinceStart = ref(0)
const millisecsSinceStart = ref(0)
const currentFeedLength = ref(0)

const getFeedState = computed(()=>{
  return feedState.value
})

const setFeedState = (v) =>{
  feedState.value = v
}

const changeIsFeeding = () => {
  props.baby.is_feeding = !props.baby.is_feeding
}

const {url, getAuthHeader} = useState()

const fullUrl = url + 'feeds/' + props.baby.id

async function feedBaby(){
  await fetch(fullUrl, {
    method: 'POST',
    headers: getAuthHeader.value
  }).then(response => {
    if (response.status === 200){
      return response.json()
    } else {
      return {
        feed_start: Date.now(),
        feed_end: Date.now(),
        feed_length: 0
      }
    }
  }).then(data => setFeedState(data))
      .catch(error => console.log)
  currentFeedLength.value = 0
  millisecsSinceStart.value = 0
  changeIsFeeding()
}

async function getFeed(){
  await fetch(fullUrl, {
    headers: getAuthHeader.value
  }).then(response => {
    if (response.status === 200){
      return response.json()
    }
  }).then(data => setFeedState(data))
  .catch(error => console.log)
}


const lastFed = () => {
  const timer = setInterval(() => {
    try {
      const lastFedDate = new Date(getFeedState.value.feed_end)
      if (isNaN(lastFedDate.getTime())) {
        return null
      } else {
        const delta = Math.max(0, Date.now() - lastFedDate)
        millisecsSinceStart.value = delta
        secsSinceStart.value = Math.floor(delta / 1000) % 60
        minsSinceStart.value = Math.floor(delta / 1000 / 60) % 60
        hoursSinceStart.value = Math.floor(delta / 1000 / 60 / 60)
        if (getFeedState.value.feed_start) {
          const feedStartDate = new Date(getFeedState.value.feed_start)
          currentFeedLength.value = Date.now() - feedStartDate
        }
      }
    } catch {
      millisecsSinceStart.value = 0
      console.log("Error")
    }
  }, 1000)
}


const getTimeSinceFeed = computed(()=>{
  return formatLength(millisecsSinceStart.value)
})

const getTimeSinceStart = computed(()=>{
  return formatLength(currentFeedLength.value)
})

onMounted(()=>{
  if (props.baby.id){
    getFeed()
    lastFed()
  }
})

</script>

<template>

    <div class="h-60 p-3 transition-all">
      <div
          @click="feedBaby"
          :class="baby.is_feeding ? 'bg-indigo-100' : 'bg-green-500 text-white'"
          class="transition-all shadow-md rounded-lg cursor-pointer h-full w-full flex items-center justify-center text-xl">
        <div v-if="baby.is_feeding">
          <p>{{baby.name}} is <b>Feeding!</b></p>
          <p>Current Feed Duration: {{getTimeSinceStart}}</p>
        </div>
        <div v-else>
          <p>{{baby.name}} is <b>Fed!</b></p>
          <p>Last Fed {{getTimeSinceFeed}} ago</p>
          <p>Last Feed Duration: {{formatLength(getFeedState.feed_length * 1000)}}</p>
        </div>
      </div>
    </div>

</template>

<script>
export default {
  name: "Feed"
}
</script>

<style scoped>

</style>
