import { CSSPlugin } from 'gsap'
import { gsap } from 'gsap/gsap-core'

gsap.registerPlugin(CSSPlugin)

const apiKeyElement = document.querySelector('[data-api="key"]')
const urlParams = new URLSearchParams(window.location.search)
const apiKey = urlParams.get('api_key')
if (apiKey) {
	apiKeyElement.textContent = apiKey
}

document.getElementById('copy-api-btn').addEventListener('click', function () {
	// Копируем текст в буфер обмена
	navigator.clipboard
		.writeText(apiKey)
		.then(() => {
			// Показать сообщение
			const copiedMessage = document.getElementById('key-copied')
			copiedMessage.style.display = 'block'
			gsap.to(copiedMessage, {
				opacity: 1,
				duration: 0.4,
			})

			// Скрыть сообщение через секунду
			setTimeout(() => {
				gsap.to(copiedMessage, {
					opacity: 0,
					duration: 0.4,
				})
				setTimeout(() => {
					copiedMessage.style.display = 'none'
				}, 500) // Задержка для плавного исчезновения
			}, 1000)
		})
		.catch(err => {
			console.error('Failed to copy text: ', err)
		})
})

// UI element states

// Btn

const btnAlpha = document.querySelector('[btn="primary"]')
const btnStroke = document.querySelector('[btn="stroke"]')
btnStroke.addEventListener('mouseenter', () => {
	gsap.to(btnStroke, {
		'--shadow-color': 'rgba(151, 19, 255, 1)',
		'--shadow-blur': '30px',
	})
})
btnStroke.addEventListener('mouseleave', () => {
	gsap.to(btnStroke, {
		'--shadow-color': 'rgba(0, 0, 0, 0)',
		'--shadow-blur': '20px',
	})
})

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
