<script setup>
import {onMounted, watch} from "vue";
import useState from "../state";
import BabyWindow from "./BabyWindow.vue";
import CreateBaby from "./CreateBaby.vue";

const {getAuthHeader, url, loadBaby, getBaby} = useState()
const fullUrl = url + "babies/"

const babyUpdater = () =>{
  const timer = setInterval(async ()=>{
    loadBaby()
  }, 5000)
}

watch(getBaby, (getBaby, previousBaby) =>{
  return getBaby
})

onMounted(()=>{
  loadBaby()
})

</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <BabyWindow
        v-if="getBaby.length > 0"
        v-for="baby in getBaby.sort((a, b)=>(a.id - b.id))"
        :baby="baby"
        :key="baby.id"
    />
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
