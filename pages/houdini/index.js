document.addEventListener('DOMContentLoaded', function () {
	// send form API

	const dataName = document.getElementById(
		'full_name-7ea4ae60-38fe-4cf2-bc3a-5bb59f3dc67f'
	)
	const dataEmail = document.getElementById(
		'email-7ea4ae60-38fe-4cf2-bc3a-5bb59f3dc67f'
	)
	const dataCompany = document.getElementById(
		'company-7ea4ae60-38fe-4cf2-bc3a-5bb59f3dc67f'
	)
	const dataJob = document.getElementById(
		'role-7ea4ae60-38fe-4cf2-bc3a-5bb59f3dc67f'
	)
	const dataLinkedin = document.getElementById(
		'hs_linkedin_url-7ea4ae60-38fe-4cf2-bc3a-5bb59f3dc67f'
	)
	const dataDiscord = document.getElementById(
		'discord-7ea4ae60-38fe-4cf2-bc3a-5bb59f3dc67f'
	)
	const dataSeats = document.getElementById(
		'required_n_of_seats-7ea4ae60-38fe-4cf2-bc3a-5bb59f3dc67f'
	)

	hbspt.forms.create({
		region: 'na1',
		portalId: '47159131',
		formId: '7ea4ae60-38fe-4cf2-bc3a-5bb59f3dc67f',
		onFormSubmit: function (form) {
			// Собираем данные с формы
			const data = {
				name: dataName.value,
				email: dataEmail.value,
				company: dataCompany.value,
				job_title: dataJob.value,
				linkedin: dataLinkedin.value,
				discord: dataDiscord.value,
				seats: +dataSeats.value,
				marketing_emails: false,
				policies: false,
				product: 'zibravdb',
				engine: 'houdini',
			}

			// Настройка заголовков и тела запроса для бэкенда
			const myHeaders = new Headers()
			myHeaders.append('Content-Type', 'application/json')

			const requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: JSON.stringify(data),
			}

			// Собираем auth_key, если он есть в URL
			const urlParams = new URLSearchParams(window.location.search)
			const authKey = urlParams.get('auth_key')
			let url = 'https://license.zibra.ai/api/testerForm'
			if (authKey) {
				url += `?auth_key=${authKey}`
			}

			// Отправляем данные на ваш бэкенд
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
					// Извлекаем ключ из ответа
					const match = text.match(/"api_key":\s*"([^"]+)"/)
					if (match && match[1]) {
						const apiKey = match[1]
						console.log('API Key:', apiKey)
						// Сохраняем ключ в localStorage и перенаправляем пользователя
						localStorage.setItem('apiKey', apiKey)

						// Перенаправляем пользователя на страницу загрузки
						window.location.href = `/zibravdbhoudini-download?api_key=${apiKey}`
					} else {
						throw new Error('API Key not found in response')
					}
				})
				.catch(error => {
					console.error(error)
					// В случае ошибки перенаправляем на страницу благодарности
					window.location.href = '/zibravdbhoudini-thankyou'
				})
		},
	})
})
