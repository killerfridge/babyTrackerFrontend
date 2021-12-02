<script setup>
  import {ref, computed} from "vue";

  const weightState = ref(false)

  const switchWeightState = () => {
    weightState.value = !weightState.value
  }

  const getWeightState = computed(()=>{
    return weightState.value
  })
</script>

<template>
  <div class="p-3 h-full w-full">
    <div
        @click="switchWeightState" :class="getWeightState ? 'h-60' : 'h-16'"
        class="bg-blue-600 text-white rounded-md transition-all shadow-md flex items-center justify-center">
      <p>Last Weight: <b>4.7kg</b></p>
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
