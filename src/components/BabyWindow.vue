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
  <div class="w-screen md:max-w-3xl h-full p-5 overflow-x-hidden">
    <div class="border border-indigo-100 rounded-2xl shadow-md">
      <h1 class="font-extrabold uppercase text-4xl mt-3">{{baby.name}}</h1>
      <Feed v-if="getAuthenticationStatus" :baby="baby" />
      <Sleep v-if="getAuthenticationStatus" :baby="baby" />
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
