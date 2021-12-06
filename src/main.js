import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChartBar, faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Plotly from 'plotly.js-dist-min';

library.add(faChartBar)
library.add(faCog)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
