<script setup>
import Feed from "./Feed.vue";
import Sleep from "./Sleep.vue";
import useState from "../state";

const {getAuthenticationStatus} = useState()

const props = defineProps({
  baby: Object
})


</script>

<template>
  <div class="w-screen h-screen p-2">
    <div class="border-2 border-indigo-100 w-full h-full">
      <h1 class="font-extrabold uppercase text-4xl mt-3">{{baby.name}}</h1>
      <Feed v-if="getAuthenticationStatus" :baby="baby"/>
    </div>
  </div>

</template>

<script>
export default {
  name: "BabyWindow"
}
</script>

<style scoped>

</style>
