<script setup>
import * as Plotly from "plotly.js-dist-min"
import useState from "../state";

const {url, getAuthHeader} = useState()
const props = defineProps({baby: Object})

const fullUrl = url + "temperatures/" + props.baby.id + "/plot"

</script>

<template>

</template>

<script>
export default {
  name: "TempChart"
}
</script>

<style scoped>

</style>
