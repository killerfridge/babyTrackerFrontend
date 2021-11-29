<script setup>
import useState from "../state";
import {ref, computed, onMounted} from "vue";
import {formatLength} from "../utils";

const props = defineProps(
    {baby: Object}
)

const feedState = ref({
  feed_end: '',
  feed_start: '',
  feed_length: '',
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

const lastFed = () =>{
  const timer = setInterval(()=> {
    const lastFedDate = new Date(getFeedState.value.feed_end)
    if (isNaN(lastFedDate.getTime())) {
      return null
    } else {
      const delta = Date.now() - lastFedDate
      millisecsSinceStart.value = delta
      secsSinceStart.value = Math.floor(delta / 1000) % 60
      minsSinceStart.value = Math.floor(delta / 1000 / 60) % 60
      hoursSinceStart.value = Math.floor(delta / 1000 / 60 / 60)
      if (getFeedState.value.feed_start){
        const feedStartDate = new Date(getFeedState.value.feed_start)
        const new_delta = Date.now() - feedStartDate
        currentFeedLength.value = new_delta
      }
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

    <div class="h-32 p-3 transition-all">
      <div
          @click="feedBaby"
          :class="baby.is_feeding ? 'bg-blue-500' : 'bg-green-500'"
          class="transition-all shadow-lg rounded-lg h-full w-full flex items-center justify-center">
        <div v-if="baby.is_feeding">
          <h1>Baby is Feeding!</h1>
          <p>Current Feed Duration: {{getTimeSinceStart}}</p>
        </div>
        <div v-else>
          <h1>Baby is Fed!</h1>
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
