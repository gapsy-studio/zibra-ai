// Функция для выполнения задачи
function updateBannerDisplay() {
	// Находим элемент с классом banner-marker
	const bannerMarker = document.querySelector('.banner-marker')

	if (bannerMarker) {
		// Получаем значение атрибута data-marker
		const markerValue = bannerMarker.getAttribute('data-banner')

		// Условие проверки значения атрибута data-marker
		if (
			markerValue ===
			'ZibraVDB Showcase — Car Accident Demo: Real-Time VDB Rendering for Games'
		) {
			// Находим все элементы с классом .banner и устанавливаем им display: block
			document.querySelectorAll('.banner').forEach((banner) => {
				banner.style.display = 'block'
			})

			// Устанавливаем display: none для элементов с id #banner-01 и #banner-02
			document.getElementById('banner-01').style.display = 'none'
			document.getElementById('banner-02').style.display = 'none'
		} else {
			// Устанавливаем display: none для всех элементов с классом .banner
			document.querySelectorAll('.banner').forEach((banner) => {
				banner.style.display = 'none'
			})

			// Устанавливаем display: flex для элементов с id #banner-01 и #banner-02
			document.getElementById('banner-01').style.display = 'flex'
			document.getElementById('banner-02').style.display = 'flex'
		}
	} else {
		console.error('Элемент с классом .banner-marker не найден')
	}
}

// Вызов функции при загрузке страницы
document.addEventListener('DOMContentLoaded', updateBannerDisplay)
