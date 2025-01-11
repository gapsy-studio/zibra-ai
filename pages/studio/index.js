import { gsap } from 'gsap/all'

document.addEventListener('DOMContentLoaded', function () {
	const customSelect = document.getElementById('custom-select')
	const trigger = document.getElementById('custom-select-trigger')
	const triggerText = document.getElementById('trigger-text')
	const options = customSelect.querySelector('.alpha-select_options')
	const optionItems = customSelect.querySelectorAll('.alpha-option-wrapper')
	const hiddenInput = document.getElementById('selected-option')
	const selectIcon = document.querySelector('.alpha-select-icon')

	trigger.addEventListener('click', function (e) {
		e.stopPropagation()
		const isOpen = customSelect.classList.toggle('open')
		if (isOpen) {
			gsap.set(options, { height: 'auto' })
			const targetHeight = options.scrollHeight
			gsap.set(options, { height: 0 })
			gsap.to(options, { height: targetHeight, opacity: 1, duration: 0.3 })
			gsap.to(selectIcon, {
				rotation: 180,
				duration: 0.4,
			})
		} else {
			gsap.to(options, { height: 0, opacity: 0, duration: 0.3 })
			gsap.to(selectIcon, {
				rotation: 0,
				duration: 0.4,
			})
		}
	})

	optionItems.forEach(function (option) {
		option.addEventListener('click', function () {
			const value = option.getAttribute('data-value')
			const text = option.textContent
			hiddenInput.value = value
			console.log(`Updated hiddenInput value: ${hiddenInput.value}`)
			triggerText.textContent = text
			console.log(`Selected value: ${value}`)
			customSelect.classList.remove('open')
			gsap.to(options, { height: 0, opacity: 0, duration: 0.3 })
			gsap.to(selectIcon, {
				rotation: 0,
				duration: 0.4,
			})
		})
	})

	document.addEventListener('click', function (e) {
		if (!customSelect.contains(e.target)) {
			customSelect.classList.remove('open')
			gsap.to(options, { height: 0, opacity: 0, duration: 0.3 })
		}
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
				// gsap.to(pathElement, { stroke: '#FF5951', duration: 0.5 })
			}
		})
	})

	// info animation
	const infoIcons = document.querySelectorAll('.info-icon')

	infoIcons.forEach(icon => {
		const content = icon.querySelector('.info-content')

		icon.addEventListener('mouseenter', () => {
			gsap.to(content, { display: 'flex', opacity: 1, duration: 0.3 })
		})

		icon.addEventListener('mouseleave', () => {
			gsap.to(content, {
				opacity: 0,
				duration: 0.3,
				onComplete: () => gsap.set(content, { display: 'none' }),
			})
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

	// send form API

	const form = document.getElementById('wf-form-alpha-form') // замените 'your-form-id' на ID вашей формы
	// Form elements

	const dataName = document.getElementById('alpha-name')
	const dataEmail = document.getElementById('alpha-email')
	const dataCompany = document.getElementById('alpha-company')
	const dataJob = document.getElementById('alpha-job')
	const dataLinkedin = document.getElementById('alpha-linkedin')
	const dataDiscord = document.getElementById('alpha-discord')
	const dataSeats = document.getElementById('selected-option')
	const dataPolicy = document.getElementById('privacy-check')
	const dataMarketing = document.getElementById('consent')
	const formBtn = document.getElementById('form-btn')

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

	// Обработчики для удаления сообщений об ошибках при изменении инпутов
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
			addErrorMessage(dataName, 'Field is filled in correctly', '#86FF76')
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
			addErrorMessage(dataEmail, 'Field is filled in correctly', '#86FF76')
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
			addErrorMessage(dataCompany, 'Field is filled in correctly', '#86FF76')
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
			addErrorMessage(dataJob, 'Field is filled in correctly', '#86FF76')
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
			addErrorMessage(dataLinkedin, 'Field is filled in correctly', '#86FF76')
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
			addErrorMessage(dataDiscord, 'Field is filled in correctly', '#86FF76')
			return true
		}
	}
	const validateSeats = () => {
		const dataSeatsPath = document.getElementById('select_svg')
		const selectWrapper = document.querySelector('.alpha-form-select')
		const dataSeatsValue = Number(hiddenInput.value)

		if (hiddenInput.value.trim() === '') {
			gsap.to(dataSeatsPath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(selectWrapper, 'Seats is a required field', '#FF5951')
			return false
		} else if (isNaN(dataSeatsValue) || dataSeatsValue < 1) {
			gsap.to(dataSeatsPath, { stroke: '#FF5951', duration: 0.5 })
			addErrorMessage(selectWrapper, "Seats can't be less than 1", '#FF5951')
			return false
		} else {
			gsap.to(dataSeatsPath, { stroke: '#86FF76', duration: 0.5 })
			addErrorMessage(selectWrapper, 'Field is filled in correctly', '#86FF76')
			return true
		}
	}

	addInputEventListeners(dataName, validateName)
	addInputEventListeners(dataEmail, validateEmail)
	addInputEventListeners(dataCompany, validateCompany)
	addInputEventListeners(dataJob, validateJob)
	addInputEventListeners(dataLinkedin, validateLinkedin)
	addInputEventListeners(dataDiscord, validateDiscord)
	addInputEventListeners(hiddenInput, validateSeats)

	formBtn.addEventListener('click', event => {
		let valid = true

		// Валидация каждого поля
		if (!validateName()) valid = false
		if (!validateEmail()) valid = false
		if (!validateCompany()) valid = false
		if (!validateJob()) valid = false
		if (!validateLinkedin()) valid = false
		if (!validateDiscord()) valid = false
		if (!validateSeats()) valid = false
		// check Boxes validation

		if (!dataPolicy.checked) {
			valid = false
			addErrorMessage(dataPolicy, 'Privacy policy not accepted', '#FF5951')
			// Добавьте здесь код для визуальной индикации ошибки, если нужно
		} else {
			removeErrorMessage(dataPolicy)
		}
		if (!dataMarketing.checked) {
			valid = false
			addErrorMessage(
				dataMarketing,
				'Marketing consent not accepted',
				'#FF5951'
			)
			// Добавьте здесь код для визуальной индикации ошибки, если нужно
		} else {
			removeErrorMessage(dataMarketing)
		}

		// Если форма не валидна, не отправляем её
		if (!valid) {
			return false
		}

		// Отключить кнопку отправки
		formBtn.classList.add('disabled')

		// Если форма валидна, можно отправить её
		if (valid) {
			// API zibra
			const formData = JSON.stringify({
				name: dataName.value,
				email: dataEmail.value,
				company: dataCompany.value,
				job_title: dataJob.value,
				linkedin: dataLinkedin.value,
				discord: dataDiscord.value,
				seats: +dataSeats.value,
				policies: dataPolicy.checked,
				marketing_emails: dataMarketing.checked,
				product: 'zibravdb',
				engine: 'unreal',
			})

			const myHeaders = new Headers()
			myHeaders.append('Content-Type', 'application/json')

			const requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: formData,
			}

			const urlParams = new URLSearchParams(window.location.search)
			const authKey = urlParams.get('auth_key')
			let url = 'https://license.zibra.ai/api/testerForm'
			if (authKey) {
				url += `?auth_key=${authKey}`
			}

			fetch(url, requestOptions)
				.then(response => {
					if (response.status === 201) {
						return response.text() // Получаем текстовый ответ
					} else {
						throw new Error('Failed to create resource')
					}
				})
				.then(text => {
					console.log('Response Text:', text)
					// Пример извлечения ключа из текстового ответа
					// Предположим, что ключ находится в ответе в формате '"api_key": "your_key_here"'
					const match = text.match(/"api_key":\s*"([^"]+)"/)
					if (match && match[1]) {
						const apiKey = match[1]
						console.log('API Key:', apiKey)
						// Сохраняем ключ в localStorage и перенаправляем пользователя
						localStorage.setItem('apiKey', apiKey)

						window.location.href = `/zibravdbstudio-download?api_key=${apiKey}`
					} else {
						throw new Error('API Key not found in response')
					}
				})
				.catch(error => {
					console.error(error)
					window.location.href = '/zibravdbstudio-thankyou'
				})
				.finally(() => {
					formBtn.classList.remove('disabled')
					console.log('btn was disabled. but now in not it')
				})
		}
	})

	// select option hover

	document.querySelectorAll('.alpha-option-wrapper').forEach(wrapper => {
		wrapper.addEventListener('mouseenter', () => {
			gsap.to(wrapper.querySelector('.alpga-option-label'), { color: '#fff' })
		})

		wrapper.addEventListener('mouseleave', () => {
			gsap.to(wrapper.querySelector('.alpga-option-label'), {
				color: '#878787',
			})
		})
	})

	// UI element states

	// Btn

	const btnAlpha = document.querySelector('[btn="primary"]')

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
})
