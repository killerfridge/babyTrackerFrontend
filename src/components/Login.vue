<script setup>
import {ref} from "vue";
import useState from "../state";

const {setToken, getAuthenticationStatus, removeToken} = useState()

const username = ref('')
const password = ref('')

const url = 'http://localhost:8000/login'

async function loginUser(){
  let form = new FormData
  form.append('username', username.value)
  form.append('password', password.value)

  await fetch(url, {
    method: 'POST',
    body: form
  }).then(response => {
    if(response.status === 200){
      return response.json()
    } else {
      return null
    }
  }).then(data => {
    if (data){
      setToken(data.access_token)
    } else {
      removeToken()
    }
  })

}

function logoutUser() {
  removeToken()
}
</script>

<template>
  <div v-if="getAuthenticationStatus">
    <button @click="logoutUser">Logout</button>
  </div>
  <div v-else>
    <form @submit.prevent="loginUser">
      <input type="text" v-model="username" />
      <input type="password" v-model="password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login"
}
</script>

<style scoped>

</style>
