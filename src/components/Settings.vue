<script setup>

import useState from "../state";
import {ref, computed} from "vue";

const {url, getAuthHeader, loadBaby} = useState()
const showDelete = ref(false)

const getShowDelete = computed(()=>{
  return showDelete.value
})

const switchShowDelete = () => {
  showDelete.value = !showDelete.value
}

const props = defineProps({
  baby: Object
})

const fullUrl = url + "babies/" + props.baby.id

async function deleteBaby(){
  await fetch(fullUrl, {
    method: "DELETE",
    headers: getAuthHeader.value
  }).then(response => response.json())
  .then(data => console.log)
  .catch(error => console.log)
  await loadBaby()
}

</script>

<template>
 <div @click="switchShowDelete" v-if="!getShowDelete" class="p-3 w-8/12 mx-auto mb-5 rounded-md h-16 bg-red-300 text-4xl text-white cursor-pointer">Delete</div>
  <div v-if="getShowDelete" class="w-full grid grid-cols-2 border border-indigo-100 rounded-md">
    <div class="p-3 col-span-2">Are you sure? All of {{baby.name}} data will be permanently deleted</div>
    <div @click="deleteBaby" class="p-3 m-1 rounded-md bg-red-300 cursor-pointer">Yes</div><div class="p-3 m-1 rounded-md bg-gray-300 cursor-pointer" @click="switchShowDelete">No</div>
  </div>
</template>

<script>
export default {
  name: "Settings"
}
</script>

<style scoped>

</style>
