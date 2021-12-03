<script setup>
  import {ref, computed, onMounted} from "vue";
  import useState from "../state";

  const {url, getAuthHeader} = useState()

  const weightState = ref(false)
  const weights = ref({
    previousWeight: 0,
    newWeight: 1
  })

  const getWeights = computed(()=>{
    return weights.value
  })

  const props = defineProps({
    baby: Object
  })

  const switchWeightState = () => {
    weightState.value = !weightState.value
  }

  const getWeightState = computed(()=>{
    return weightState.value
  })

  const fullUrl = url + "weights/" + props.baby.id
  const head = computed(()=> {
    const new_head = getAuthHeader.value
    new_head["Content-Type"] = "application/json"
    return new_head
  })

  async function preloadWeight(){
    await fetch(fullUrl, {
      method: "GET",
      headers: getAuthHeader.value
    }).then(response => response.json())
    .then(data => {
      if (data){
        weights.value.previousWeight = data.value
        weights.value.newWeight = data.value
      }
    }).catch(error => console.log)
  }

  async function postWeight(){
    console.log("clicked!")
    const new_body = JSON.stringify({
      value: weights.value.newWeight
    })
    await fetch(fullUrl, {
      method: "POST",
      body: new_body,
      headers: head.value
    }).then(response => response.json())
    .then(data => {
      if (data){
        weights.value.previousWeight = data.value
        weights.value.newWeight = data.value

      }
    }).catch(error => console.log)
    switchWeightState()
  }

  onMounted(()=>{
    preloadWeight()
  })

</script>

<template>
  <div class="p-3 h-full w-full">
    <div
         :class="getWeightState ? 'h-60 flex-col' : 'h-24'"
        class="bg-blue-600 text-white rounded-md transition-all shadow-md flex items-center justify-center relative">
      <div>
        <p class="mb-3">Last Weight: <b>{{getWeights.previousWeight}}kg</b></p>
      </div>
      <div v-if="getWeightState" class="flex-col flex mt-3 items-center justify-center">
        <input class="mb-3 rounded-md p-2 text-gray-900 text-center w-36" type="number" name="newWeight" :placeholder="getWeights.previousWeight" min="1" max="80" step=0.1 v-model="weights.newWeight" />
        <div class="bg-gray-50 p-3 h-12 rounded-md text text-gray-900 w-64 cursor-pointer" @click="postWeight">Submit</div>
      </div>
      <div @click="switchWeightState" class="w-full h-6 absolute bottom-0 bg-gray-100 rounded-b-md text-black cursor-pointer">
        {{ getWeightState ? "Collapse" : "Expand" }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Weight"
}
</script>

<style scoped>

</style>
