import gsap from 'gsap'
import { ScrollTrigger, SplitText, TextPlugin } from 'gsap/all'
import CSSPlugin from 'gsap/CSSPlugin'

// functions

function animateDescription(selector) {
	gsap.registerPlugin(CSSPlugin)
	const textSplit = new SplitText(selector, { type: 'words' })
	return gsap.from(
		textSplit.words,
		{
			opacity: 0,
			y: '-100%',
			duration: 0.4,
			stagger: 0.05,
		},
		0
	)
}
function animateTag(selector) {
	return gsap.from(selector, {
		opacity: 0,
		y: '130%',
		scale: 1.2,
		duration: 0.6,
	})
}
function animateObg(selector, duration, stagger) {
	return gsap.from(selector, {
		opacity: 0,
		scale: 1.1,
		duration: duration || 1.2,
		...(stagger !== undefined ? { stagger: stagger } : {}),
	})
}

function animateSimpleTitle(selector, duration, stagger) {
	const splitTitle = new SplitText(selector, { type: 'lines' })
	return gsap.from(splitTitle.lines, {
		opacity: 0,
		y: '100%',
		duration: duration || 0.6,
		stagger: stagger || 0.05,
	})
}

const init = () => {
	gsap.registerPlugin(CSSPlugin, ScrollTrigger, SplitText, TextPlugin)
	console.log('loaded 19-30')
	document.onreadystatechange = function () {
		if (document.readyState === 'complete') {
			const heroSplit = new SplitText('[da="hero-title"]', {
				type: 'lines',
			})
			const heroDescriptionSplit = new SplitText('[da="hero-description"]', {
				type: 'words',
			})

			const globalB = gsap.matchMedia()
			globalB.add('(min-width: 480px)', () => {
				// // Hero Tl
				// const heroTl = gsap.timeline({ delay: 1 })
				// heroTl.from('.page-wrapper', {
				// 	opacity: 0,
				// 	duration: 0.4,
				// })
				// heroTl.from(
				// 	'[da="hero-tag"]',
				// 	{
				// 		opacity: 0,
				// 		scale: 1.2,
				// 		duration: 0.3,
				// 	},
				// 	0
				// )
				// heroTl.from(
				// 	'.vdb_hero-title',
				// 	{
				// 		height: 0,
				// 		duration: 0.4,
				// 	},
				// 	0
				// )
				// heroTl.from(
				// 	heroSplit.lines,
				// 	{
				// 		y: '100%',
				// 		duration: 0.4,
				// 		stagger: 0.2,
				// 	},
				// 	0
				// )
				// heroTl.from(
				// 	heroDescriptionSplit.words,
				// 	{
				// 		y: '100%',
				// 		duration: 0.4,
				// 		stagger: 0.03,
				// 	},
				// 	0
				// )
				// heroTl.from(
				// 	'.success_btn',
				// 	{
				// 		opacity: 0,
				// 		y: '50%',
				// 		duration: 0.4,
				// 	},
				// 	0
				// )
				// heroTl.add(animateObg('[da="hero-card"]', 0.5, 0.2), '<')
				return
			})
		}
	}

	gsap.registerPlugin(CSSPlugin)
	// Btn

	// Функция для перемешивания массива (shuffleArray)
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
		return array
	}

	// Находим все кнопки с атрибутом [btn="primary"]
	document.querySelectorAll('[btn="primary"]').forEach(function (btn) {
		// Находим параграф внутри кнопки
		const paragraph = btn.querySelector('p')
		const mySplitText = new SplitText(paragraph, { type: 'chars' })

		const newchars = '*?ï¿½><[]&@#)(.%$-_:/\\;?!azertyuopqsdghjklmwxcvbn'.split(
			''
		)
		const randomchars = shuffleArray(newchars.slice()) // Создаем случайные символы
		const letters = shuffleArray(mySplitText.chars.slice()) // Массив символов

		// Создаем таймлайн с анимацией текста
		const tl = gsap.timeline({ paused: true, repeat: 1, yoyo: true })

		// Анимация для каждого символа
		letters.forEach(function (letter, index) {
			const randomChar =
				randomchars[Math.floor(Math.random() * randomchars.length)]
			tl.to(
				letter,
				0.02,
				{
					text: randomChar, // Устанавливаем случайный символ
					ease: 'none',
				},
				index * 0.02
			) // Задержка между анимациями символов
		})

		// Воспроизведение и реверс анимации текста при наведении
		btn.addEventListener('mouseenter', function () {
			// Анимация тени кнопки при наведении
			gsap.to(btn, {
				duration: 0.1,
				'--shadow-color': 'rgba(151, 19, 255, 1)',
				'--shadow-blur': '30px',
				ease: 'none',
			})

			// Воспроизведение анимации текста
			tl.play()
		})

		btn.addEventListener('mouseleave', function () {
			// Анимация тени кнопки при уходе курсора
			gsap.to(btn, {
				duration: 0.1,
				'--shadow-color': 'rgba(0, 0, 0, 0)',
				'--shadow-blur': '20px',
				ease: 'none',
			})

			// Реверс анимации текста
			tl.reverse()
		})
	})
	// hover nav links
	const links = document.querySelectorAll('.header_link')
	links.forEach(link => {
		const corners = link.querySelectorAll('.header_link-corner')
		link.addEventListener('mouseenter', () => {
			gsap.to(corners, {
				opacity: 1,
				duration: 0.3,
			})
			gsap.to(link, {
				color: '#878787',
			})
		})
		link.addEventListener('mouseleave', () => {
			gsap.to(corners, {
				opacity: 0,
				duration: 0.3,
			})
			gsap.to(link, {
				color: '#fff',
			})
		})
	})

	// Match media
	const addResponsiveAttribute = (selector, attributeValue) => {
		let mm = gsap.matchMedia()
		const elements = document.querySelectorAll(selector)

		const updateAttribute = () => {
			elements.forEach(element => {
				if (window.innerWidth <= 479) {
					element.setAttribute('data-corner', attributeValue)
				} else {
					element.removeAttribute('data-corner')
				}
			})
		}

		// Initial check
		updateAttribute()

		// Event listener for window resize with debounce
		const debounce = (func, delay) => {
			let timer
			return function (event) {
				if (timer) clearTimeout(timer)
				timer = setTimeout(() => {
					func()
				}, delay)
			}
		}

		window.addEventListener('resize', debounce(updateAttribute, 500))

		// Match media listener
		mm.add('(max-width: 479px)', () => {
			updateAttribute()
			return () => {
				elements.forEach(element => {
					element.removeAttribute('data-corner')
				})
			}
		})
	}

	// Пример использования для нескольких элементов
	addResponsiveAttribute('.header_menu-wrapper', '7')
	addResponsiveAttribute('.header_wrapper', '7')

	// section Spline -----------------------------------

	const burgerIcon = document.getElementById('burger-icon')
	const burgerText = document.getElementById('burger-text')
	const oldSrc = burgerIcon.getAttribute('src')
	const navbar = document.querySelector('.header_burger')

	const randomChars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	function generateRandomChar() {
		return randomChars.charAt(Math.floor(Math.random() * randomChars.length))
	}

	function animateText(fromTextElement, toText) {
		const fromText = fromTextElement.textContent
		const maxLength = Math.max(fromText.length, toText.length)
		const paddedFromText = fromText.padEnd(maxLength)

		fromTextElement.textContent = paddedFromText

		const splitFromText = new SplitText(fromTextElement, { type: 'chars' })

		let chars = splitFromText.chars

		chars.forEach((char, i) => {
			const randomChar = generateRandomChar()
			const toChar = toText[i] || ''

			gsap
				.timeline()
				.to(char, {
					duration: 0.1,
					text: randomChar,
					ease: 'none',
					delay: i * 0.1,
				})
				.to(char, { duration: 0.1, text: toChar, ease: 'none' }, '+=0.1')
		})

		// После завершения анимации удаляем добавленные пробелы
		gsap.to(
			{},
			{
				duration: 1,
				onComplete: () => {
					fromTextElement.textContent = toText
				},
			}
		)
	}

	function handleClassChange() {
		if (navbar.classList.contains('open')) {
			burgerIcon.src =
				'https://uploads-ssl.webflow.com/64623ecc086cae3d956e2081/66b52f039fa83084f160c249_burger-open-icon.svg'
			animateText(burgerText, 'close')
		} else {
			burgerIcon.src = oldSrc
			animateText(burgerText, 'menu')
		}
	}

	// Создаем MutationObserver для отслеживания изменений в классе
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if (mutation.attributeName === 'class') {
				handleClassChange()
			}
		})
	})

	observer.observe(navbar, { attributes: true })

	// Добавляем возможность переключать класс по клику для демонстрации
	navbar.addEventListener('click', () => {
		navbar.classList.toggle('open')
	})
}

document.addEventListener('DOMContentLoaded', init)
