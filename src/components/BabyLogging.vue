<script setup>
import {onMounted, ref} from "vue";
import useState from "../state";
import BabyWindow from "./BabyWindow.vue";
import CreateBaby from "./CreateBaby.vue";

const {getAuthHeader} = useState()
const url = 'http://localhost:8000/babies/'

const babies = ref([{}])
const getBaby = () =>{
  return babies.value
}

function setBaby(t){
  babies.value = t
}

async function loadBaby(){
  await fetch(url, {
    headers: getAuthHeader.value
  }).then(response => {
    if (response.status === 200){
      console.log("Authenticated!")
      return response.json()
    }
  }).then(data => setBaby(data))
}

onMounted(()=>{
  loadBaby()
})

function viewBaby(){
  console.log(getBaby())
}
</script>

<template>
  <BabyWindow v-if="babies.length > 0" v-for="baby in babies" :baby="baby" :key="baby.id"/>
  <CreateBaby />
</template>

<script>
export default {
  name: "BabyLogging"
}
</script>

<style scoped>

</style>
