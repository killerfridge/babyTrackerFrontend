<script setup>
import {onMounted, ref} from "vue";
import useState from "../state";
import BabyWindow from "./BabyWindow.vue";
import CreateBaby from "./CreateBaby.vue";

const {getAuthHeader, url, loadBaby, getBaby} = useState()
const fullUrl = url + "babies/"
const babies = ref({
  'babies': []
})

/*const babies = ref([{}])
const getBaby = () =>{
  return babies.value
}

function setBaby(t){
  babies.value = t
}

async function loadBaby(){
  console.log(getAuthHeader.value)
  await fetch(fullUrl, {
    headers: getAuthHeader.value
  }).then(response => {
    if (response.status === 200){
      console.log("Authenticated!")
      return response.json()
    } else {
      return null
    }
  }).then(data => {
    if (data) {
      setBaby(data)
    } else {
      return null
    }
  })
}*/

const babyUpdater = () =>{
  const timer = setInterval(async ()=>{
    loadBaby()
  }, 5000)
}

onMounted(()=>{
  loadBaby()
  babyUpdater()
})

</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <BabyWindow v-if="getBaby.length > 0" v-for="baby in getBaby.sort((a, b)=>(a.id - b.id))" :baby="baby" :key="baby.id"/>
    <CreateBaby />
  </div>

</template>

<script>
export default {
  name: "BabyLogging"
}
</script>

<style scoped>

</style>
