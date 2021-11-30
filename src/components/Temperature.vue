<script setup>
import {ref, computed} from "vue";

import useState from "../state";

const {closeTemp, openTemp} = useState()
const tempState = ref(false)
const switchTemp = () =>{
  tempState.value = !tempState.value
}

const getTempState = computed(()=>{
  return tempState.value
})


</script>

<template>
  <div class="p-3 h-full w-full">
    <div
        @click="switchTemp" :class="getTempState ? 'h-60' : 'h-16'"
        class="w-1/2 bg-red-300 rounded-md transition-all shadow-md flex items-center justify-center">
      <p>Average Temperature 36.5&deg</p>
    </div>
  </div>

</template>

<script>
export default {
  name: "Temperature"
}
</script>

<style scoped>

</style>
