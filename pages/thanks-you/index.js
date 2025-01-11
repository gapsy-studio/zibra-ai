import { gsap } from 'gsap/gsap-core'
import { CSSPlugin } from 'gsap'

gsap.registerPlugin(CSSPlugin)

// Btn

const btnAlpha = document.querySelector('[btn="primary"]')
console.log(btnAlpha)

btnAlpha.addEventListener('mouseenter', () => {
	gsap.to(btnAlpha, {
		'--shadow-color': 'rgba(151, 19, 255, 1)',
		'--shadow-blur': '30px',
	})
})

btnAlpha.addEventListener('mouseleave', () => {
	gsap.to(btnAlpha, {
		'--shadow-color': 'rgba(0, 0, 0, 0)',
		'--shadow-blur': '20px',
	})
})
