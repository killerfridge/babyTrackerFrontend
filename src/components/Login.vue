<script setup>
import {ref} from "vue";
import useState from "../state";
import SignUp from "./SignUp.vue";

const {setToken, getAuthenticationStatus, removeToken, switchSignUp, getSignUp} = useState()

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
  <div v-else class="h-screen items-center justify-center flex flex-col">
    <div v-if="!getSignUp">
      <div class="flex justify-center items-center w-screen px-5">
        <div class="flex flex-col">
          <div class="text-4xl mb-5">Login to BabyTracker</div>
          <form @submit.prevent="loginUser" class="mt-3 flex flex-col">
            <input class="w-64 mb-3 mx-auto ring-2 ring-indigo-200 rounded-md p-2" type="text" placeholder="Email" v-model="username" />
            <input class="w-64 mb-3 mx-auto ring-2 ring-indigo-200 rounded-md p-2" type="password" placeholder="Password" v-model="password" />
            <button type="submit" class="bg-green-300 mx-auto p-3 w-64 rounded-md mt-3">Login</button>
          </form>
        </div>
      </div>
    </div>
    <SignUp />
  </div>
</template>

<script>
export default {
  name: "Login"
}
</script>

<style scoped>

</style>
