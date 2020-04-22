window.Vue = require('vue')
const $ = require('jquery')

// JS
import './js/'

// SCSS
import './assets/scss/main.scss'

// CSS (example)
// import './assets/css/main.css'


// Vue components (for use in html)
Vue.component('example-component', require('./components/Example.vue').default)

// Vue init
const app = new Vue({
  el: '#app',
  data () {
    return {
      message: 'test'
    }
  }
})
