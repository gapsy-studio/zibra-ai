import gsap from 'gsap'
import { ScrollTrigger, SplitText, TextPlugin } from 'gsap/all'
import CSSPlugin from 'gsap/CSSPlugin'

// functions

const svSwitcherChange = function () {
	const switcherWrap = document.querySelector('[sw=switcher-wrap]')
	const switcherBtn = document.querySelector('[sw=switcher]')
	const switcherTexts = document.querySelectorAll('[sw=text]')
	const switcherButton = document.querySelector('[sw=btn]')
	const switcherBtnText = switcherButton.querySelector('[sw=btn-text]')
	const swPromo = document.querySelectorAll('[data-promo-mess]')
	const activeColor = '#fff' // Фиолетовый цвет для активного текста
	let isFirstState = true

	// Инициализация начальных стилей для текста
	switcherTexts.forEach((text, index) => {
		if (index === 0) {
			gsap.set(text, { color: activeColor })
			text.classList.add('is--active')
		} else {
			gsap.set(text, { color: text.getAttribute('sw-color') })
		}
	})

	// Обработчик клика по свитчеру
	switcherWrap.addEventListener('click', () => {
		// Переключаем активный текст с анимацией
		switcherTexts.forEach(text => {
			const isActive = text.classList.contains('is--active')
			const newColor = isActive ? text.getAttribute('sw-color') : activeColor

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

		// // Управление видимостью promo-элементов
		// swPromo.forEach(promo => {
		// 	if (isFirstState) {
		// 		// При первом состоянии показываем promo
		// 		gsap.to(promo, {
		// 			opacity: 1,
		// 			duration: 0.3,
		// 			onStart: () => (promo.style.visibility = 'visible'),
		// 		})
		// 	} else {
		// 		// При втором состоянии скрываем promo
		// 		gsap.to(promo, {
		// 			opacity: 0,
		// 			duration: 0.3,
		// 			onComplete: () => (promo.style.visibility = 'hidden'),
		// 		})
		// 	}
		// })

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

		// Переключаем состояние
		isFirstState = !isFirstState
	})

	// Инициируем начальное состояние
	switcherWrap.click()
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
				heroTl.add(animateTag('[da="hero-tag"]'), '<')
				heroTl.add(animateSimpleTitle('[da="hero-title"]', 0.4, 0.2), '<')
				heroTl.add(animateDescription('[da="hero-description"]'), '<')
				heroTl.add(animateObg('[da="plans-card"]', 0.5, 0.2))

				// PROMO CODE COPY

				const promocodeBox = document.querySelector('.promocode')
				console.log(promocodeBox)

				promocodeBox.addEventListener('click', function () {
					console.log('click!!!!!!!!')
					const promocodeText =
						promocodeBox.querySelector('.promocode-text').textContent

					// Копируем текст в буфер обмена
					navigator.clipboard
						.writeText(promocodeText)
						.then(() => {
							// Показываем сообщение
							const promoMessage = document.querySelector('.promo-message')
							gsap.to(promoMessage, {
								opacity: 1,
								duration: 0.4,
							})

							// Прячем сообщение через 1 секунду
							setTimeout(() => {
								gsap.to(promoMessage, {
									opacity: 0,
									duration: 0.4,
								})
							}, 1000)
						})
						.catch(err => {
							console.error('Не удалось скопировать текст: ', err)
						})
				})

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

				return
			})
		}
	}

	gsap.registerPlugin(CSSPlugin)
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
}

document.addEventListener('DOMContentLoaded', init)
