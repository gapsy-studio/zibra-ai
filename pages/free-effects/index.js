import gsap from 'gsap'
import { ScrollTrigger, SplitText, TextPlugin } from 'gsap/all'
import CSSPlugin from 'gsap/CSSPlugin'
import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'

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
	console.log('loaded')

	function duringLoading() {
		const preloaderObj = { count: 0 }
		const showPreloaderNum = (selector, obj) => {
			const el = document.querySelector(selector)
			el.textContent = `${Math.floor(obj.count)}%`
		}

		const updateProgressBar = (selector, obj) => {
			const progressBar = document.querySelector(selector)
			progressBar.style.width = `${obj.count}%`
		}
		gsap.to(preloaderObj, {
			count: 100,
			onUpdate: function () {
				showPreloaderNum('.preloader_num', preloaderObj)
				updateProgressBar('.preloader_progress', preloaderObj)
			},
		})
	}

	// Обработка скрытия прелоадера после полной загрузки
	function hidePreloader() {
		const preloader = document.querySelector('.preloader')
		gsap.to(preloader, {
			delay: 1,
			opacity: 0,
			duration: 0.5,
			onComplete: function () {
				preloader.style.display = 'none'
			},
		})
		console.log('prelaoder finish!')
	}

	// Вызываем функцию во время загрузки страницы
	duringLoading()

	// Добавляем обработчик для события полной загрузки страницы
	document.onreadystatechange = function () {
		if (document.readyState === 'complete') {
			hidePreloader()

			const heroSplit = new SplitText('[da="hero-title"]', {
				type: 'lines',
			})
			const heroDescriptionSplit = new SplitText('[da="hero-description"]', {
				type: 'words',
			})

			const globalB = gsap.matchMedia()
			globalB.add('(min-width: 480px)', () => {
				// Hero Tl
				const heroTl = gsap.timeline({ delay: 1 })
				heroTl.from('.v-prod-bg-video', {
					scale: 1.1,
					opacity: 0,
					duration: 0.4,
				})
				heroTl.from(
					'[da="hero-tag"]',
					{
						opacity: 0,
						scale: 1.2,
						duration: 0.3,
					},
					'0.4'
				)
				heroTl.from(
					'.vdb_hero-title',
					{
						height: 0,
						duration: 0.4,
					},
					'0.4'
				)
				heroTl.from(
					heroSplit.lines,
					{
						y: '100%',
						duration: 0.4,
						stagger: 0.2,
					},
					'0.4'
				)
				heroTl.from(
					heroDescriptionSplit.words,
					{
						y: '100%',
						duration: 0.4,
						stagger: 0.03,
					},
					'0.4'
				)
				heroTl.from(
					'[da="v-prod-hero-description"]',
					{
						height: 0,
						duration: 0.5,
					},
					'0.4'
				)
				heroTl.from(
					'[da="hero-btn"]',
					{
						opacity: 0,
						scale: 1.2,
						duration: 0.5,
					},
					'0.4'
				)
				// section features
				const aspectsTl = gsap.timeline({
					scrollTrigger: {
						trigger: '.section_aspects',
						start: 'top center',
						end: 'bottom bottom',
					},
				})
				aspectsTl.add(animateTag('[da="aspects-tag"]'), '<')
				aspectsTl.add(animateSimpleTitle('[da="aspects-title"]', 0.4, 0.2), '<')
				aspectsTl.add(animateDescription('[da="aspects-desc"]'), '<')
				aspectsTl.add(animateObg('[da="aspects-img"]', 0.5, 0.2))

				// CHOOSE SECTION
				const chooseTl = gsap.timeline({
					scrollTrigger: {
						trigger: '.section_choose',
						start: 'top center',
						end: 'bottom bottom',
					},
				})
				chooseTl.add(animateTag('[da="choose-tag"]'), '<')
				chooseTl.add(animateSimpleTitle('[da="choose-title"]', 0.4, 0.2), '<')
				chooseTl.add(animateDescription('[da="choose-desc"]'), '<')
				chooseTl.add(animateObg('[da="choose-img"]', 0))
				chooseTl.from(
					'[da="choose-card"]',
					{
						opacity: 0,
						y: '100%',
						duration: 0.4,
						stagger: 0.2,
					},
					'<'
				)

				// Reviews
				const reviewsTl = gsap.timeline({
					scrollTrigger: {
						trigger: '.section_reviews',
						start: 'top center',
						end: 'bottom bottom',
					},
				})
				reviewsTl.add(animateTag('[da="reviews-tag"]'), '<')
				reviewsTl.add(animateSimpleTitle('[da="reviews-title"]', 0.4, 0.2), '<')
				reviewsTl.add(animateDescription('[da="reviews-descr"]'), '<')
				return
			})
		}
	}

	gsap.registerPlugin(CSSPlugin)

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
	// run line component animation----------------------------------------------------------------
	const tricker = document.querySelectorAll(`[wb-data="line-01"]`)
	const trickerReverse = document.querySelectorAll('[wb-data="line-reverse"]')
	const createAnimation = (trick, reverse = false) => {
		const duration = trick.getAttribute('duration') || 20
		const trickContent = trick.firstChild

		if (!trickContent) {
			return console.log(
				reverse ? 'trick reverse not found' : 'trick not found'
			)
		}

		const trickContentClone = trickContent.cloneNode(true)

		// Используем prepend для реверсированной линии, чтобы клон был до оригинального элемента
		reverse ? trick.prepend(trickContentClone) : trick.append(trickContentClone)

		let tween

		const playLine = () => {
			let progress = tween ? tween.progress() : 0
			tween && tween.progress(0).kill()

			const width = parseInt(
				getComputedStyle(trickContent).getPropertyValue('width'),
				10
			)
			const gap = parseInt(
				getComputedStyle(trickContent).getPropertyValue('column-gap'),
				10
			)

			const distanceToTranslate = reverse ? gap + width : -1 * (gap + width)

			tween = gsap.fromTo(
				trick.children,
				{ x: 0 },
				{ x: distanceToTranslate, duration, ease: 'none', repeat: -1 }
			)
			tween.progress(progress)
			console.log({ width })
		}

		playLine()

		function debounce(func) {
			var timer
			return function (event) {
				if (timer) clearTimeout(timer)
				timer = setTimeout(
					() => {
						func()
					},
					500,
					event
				)
			}
		}

		window.addEventListener('resize', debounce(playLine))
	}

	// Запускаем анимации для обычной линии
	tricker.forEach(trick => createAnimation(trick))

	// Запускаем анимации для обратной линии (с параметром reverse = true)
	trickerReverse.forEach(trick => createAnimation(trick, true))

	// slider ---------------------------------------------------------------------------------

	const swiper = new Swiper('.reviews_slider', {
		slidesPerView: 'auto',
		modules: [Navigation],
		navigation: {
			nextEl: '[data-slide="next"]',
			prevEl: '[data-slide="prev"]',
		},
		breakpoints: {
			479: {
				slidesPerView: 'auto',
			},
		},
		on: {
			init: function () {
				updatePagination(this)
			},
			slideChange: function () {
				updatePagination(this)
			},
		},
	})
	function updatePagination(swiper) {
		const mm = gsap.matchMedia()
		const paginationText = document.querySelector('.pagination_text')
		if (paginationText) {
			mm.add('(min-width: 480px)', () => {
				paginationText.textContent = `${swiper.realIndex + 2}/${
					swiper.slides.length
				}`
				return
			})
			mm.add('(max-width: 479px)', () => {
				paginationText.textContent = `${swiper.realIndex + 1}/${
					swiper.slides.length
				}`
				return
			})
		}
	}

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

	// modal form

	const btnsModal = document.querySelectorAll('[data-form="open"]')
	const modal = document.querySelector('.vdb-p_modal')
	const modalClose = document.querySelector('[data-form="close"]')
	btnsModal.forEach(btn => {
		btn.addEventListener('click', () => {
			modal.style.display = 'flex'
			gsap.to(modal, {
				opacity: 1,
				duration: 0.5,
			})
		})
	})
	modalClose.addEventListener('click', () => {
		gsap.to(modal, {
			opacity: 0,
			duration: 0.5,
			onComplete: function () {
				// Скрываем элемент после завершения анимации
				modal.style.display = 'none'
			},
		})
	})

	const btnsModalGame = document.querySelectorAll('[data-form-game="open"]')
	const modalGame = document.querySelector('.vdb-p_modal-game')
	const modalCloseGame = document.querySelector('[data-form-game="close"]')
	btnsModalGame.forEach(btn => {
		btn.addEventListener('click', () => {
			modalGame.style.display = 'flex'
			gsap.to(modalGame, {
				opacity: 1,
				duration: 0.5,
			})
		})
	})
	modalCloseGame.addEventListener('click', () => {
		gsap.to(modalGame, {
			opacity: 0,
			duration: 0.5,
			onComplete: function () {
				// Скрываем элемент после завершения анимации
				modalGame.style.display = 'none'
			},
		})
	})

	// Labels animation
	const inputs = document.querySelectorAll('.alpha-input')
	const labels = document.querySelectorAll('.alpha-input-label')

	inputs.forEach((input, index) => {
		const label = labels[index]
		const svgElement = input.parentNode.querySelector('svg')
		const pathElement = svgElement.querySelector('path')

		input.addEventListener('focus', () => {
			if (!input.value) {
				gsap.to(label, {
					color: '#878787',
					fontSize: '0.5em',
					transform: 'translateY(0%)',
					top: '0.75em',
					left: '2.125em',
					duration: 0.3,
				})
				gsap.to(pathElement, { stroke: '#878787', duration: 0.5 })
			}
		})

		input.addEventListener('blur', () => {
			if (!input.value) {
				gsap.to(label, {
					color: '#ffffff',
					fontSize: '1em',
					top: '50%',
					left: '1.0625em',
					transform: 'translateY(-50%)',
					duration: 0.3,
				})
				gsap.to(pathElement, { stroke: 'none', duration: 0.5 })
			}
		})

		input.addEventListener('input', () => {
			if (input.value) {
				gsap.to(label, {
					color: '#878787',
					fontSize: '0.5em',
					transform: 'translateY(0%)',
					left: '2.125em',
					top: '0.75em',
					duration: 0.3,
				})
				gsap.to(pathElement, { stroke: '#878787', duration: 0.5 })
			} else {
				gsap.to(label, {
					color: '#ffffff',
					fontSize: '1em',
					top: '50%',
					left: '1.0625em',
					transform: 'translateY(-50%)',
					duration: 0.3,
				})
			}
		})
	})

	// checkbox animation

	const checkboxes = document.querySelectorAll(
		'.alpha-check-box input[type="checkbox"]'
	)

	checkboxes.forEach(checkbox => {
		const svgPath = checkbox.parentElement.querySelector('.checkbox-path')
		const checkMark = checkbox.parentElement.querySelector('.checkbox-check')

		checkbox.addEventListener('change', function () {
			if (checkbox.checked) {
				gsap.to(svgPath, { fill: '#ffffff', stroke: 'none', duration: 0.3 })
				gsap.to(checkMark, { fill: '#000', duration: 0.3 })
			} else {
				gsap.to(svgPath, { fill: 'none', stroke: '#878787', duration: 0.3 })
				gsap.to(checkMark, { fill: 'none', duration: 0.3 })
			}
		})

		checkbox.parentElement.addEventListener('click', function () {
			checkbox.checked = !checkbox.checked
			checkbox.dispatchEvent(new Event('change'))
		})
	})

	// Валидация инпутов

	const form = document.getElementById('wf-form-vdb-prod')
	const dataName = document.getElementById('vdb-prod-name')
	const dataEmail = document.getElementById('vdb-prod-email')
	const dataCompany = document.getElementById('vdb-prod-company')
	const dataJob = document.getElementById('vdb-prod-job')
	const dataLinkedin = document.getElementById('vdb-prod-linkedin')
	const dataDiscord = document.getElementById('vdb-prod-discord')
	const formBtn = document.getElementById('form-btn')
	const dataPolicy = document.getElementById('vdb-privacy-check')
	const dataMarketing = document.getElementById('vdb-market')

	const validatePolicy = () => {
		if (!dataPolicy.checked) {
			addErrorMessage(dataPolicy, 'Privacy policy not accepted', '#FF5951')
			return false
		} else {
			removeErrorMessage(dataPolicy)
			return true
		}
	}

	const validateMarketing = () => {
		if (!dataMarketing.checked) {
			addErrorMessage(
				dataMarketing,
				'Marketing consent not accepted',
				'#FF5951'
			)
			return false
		} else {
			removeErrorMessage(dataMarketing)
			return true
		}
	}

	const removeErrorMessage = element => {
		const wrapper = element.closest('.input_wrapper')
		const errorMessage = wrapper.querySelector('.input-message')
		if (errorMessage) {
			errorMessage.remove()
		}
	}

	const addErrorMessage = (element, message, color) => {
		const wrapper = element.closest('.input_wrapper')
		removeErrorMessage(element)
		const messageDiv = document.createElement('div')
		messageDiv.className = 'input-message'
		messageDiv.style.color = color
		messageDiv.textContent = message
		wrapper.appendChild(messageDiv)
	}

	const addInputEventListeners = (element, validateFunction) => {
		element.addEventListener('input', validateFunction)
		element.addEventListener('blur', validateFunction)
		element.addEventListener('focusout', validateFunction)
	}

	const validateName = () => {
		const dataNamePath = dataName.parentNode.querySelector('path')
		if (dataName.value.trim() === '') {
			gsap.to(dataNamePath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(dataName, 'Name is required', '#FF5951')
			return false
		} else {
			gsap.to(dataNamePath, { stroke: '#86FF76', duration: 0.5 })
			removeErrorMessage(dataName)
			return true
		}
	}

	const validateEmail = () => {
		const dataEmailPath = dataEmail.parentNode.querySelector('path')
		if (dataEmail.value.trim() === '' || !dataEmail.value.includes('@')) {
			gsap.to(dataEmailPath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(
				dataEmail,
				'The email field must contain the “@” character and not be empty',
				'#FF5951'
			)
			return false
		} else {
			gsap.to(dataEmailPath, { stroke: '#86FF76', duration: 0.5 })
			removeErrorMessage(dataEmail)
			return true
		}
	}

	const validateCompany = () => {
		const dataCompanyPath = dataCompany.parentNode.querySelector('path')
		if (dataCompany.value.trim() === '') {
			gsap.to(dataCompanyPath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(dataCompany, 'Company is a required field', '#FF5951')
			return false
		} else {
			gsap.to(dataCompanyPath, { stroke: '#86FF76', duration: 0.5 })
			removeErrorMessage(dataCompany)
			return true
		}
	}

	const validateJob = () => {
		const dataJobPath = dataJob.parentNode.querySelector('path')
		if (dataJob.value.trim() === '') {
			gsap.to(dataJobPath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(dataJob, 'Job is a required field', '#FF5951')
			return false
		} else {
			gsap.to(dataJobPath, { stroke: '#86FF76', duration: 0.5 })
			removeErrorMessage(dataJob)
			return true
		}
	}

	const validateLinkedin = () => {
		const dataLinkedinPath = dataLinkedin.parentNode.querySelector('path')
		const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\//

		if (dataLinkedin.value.trim() === '') {
			gsap.to(dataLinkedinPath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(dataLinkedin, 'LinkedIn is a required field', '#FF5951')
			return false
		} else if (!linkedinRegex.test(dataLinkedin.value.trim())) {
			gsap.to(dataLinkedinPath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(
				dataLinkedin,
				'Please enter a valid LinkedIn URL',
				'#FF5951'
			)
			return false
		} else {
			gsap.to(dataLinkedinPath, { stroke: '#86FF76', duration: 0.5 })
			removeErrorMessage(dataLinkedin)
			return true
		}
	}

	const validateDiscord = () => {
		const dataDiscordPath = dataDiscord.parentNode.querySelector('path')
		if (dataDiscord.value.trim() === '') {
			gsap.to(dataDiscordPath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(dataDiscord, 'Discord is a required field', '#FF5951')
			return false
		} else {
			gsap.to(dataDiscordPath, { stroke: '#86FF76', duration: 0.5 })
			removeErrorMessage(dataDiscord)
			return true
		}
	}

	addInputEventListeners(dataName, validateName)
	addInputEventListeners(dataEmail, validateEmail)
	addInputEventListeners(dataCompany, validateCompany)
	addInputEventListeners(dataJob, validateJob)
	addInputEventListeners(dataLinkedin, validateLinkedin)
	addInputEventListeners(dataDiscord, validateDiscord)

	formBtn.addEventListener('click', event => {
		let valid = true

		// Валидация каждого поля
		if (!validateName()) valid = false
		if (!validateEmail()) valid = false
		if (!validateCompany()) valid = false
		if (!validateJob()) valid = false
		if (!validateLinkedin()) valid = false
		if (!validateDiscord()) valid = false
		if (!validatePolicy()) valid = false
		if (!validateMarketing()) valid = false

		// Если форма не валидна, не отправляем её
		if (!valid) {
			event.preventDefault() // Останавливаем отправку формы, если валидация не пройдена
			return false
		}
	})
}

document.addEventListener('DOMContentLoaded', init)
