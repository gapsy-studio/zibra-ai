import gsap from 'gsap'
import { ScrollTrigger, SplitText, TextPlugin } from 'gsap/all'
import CSSPlugin from 'gsap/CSSPlugin'
import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'

// functions

const svSwitcherChange = function () {
	const switcherWrap = document.querySelector('[sw=switcher-wrap]')
	const switcherBtn = document.querySelector('[sw=switcher]')
	const switcherTexts = document.querySelectorAll('[sw=text]')
	const switcherButton = document.querySelector('[sw=btn]')
	const switcherBtnText = switcherButton.querySelector('[sw=btn-text]')
	const messageYear = document.querySelector('[sw="message-year"]')
	console.log('Элемент [sw="message-year"] найден.')
	let isFirstState = true

	// Инициализация начальных стилей для текста
	switcherTexts.forEach((text, index) => {
		if (index === 0) {
			gsap.set(text, { color: text.getAttribute('sw-color') })
			text.classList.add('is--active')
		} else {
			gsap.set(text, { color: '#646464' })
		}
	})

	// Если элемент messageYear существует, задаем начальные стили
	if (messageYear) {
		gsap.set(messageYear, { opacity: 0, display: 'none' })
	} else {
		console.log('Элемент [sw="message-year"] не найден.')
	}

	// Обработчик клика по свитчеру
	switcherWrap.addEventListener('click', () => {
		// Переключаем активный текст с анимацией
		switcherTexts.forEach(text => {
			const isActive = text.classList.contains('is--active')
			const newColor = isActive ? '#646464' : text.getAttribute('sw-color')

			gsap.to(text, {
				color: newColor,
				duration: 0.3,
				onComplete: () => {
					text.classList.toggle('is--active')
				},
			})
		})

		// Переключаем flex-direction для свитчера с анимацией
		gsap.to(switcherBtn, {
			duration: 0.3,
			ease: 'power2.inOut',
			flexDirection: isFirstState ? 'row-reverse' : 'row',
		})

		// Переключаем текст и URL кнопки
		const btnTextOne = switcherButton.getAttribute('sw-btn-text-one')
		const btnTextTwo = switcherButton.getAttribute('sw-btn-text-two')
		const urlOne = switcherButton.getAttribute('sw-url-one')
		const urlTwo = switcherButton.getAttribute('sw-url-two')

		// Сначала устанавливаем нужный URL
		switcherButton.setAttribute('href', isFirstState ? urlTwo : urlOne)

		// Затем выполняем анимацию текста
		gsap.to(switcherBtnText, {
			duration: 0.3,
			text: {
				value: isFirstState ? btnTextTwo : btnTextOne,
				scrambleText: true, // Активация эффекта случайных символов
			},
		})

		// Если элемент messageYear существует, переключаем его состояние
		if (messageYear) {
			if (isFirstState) {
				gsap.to(messageYear, {
					opacity: 1,
					display: 'block',
					duration: 0.3,
				})
			} else {
				gsap.to(messageYear, {
					opacity: 0,
					display: 'none',
					duration: 0.3,
				})
			}
		}

		// Переключаем состояние
		isFirstState = !isFirstState
	})
}

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

				// use cases
				const casesTl = gsap.timeline({
					scrollTrigger: {
						trigger: '.section_u-cases',
						start: 'top center',
						end: 'bottom bottom',
					},
				})
				casesTl.add(animateTag('[da="u-cases-tag"]'), '<')
				casesTl.add(animateSimpleTitle('[da="u-cases-title"]', 0.4, 0.2), '<')
				casesTl.add(animateDescription('[da="u-cases-description"]'), '<')
				casesTl.add(animateObg('[da="u-cases-img"]', 1))
				casesTl.from(
					'.u-cases_tab',
					{
						opacity: 0,
						y: '100%',
						duration: 0.4,
						stagger: 0.2,
					},
					'<'
				)

				// gains animation

				const gainsTl = gsap.timeline({
					scrollTrigger: {
						trigger: '.section_gains',
						start: 'top center',
						end: 'bottom bottom',
					},
				})
				gainsTl.add(animateTag('[da="gains-tag"]'), '<')
				gainsTl.add(animateSimpleTitle('[da="gains-title"]', 0.4, 0.2), '<')
				gainsTl.add(animateDescription('[da="gains-desc"]'), '<')
				gainsTl.from(
					'.gains_card',
					{
						opacity: 0,
						y: '100%',
						duration: 0.4,
						stagger: 0.2,
					},
					'<'
				)

				// section plans
				const plansTl = gsap.timeline({
					scrollTrigger: {
						trigger: '.section_vdb-plans-hero',
						start: 'top center',
						end: 'bottom bottom',
					},
				})
				plansTl.add(animateTag('[da="plans-tag"]'), '<')
				plansTl.add(animateSimpleTitle('[da="plans-title"]', 0.4, 0.2), '<')
				plansTl.add(animateDescription('[da="plans-desc"]'), '<')
				plansTl.add(animateObg('[da="plans-card"]', 0.6, 0.2))
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

				// Fag animation
				const faqTl = gsap.timeline({
					scrollTrigger: {
						trigger: '.section_fag-vdb',
						start: 'top center',
						end: 'bottom bottom',
					},
				})
				faqTl.add(animateTag('[da="faq-tag"]'), '<')
				faqTl.add(animateSimpleTitle('[da="faq-title"]', 0.4, 0.2), '<')
				faqTl.add(animateDescription('[da="faq-descr"]'), '<')
				faqTl.fromTo(
					'.faq-vdb_content',
					{
						opacity: 0,
						duration: 0.2,
						y: '100%',
						scale: 1.2,
					},
					{
						scale: 1.2,
						opacity: 1,
						y: '0%',
					}
				)
				faqTl.to('.faq-vdb_content', {
					scale: 1,
					duration: 0.3,
				})

				// SHOWREEL BTN
				const showreelWrapper = document.querySelector('.showreel_wrapper-box')
				const showreelBtn = document.querySelector('.showreel_btn')

				// Функция для центрирования кнопки
				const centerButton = () => {
					const boxRect = showreelWrapper.getBoundingClientRect()

					// Рассчитываем центральную позицию для кнопки
					const centerX = (boxRect.width - showreelBtn.offsetWidth) / 2
					const centerY = (boxRect.height - showreelBtn.offsetHeight) / 2

					// Анимируем кнопку к центру контейнера
					gsap.to(showreelBtn, {
						x: centerX,
						y: centerY,
						duration: 0.5, // Длительность анимации при возврате в центр
						ease: 'power2.out', // Плавное затухание анимации
					})
				}

				// Центрируем кнопку при загрузке страницы
				window.addEventListener('load', centerButton)

				// Отслеживаем событие движения мыши внутри контейнера
				showreelWrapper.addEventListener('mousemove', event => {
					const boxRect = showreelWrapper.getBoundingClientRect()

					// Вычисляем позицию мыши относительно контейнера
					const mouseX = event.clientX - boxRect.left
					const mouseY = event.clientY - boxRect.top

					// Ограничиваем движение кнопки в пределах контейнера
					const btnWidth = showreelBtn.offsetWidth
					const btnHeight = showreelBtn.offsetHeight

					// Рассчитываем новые координаты для кнопки с учётом её размера, чтобы она не выходила за границы
					const newX = Math.min(
						Math.max(mouseX - btnWidth / 2, 0),
						boxRect.width - btnWidth
					)
					const newY = Math.min(
						Math.max(mouseY - btnHeight / 2, 0),
						boxRect.height - btnHeight
					)

					// Анимируем кнопку с помощью GSAP
					gsap.to(showreelBtn, {
						x: newX,
						y: newY,
						duration: 0.3, // Задаём плавность движения
						ease: 'power2.out', // Используем плавное затухание анимации
					})
				})

				// Когда курсор покидает контейнер, возвращаем кнопку в центр
				showreelWrapper.addEventListener('mouseleave', centerButton)

				return
			})
		}
	}

	gsap.registerPlugin(CSSPlugin)

	const tabs = document.querySelectorAll('.u-cases_tab')
	const contentWindow = document.querySelector('.u-cases_window-content video')
	let currentIndex = 0
	let interval
	let progressAnimations = [] // Массив для хранения анимаций прогресса

	function switchTab(index) {
		tabs.forEach((tab, i) => {
			const indicator = tab.querySelector('.indicator-box')
			const title = tab.querySelector('.u-cases-tab-title')
			const content = tab.querySelector('.u-cases-tab-text')

			const isActive = i === index

			// Обработка активного таба
			if (isActive) {
				tab.classList.add('active')

				// Анимация смены картинки
				const imagePath = tab.getAttribute('data-image')
				gsap.to(contentWindow, {
					opacity: 0,
					duration: 0.3,
					onComplete: () => {
						contentWindow.src = imagePath
						gsap.to(contentWindow, { opacity: 1, duration: 0.3 })
					},
				})

				// Анимация заголовка и контента
				gsap.to(title, { color: '#fafafa', duration: 0.3 })
				gsap.to(content, { opacity: 1, height: '100%', duration: 0.3 })

				// Анимация прогресса
				gsap.set(indicator, { width: '0%' })
				progressAnimations[i] = gsap.to(indicator, {
					width: '100%',
					duration: 5,
					ease: 'linear',
				})
			} else {
				tab.classList.remove('active')

				// Анимация для неактивных табов
				gsap.to(title, { color: '#878787', duration: 0.3 })
				gsap.to(content, { opacity: 0, height: '0', duration: 0.3 })

				// Уничтожение анимации прогресса
				if (progressAnimations[i]) {
					progressAnimations[i].kill()
					progressAnimations[i] = null
				}

				// Сброс прогресса
				gsap.set(indicator, { width: '0%' })
			}
		})
	}

	function autoSwitch() {
		currentIndex = (currentIndex + 1) % tabs.length
		switchTab(currentIndex)
	}

	tabs.forEach((tab, index) => {
		tab.addEventListener('click', () => {
			clearInterval(interval)
			switchTab(index)
			currentIndex = index
			interval = setInterval(autoSwitch, 5000)
		})
	})

	// Устанавливаем первый таб активным по умолчанию
	switchTab(currentIndex)

	// Запуск автоматического переключения каждые 5 секунд
	interval = setInterval(autoSwitch, 5000)

	// plans switcher

	svSwitcherChange()
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
