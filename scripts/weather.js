document.addEventListener('DOMContentLoaded', function () {
    // Конфигурация API
    const WEATHERAPI_KEY = '30bcca91f45b4379bd9154848251103'; // Ваш ключ
    const BASE_URL = 'https://api.weatherapi.com/v1';

    // Элементы DOM
    const elements = {
        searchInput: document.querySelector('.search-input'),
        searchButton: document.querySelector('.search-button'),
        locationText: document.querySelector('.location-text'),
        cityName: document.querySelector('.city-name'),
        typeWeather: document.querySelector('.type-weather'),
        temperature: document.querySelector('.temperature'),
        currentWeatherImg: document.querySelector('.current-weather-img'),
        weatherDays: document.querySelector('.weather-days'),
        weatherSlider: document.querySelector('.weather-slider')
    };

    // Состояние приложения
    const state = {
        currentSlide: 0,
        slideInterval: null,
        forecastData: [],
        daysOfWeek: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    };

    // Инициализация
    init();

    function init() {
        setupEventListeners();
        fetchWeather('Москва');
    }

    function setupEventListeners() {
        elements.searchButton.addEventListener('click', handleSearch);
        elements.searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') handleSearch();
        });
    }

    function handleSearch() {
        const city = elements.searchInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    }

    async function fetchWeather(city) {
        try {
            showLoading();

            const response = await fetch(
                `${BASE_URL}/forecast.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(city)}&days=7&lang=ru`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Город не найден');
            }

            const data = await response.json();
            updateWeatherUI(data);
            elements.searchInput.value = capitalizeFirstLetter(city);

            // Перезапускаем слайдер с новыми данными
            startSlider();

        } catch (error) {
            console.error('Ошибка:', error);
            if (!state.forecastData.length) {
                alert(`Ошибка: ${error.mesage}. Загружаем данные для Москвы.`);
                fetchWeather('Москва');
            } else {
                alert(`Ошибка: ${error.message}. Показаны предыдущие данные.`);
            }
        }
    }

    function showLoading() {
        elements.weatherDays.innerHTML = '<div class="loading">Загрузка данных...</div>';
    }

    function updateWeatherUI(data) {
        state.forecastData = data.forecast?.forecastday || [];

        // Обновляем текущую погоду
        updateCurrentWeather(data);

        // Создаем карточки прогноза
        createWeatherCards();

        // Сбрасываем позицию слайдера
        resetSlider();
    }

    function updateCurrentWeather(data) {
        elements.locationText.textContent = `${data.location.name}, ${data.location.country}`;
        elements.cityName.textContent = `${data.location.name}, ${data.location.country}`;
        elements.typeWeather.textContent = capitalizeFirstLetter(data.current.condition.text);
        elements.temperature.textContent = `${Math.round(data.current.temp_c)}°`;
        elements.currentWeatherImg.src = `https:${data.current.condition.icon}`;
        elements.currentWeatherImg.alt = data.current.condition.text;
    }

    function createWeatherCards() {
        elements.weatherDays.innerHTML = '';

        state.forecastData.forEach((dayData, index) => {
            const date = new Date(dayData.date);
            const dayOfWeek = state.daysOfWeek[date.getDay()];

            const dayCard = document.createElement('div');
            dayCard.className = 'day-card';
            dayCard.innerHTML = `
                <div class="weather-info">
                    <img src="https:${dayData.day.condition.icon}" 
                         alt="${dayData.day.condition.text}" 
                         class="weather-img-card" />
                    <p class="degree">${Math.round(dayData.day.avgtemp_c)}°</p>
                </div>
                <div class="weather-description">
                    <p class="day">${index === 0 ? 'Сегодня' : dayOfWeek}</p>
                    <p class="desc">${capitalizeFirstLetter(dayData.day.condition.text)}</p>
                </div>
            `;

            // Анимация появления
            animateCard(dayCard, index);
            elements.weatherDays.appendChild(dayCard);
        });
    }

    function animateCard(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    }

    function startSlider() {
        if (state.slideInterval) clearInterval(state.slideInterval);
        state.currentSlide = 0;
        updateSliderPosition();

        state.slideInterval = setInterval(() => {
            state.currentSlide = (state.currentSlide + 1) % state.forecastData.length;
            updateSliderPosition();
        }, 5000);
    }



    function updateSliderPosition() {
        const cards = document.querySelectorAll('.day-card');
        if (!cards.length) return;

        const cardWidth = cards[0].offsetWidth;
        const marginRight = parseInt(getComputedStyle(cards[0]).marginRight || 0, 10);
        const fullCardWidth = cardWidth + marginRight;

        const scrollPos = state.currentSlide * fullCardWidth;

        elements.weatherDays.scrollTo({
            left: scrollPos,
            behavior: 'smooth'
        });
    }

    function resetSlider() {
        state.currentSlide = 0;
        setTimeout(() => {
            elements.weatherDays.scrollTo({ left: 0, behavior: 'auto' });
            startSlider();
        }, 300);
    }

    function capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }
});

