<script setup>
import {ref, computed} from "vue";

const showNewBaby = ref(false)

const getShowCreate = computed(()=>{
  return showNewBaby.value
})

const switchShowCreate = () => {
  showNewBaby.value = !showNewBaby.value
}


</script>


<template>
 <button>Add New Baby?</button>
</template>

<script>
export default {
  name: "CreateBaby"
}
</script>

<style scoped>

</style>
