// Main js file
import $ from "jquery"
window.$ = window.jQuery = require('jquery');
import LazyLoad from "vanilla-lazyload"
import { Fancybox } from "@fancyapps/ui"
import Swiper, {Navigation, Autoplay, Lazy} from "swiper"
import 'swiper/css'

Swiper.use([Navigation, Autoplay, Lazy])

$(document).ready(function () {
	const lazyLoad = new LazyLoad({
		elements_selector: '.js-lazy'
	})

	const swiper = new Swiper('.swiper', {
		speed: 400,
		spaceBetween: 50,
	});

})


