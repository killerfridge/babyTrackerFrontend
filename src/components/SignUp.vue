<script setup>
import useState from "../state";
import {computed, ref} from "vue";

const {getSignUp, switchSignUp, url} = useState()

const username = ref('')
const password1 = ref('')
const password2 = ref('')
const errors = ref([])

const fullUrl = url + "users/"

async function createUser(){

  errors.value = []

  if (password1.value !== password2.value){
    errors.value.push("Passwords do not match")
  }

  if (!username.value){
    errors.value.push("Please enter an email address")
  }

  if (errors.value.length === 0){

    const bodyData = JSON.stringify({
      email: username.value,
      password: password1.value
    })


    await fetch(fullUrl, {
      method: "POST",
      body: bodyData,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status === 201){
        window.alert("User Created! Sign In Now")
        switchSignUp()
        return null
      } else {
        return response.json()
      }
    }).then(data => {
      if (data){
        errors.value.push(data.detail)
      }
    })
  }
}

const getErrors = computed(()=>{
  return errors.value
})


</script>


<template>
  <div v-if="!getSignUp" @click="switchSignUp" class="mt-5 mx-auto cursor-pointer border-2 border-indigo-100 rounded-md p-3">Or Sign Up Here</div>
  <div v-else>
      <div class="flex justify-center items-center w-screen px-5">
        <div class="flex flex-col">
          <div class="text-4xl mb-5">Sign Up to BabyTracker</div>
          <form @submit.prevent="createUser" class="mt-3 flex flex-col">
            <input class="w-64 mb-3 mx-auto ring-2 ring-indigo-200 rounded-md p-2" type="text" placeholder="Email" v-model="username" />
            <input class="w-64 mb-3 mx-auto ring-2 ring-indigo-200 rounded-md p-2" type="password" placeholder="Password" v-model="password1" />
            <input class="w-64 mb-3 mx-auto ring-2 ring-indigo-200 rounded-md p-2" type="password" placeholder="Repeat Password" v-model="password2" />
            <p class="p-3 border-2 border-red-600 bg-red-300 mx-auto mt-1" v-for="error in getErrors">{{ error }}</p>
            <button type="submit" class="bg-green-300 mx-auto p-3 w-64 rounded-md mt-3">Sign Up</button>
          </form>
          <div @click="switchSignUp" class="mt-5 mx-auto cursor-pointer border-2 border-indigo-100 rounded-md p-3">Or Log In Here</div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "SignUp"
}
</script>

<style scoped>

</style>
