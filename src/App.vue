<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Login from "./components/Login.vue";
import BabyLogging from "./components/BabyLogging.vue";
import {onMounted, computed} from "vue";
import useState from "./state";

const {initializeState, setAuthentication, getAuthenticationStatus, getAuthHeader, url, removeToken, isLoading, notLoading, loading} = useState()

const fullUrl = url + "login"

async function authenticate() {
  setAuthentication(false)
  isLoading()
  await fetch(fullUrl, {
    method: "GET",
    headers: getAuthHeader.value
  }).then(response => {
    if (response.status !== 200){
      console.log("Not Authenticated :'(")
      removeToken()
    } else {
      setAuthentication(true)
    }
  }).catch(errors => console.log(errors))
  notLoading()

}

const getLoading = computed(()=>{
  return loading.value
})

onMounted(()=>{
  initializeState()
  authenticate()
})
</script>

<template>
  <div v-if="!getLoading" class="mb-5">
    <Login />
    <BabyLogging v-if="getAuthenticationStatus"/>
  </div>
  <div v-else class="h-screen w-screen flex justify-center items-center">
    Loading...
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

rect .feed-bar{
  fill: cornflowerblue;
  stroke: white;
  stroke-width: 2px;
}

rect:hover{
  fill: #065F46;
  stroke: white;
  stroke-width: 2px;
}
</style>
