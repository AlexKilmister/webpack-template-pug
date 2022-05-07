import { createApp } from 'vue'
const $ = require('jquery')

// JS
import './js/'

// SCSS
import './assets/scss/main.scss'

// CSS (example)
// import './assets/css/main.css'


import Example from './components/Example.vue'

const app = createApp(Example).mount('#app2')


