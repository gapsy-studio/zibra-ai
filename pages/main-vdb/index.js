import gsap from 'gsap'
import { ScrollTrigger, SplitText, TextPlugin } from 'gsap/all'
import CSSPlugin from 'gsap/CSSPlugin'
import lottie from 'lottie-web'
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
	function LottieScrollTrigger(vars) {
		let playhead = { frame: 0 },
			lottieTarget = gsap.utils.toArray(vars.lottieTarget)[0], // Контейнер для Lottie-анимации
			scrollTarget = gsap.utils.toArray(vars.scrollTarget)[0], // Контейнер для прокрутки
			speeds = { slow: '+=2000', medium: '+=1000', fast: '+=500' },
			st = {
				trigger: scrollTarget, // Прокрутка управляется этим контейнером
				start: 'top top',
				end: speeds[vars.speed] || '+=1000',
				scrub: vars.scrub || 1,
				onLeave: () => gsap.to(lottieTarget, { opacity: 0, duration: 1 }), // Когда достигается конец
				onEnterBack: () => gsap.to(lottieTarget, { opacity: 1, duration: 1 }), // Когда прокручиваем назад
			},
			ctx = gsap.context && gsap.context(),
			animation = lottie.loadAnimation({
				container: lottieTarget, // Lottie-анимация будет в этом контейнере
				renderer: vars.renderer || 'svg',
				loop: false,
				autoplay: false, // Убираем autoplay, чтобы анимация начиналась только при прокрутке
				path: vars.path,
				rendererSettings: vars.rendererSettings || {
					preserveAspectRatio: 'xMidYMid slice',
				},
			})

		for (let p in vars) {
			st[p] = vars[p] // Позволяет пользователям переопределять значения ScrollTrigger
		}

		animation.addEventListener('DOMLoaded', function () {
			let createTween = function () {
				animation.frameTween = gsap.to(playhead, {
					frame: animation.totalFrames - 1,
					ease: 'none',
					onUpdate: () => animation.goToAndStop(playhead.frame, true),
					scrollTrigger: st, // Анимация связана с прокруткой
				})
				return () => animation.destroy && animation.destroy()
			}

			ctx && ctx.add ? ctx.add(createTween) : createTween()
			ScrollTrigger.sort()
			ScrollTrigger.refresh()
		})

		return animation
	}

	let adaptive = gsap.matchMedia()
	adaptive.add('(min-width: 480px)', () => {
		// Использование вашей анимации
		LottieScrollTrigger({
			lottieTarget: '.vdb-hero_sec-vode', // Контейнер для Lottie-анимации
			scrollTarget: '.vdb-hero_scroll', // Контейнер для прокрутки
			path: 'https://uploads-ssl.webflow.com/64623ecc086cae3d956e2081/66bbc8d1ff637b2f21c5bc32_data-web-new.json', // Укажите путь к вашей JSON-анимации
			speed: 'medium',
			scrub: 1,
		})
		return
	})
	const mob25 =
		'https://uploads-ssl.webflow.com/64623ecc086cae3d956e2081/66bbcc908eb408e323b011d5_data-mob-25.json'
	const mob15 =
		'https://uploads-ssl.webflow.com/64623ecc086cae3d956e2081/66bbcba96594bebb6aac5914_sec-mob.json'

	adaptive.add('(max-width: 479px)', () => {
		// Использование вашей анимации
		LottieScrollTrigger({
			lottieTarget: '.vdb-hero_sec-vode', // Контейнер для Lottie-анимации
			scrollTarget: '.vdb-hero_scroll', // Контейнер для прокрутки
			path: mob25, // Укажите путь к вашей JSON-анимации
			speed: 'medium',
			scrub: 1,
		})
		return
	})

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

			// Hero Tl
			const heroTl = gsap.timeline({ delay: 1 })
			heroTl.from('.vdb-hero_sec-vode', {
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
				'.hero-descrption',
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
		}
	}

	gsap.registerPlugin(CSSPlugin)

	const splineTitle = document.querySelector('[data-text="spline"]')

	const splineWords = new SplitText(splineTitle, { type: 'words' })

	const splineTl = gsap.timeline({
		scrollTrigger: {
			trigger: '.vdb-about_track',
			start: 'top top',
			end: '80% center',
			scrub: 1,
		},
	})
	const splineSecTl = gsap.timeline({
		scrollTrigger: {
			trigger: '.section_vdb-about',
			start: 'top top',
			end: '80% center',
		},
	})
	splineSecTl.from(splineWords.words, {
		opacity: 0,
		y: '40%',
		stagger: 0.05,
		duration: 0.7,
		ease: 'back.inOut',
	})
	splineSecTl.from(
		'.vdb-about_bg',
		{
			opacity: 0,
			y: '40%',
			duration: 0.4,
		},
		0
	)
	splineSecTl.from(
		'.vdb-about_spline',
		{
			scale: 1.2,
			opacity: 0,
			duration: 0.4,
		},
		0
	)
	splineSecTl.from(
		'.about_s-btn',
		{
			opacity: 0,
			scale: 1.3,
			duration: 1,
			delay: 1,
		},
		0
	)
	splineTl.to(splineWords.words, {
		color: '#ffffff',
		stagger: 0.2,
		ease: 'back.inOut',
	})

	// Virtual Production
	const virtualTl = gsap.timeline({
		scrollTrigger: {
			trigger: '.section_virtual',
			start: 'top center',
			end: 'bottom bottom',
		},
	})
	virtualTl.add(animateTag('[da="virtual-tag"]'), '<')
	virtualTl.add(animateSimpleTitle('[da="virtual-title"]', 0.4, 0.2), '<')
	virtualTl.add(animateDescription('[da="virtual-description"]'), '<')
	virtualTl.add(animateObg('[da="virtual-img"]', 1))
	virtualTl.add(animateSimpleTitle('[da="virtual-text', 0.9, 0.04), '<')
	virtualTl.add(animateObg('[da="virtual-btn"]', 0.5))

	// For game animation

	const forGameTl = gsap.timeline({
		scrollTrigger: {
			trigger: '.section_for-game',
			start: 'top center',
			end: 'bottom bottom',
		},
	})
	forGameTl.add(animateTag('[da="for-game-tag"]'), '<')
	forGameTl.add(animateSimpleTitle('[da="for-game-title"]', 0.4, 0.2), '<')
	forGameTl.add(animateDescription('[da="for-game-desc"]'), '<')
	forGameTl.add(animateObg('[da="for-game-img"]', 1))
	forGameTl.add(animateSimpleTitle('[da="for-game-text"]', 0.9, 0.04), '<')
	forGameTl.add(animateObg('[da="for-game-btn"]', 0.5))

	// section_level
	const levelTl = gsap.timeline({
		scrollTrigger: {
			trigger: '.section_level',
			start: 'top center',
			end: 'bottom bottom',
		},
	})
	levelTl.add(animateTag('[da="level-tag"]'), '<')
	levelTl.add(animateSimpleTitle('[da="level-title"]', 0.4, 0.2), '<')
	levelTl.add(animateDescription('[da="level-desc"]'), '<')
	levelTl.add(animateObg('[da="level-img"]', 0.6, 0.2))

	// change images
	const buttons = document.querySelectorAll('[db]')
	const compressionBg = document.querySelector('.level_compression_bg')
	const imageCover = compressionBg.querySelector('.image-cover')
	const images = {
		20: 'https://uploads-ssl.webflow.com/64623ecc086cae3d956e2081/66bc9fcf8b6362a9720302c6_20x.avif',
		30: 'https://uploads-ssl.webflow.com/64623ecc086cae3d956e2081/66bc9fcf74f90949e434ec89_30x.avif',
		40: 'https://uploads-ssl.webflow.com/64623ecc086cae3d956e2081/66bc9fce897f6db2fc6eba6e_40x.avif',
		60: 'https://uploads-ssl.webflow.com/64623ecc086cae3d956e2081/66bc9fcf74f90949e434ecab_60x.avif',
		90: 'https://uploads-ssl.webflow.com/64623ecc086cae3d956e2081/66bc9fcf3c7c0d235134ad9a_90x.avif',
	}

	// Устанавливаем первую картинку по умолчанию
	const defaultDb = 20
	imageCover.src = images[defaultDb]
	document.querySelector(`[db="${defaultDb}"]`).classList.add('is--active')

	buttons.forEach(button => {
		button.addEventListener('click', function () {
			// Удаляем класс активности у всех кнопок
			buttons.forEach(btn => btn.classList.remove('is--active'))

			// Добавляем класс активности к нажатой кнопке
			button.classList.add('is--active')

			// Плавно меняем src картинки с помощью GSAP
			const dbValue = button.getAttribute('db')

			imageCover.src = images[dbValue]
		})
	})

	// section_benefits
	const benefitsTl = gsap.timeline({
		scrollTrigger: {
			trigger: '.section_benefits',
			start: 'top center',
			end: 'bottom bottom',
		},
	})
	benefitsTl.add(animateTag('[da="benefits-tag"]'), '<')
	benefitsTl.add(animateSimpleTitle('[da="benefits-title"]', 0.4, 0.2), '<')
	benefitsTl.add(animateDescription('[da="benefits-desc"]'), '<')
	benefitsTl.add(animateObg('[da="benefits-img"]', 0.5, 0.2))

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

	tricker.forEach(trick => {
		const duration = trick.getAttribute('duration') || 20
		const trickContent = trick.firstChild

		if (!trick) {
			return
		}

		const trickContentClone = trickContent.cloneNode(true)
		trick.append(trickContentClone)

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

			const distanceToTranslate = -1 * (gap + width)

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
	})

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

	// modal form
	console.log('modal game found')

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

	// Form Game
	const formGame = document.getElementById('wf-form-vdb-prod-game')
	const dataNameGame = document.getElementById('vdb-prod-name-game')
	const dataEmailGame = document.getElementById('vdb-prod-email-game')
	const dataCompanyGame = document.getElementById('vdb-prod-company-game')
	const dataJobGame = document.getElementById('vdb-prod-job-game')
	const dataLinkedinGame = document.getElementById('vdb-prod-linkedin-game')
	const dataDiscordGame = document.getElementById('vdb-prod-discord-game')
	const formBtnGame = document.getElementById('form-btn-game')
	const dataPolicyGame = document.getElementById('vdb-privacy-check-game')
	const dataMarketingGame = document.getElementById('vdb-market-game')

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

	// Game validate

	const validatePolicyGame = () => {
		if (!dataPolicyGame.checked) {
			addErrorMessage(dataPolicyGame, 'Privacy policy not accepted', '#FF5951')
			return false
		} else {
			removeErrorMessage(dataPolicyGame)
			return true
		}
	}

	const validateMarketingGame = () => {
		if (!dataMarketingGame.checked) {
			addErrorMessage(
				dataMarketingGame,
				'Marketing consent not accepted',
				'#FF5951'
			)
			return false
		} else {
			removeErrorMessage(dataMarketingGame)
			return true
		}
	}

	const validateNameGame = () => {
		const dataNamePath = dataNameGame.parentNode.querySelector('path')
		if (dataNameGame.value.trim() === '') {
			gsap.to(dataNamePath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(dataNameGame, 'Name is required', '#FF5951')
			return false
		} else {
			gsap.to(dataNamePath, { stroke: '#86FF76', duration: 0.5 })
			removeErrorMessage(dataNameGame)
			return true
		}
	}

	const validateEmailGame = () => {
		const dataEmailPath = dataEmailGame.parentNode.querySelector('path')
		if (
			dataEmailGame.value.trim() === '' ||
			!dataEmailGame.value.includes('@')
		) {
			gsap.to(dataEmailPath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(
				dataEmailGame,
				'The email field must contain the “@” character and not be empty',
				'#FF5951'
			)
			return false
		} else {
			gsap.to(dataEmailPath, { stroke: '#86FF76', duration: 0.5 })
			removeErrorMessage(dataEmailGame)
			return true
		}
	}

	const validateCompanyGame = () => {
		const dataCompanyPath = dataCompanyGame.parentNode.querySelector('path')
		if (dataCompanyGame.value.trim() === '') {
			gsap.to(dataCompanyPath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(dataCompanyGame, 'Company is a required field', '#FF5951')
			return false
		} else {
			gsap.to(dataCompanyPath, { stroke: '#86FF76', duration: 0.5 })
			removeErrorMessage(dataCompanyGame)
			return true
		}
	}

	const validateJobGame = () => {
		const dataJobPath = dataJobGame.parentNode.querySelector('path')
		if (dataJobGame.value.trim() === '') {
			gsap.to(dataJobPath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(dataJobGame, 'Job is a required field', '#FF5951')
			return false
		} else {
			gsap.to(dataJobPath, { stroke: '#86FF76', duration: 0.5 })
			removeErrorMessage(dataJobGame)
			return true
		}
	}

	const validateLinkedinGame = () => {
		const dataLinkedinPath = dataLinkedinGame.parentNode.querySelector('path')
		const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\//

		if (dataLinkedinGame.value.trim() === '') {
			gsap.to(dataLinkedinPath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(
				dataLinkedinGame,
				'LinkedIn is a required field',
				'#FF5951'
			)
			return false
		} else if (!linkedinRegex.test(dataLinkedinGame.value.trim())) {
			gsap.to(dataLinkedinPath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(
				dataLinkedinGame,
				'Please enter a valid LinkedIn URL',
				'#FF5951'
			)
			return false
		} else {
			gsap.to(dataLinkedinPath, { stroke: '#86FF76', duration: 0.5 })
			removeErrorMessage(dataLinkedinGame)
			return true
		}
	}

	const validateDiscordGame = () => {
		const dataDiscordPath = dataDiscord.parentNode.querySelector('path')
		if (dataDiscordGame.value.trim() === '') {
			gsap.to(dataDiscordPath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(dataDiscordGame, 'Discord is a required field', '#FF5951')
			return false
		} else {
			gsap.to(dataDiscordPath, { stroke: '#86FF76', duration: 0.5 })
			removeErrorMessage(dataDiscordGame)
			return true
		}
	}

	addInputEventListeners(dataNameGame, validateNameGame)
	addInputEventListeners(dataEmailGame, validateEmailGame)
	addInputEventListeners(dataCompanyGame, validateCompanyGame)
	addInputEventListeners(dataJobGame, validateJobGame)
	addInputEventListeners(dataLinkedinGame, validateLinkedinGame)
	addInputEventListeners(dataDiscordGame, validateDiscordGame)

	formBtnGame.addEventListener('click', event => {
		let valid = true

		// Валидация каждого поля
		if (!validateNameGame()) valid = false
		if (!validateEmailGame()) valid = false
		if (!validateCompanyGame()) valid = false
		if (!validateJobGame()) valid = false
		if (!validateLinkedinGame()) valid = false
		if (!validateDiscordGame()) valid = false
		if (!validatePolicyGame()) valid = false
		if (!validateMarketingGame()) valid = false

		// Если форма не валидна, не отправляем её
		if (!valid) {
			event.preventDefault() // Останавливаем отправку формы, если валидация не пройдена
			return false
		}
	})
}

document.addEventListener('DOMContentLoaded', init)
