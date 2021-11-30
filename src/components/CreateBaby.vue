<script setup>
import {ref, computed} from "vue";
import useState from "../state";

const {getAuthHeader, url, loadBaby, setBaby, getBaby, addBaby} = useState()

const fullUrl = url + 'babies/'

const babyName = ref('')
const errors = ref({
  'errors': []
})

const getBabyName = computed(()=>{
  return babyName.value
})

const showNewBaby = ref(false)

const getShowCreate = computed(()=>{
  return showNewBaby.value
})

const switchShowCreate = () => {
  showNewBaby.value = !showNewBaby.value
}

async function createBaby(){
  const new_body = JSON.stringify({
    name: babyName.value
  })
  const auth = getAuthHeader.value
  auth["Content-Type"] = "application/json"
  await fetch(fullUrl, {
    method: "POST",
    body: new_body,
    headers: auth
  }).then(response =>{
    if (response.status === 201){
      switchShowCreate()
      return response.json()
    } else {
      return null
    }
  }).then(data => addBaby(data))
  .catch(error => errors.value.errors.push(error))
  //location.reload()
}

</script>


<template>
  <div :class="getShowCreate ? 'h-60' : 'h-16'"
       class="
       flex
       w-full
       max-w-2xl
       bg-gray-100
       items-center
       justify-center
       transition-all
       rounded-md
">
    <button v-if="!getShowCreate" @click="switchShowCreate" class="w-full h-full">Add New Baby?</button>
    <form v-if="getShowCreate" @submit.prevent="createBaby" class="transition-all grid grid-cols-2 gap-2 w-80">
      <input class="transition-all col-span-2 p-3 ring-2 ring-blue-100" type="text" placeholder="Baby Name" v-model="babyName" />
      <div v-if="errors.errors.length > 0" v-for="error in errors.errors" class="p-2 border border-red-300 col-span-2">{{error}}</div>
      <button class="p-3 mt-2 ring-2 ring-green-200 hover:bg-green-200 transition-colors" type="submit">Create New Baby</button>
      <div @click="switchShowCreate" class="transition-colors p-3 mt-2 ring-2 ring-red-200 cursor-pointer hover:bg-red-200">Cancel</div>
    </form>

  </div>
</template>

<script>
export default {
  name: "CreateBaby"
}
</script>

<style scoped>

</style>
