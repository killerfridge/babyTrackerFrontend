<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import Login from "./components/Login.vue";
import BabyLogging from "./components/BabyLogging.vue";
import {onMounted} from "vue";
import useState from "./state";

const {initializeState, getAuthenticationStatus} = useState()

onMounted(()=>{
  initializeState()
})
</script>

<template>
  <div class="h-8"></div>
  <Login />
  <BabyLogging v-if="getAuthenticationStatus" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
