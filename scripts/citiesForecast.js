// citiesForecast.js
import { capitalizeFirstLetter } from './utils.js';
import { WEATHERAPI_KEY, BASE_URL } from './config.js';

const POPULAR_CITIES = [
    "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань",
    "Нижний Новгород", "Челябинск", "Самара", "Омск", "Ростов-на-Дону",
    "Уфа", "Красноярск", "Пермь", "Воронеж", "Волгоград",
    "Краснодар", "Саратов", "Тюмень", "Тольятти", "Ижевск",
    "Барнаул", "Ульяновск", "Иркутск", "Хабаровск", "Ярославль",
    "Владивосток", "Махачкала", "Томск", "Оренбург", "Кемерово",
    "Новокузнецк", "Рязань", "Астрахань", "Набережные Челны", "Пенза",
    "Липецк", "Киров", "Чебоксары", "Тула", "Калининград",
    "Балашиха", "Курск", "Севастополь", "Сочи", "Ставрополь",
    "Улан-Удэ", "Магнитогорск", "Тверь", "Иваново", "Брянск",
    "Архангельск", "Владимир", "Симферополь", "Чита", "Грозный",
    "Курган", "Орёл", "Волжский", "Смоленск", "Мурманск",
    "Вологда", "Саранск", "Якутск", "Череповец", "Владикавказ",
    "Сургут", "Подольск", "Грозный", "Старый Оскол", "Златоуст",
    "Рыбинск", "Бийск", "Прокопьевск", "Норильск", "Шахты",
    "Нижневартовск", "Новый Уренгой", "Дзержинск", "Орск", "Сыктывкар",
    "Нижнекамск", "Ангарск", "Балаково", "Химки", "Ставрополь",
    "Мытищи", "Люберцы", "Северодвинск", "Королёв", "Электросталь",
    "Альметьевск", "Рубцовск", "Петрозаводск", "Копейск", "Майкоп",
    "Назрань", "Новороссийск", "Железнодорожный", "Кисловодск", "Димитровград",
    "Ессентуки", "Каспийск", "Нефтеюганск", "Обнинск", "Реутов",
    "Пушкино", "Жуковский", "Новочебоксарск", "Серпухов", "Армавир"
];

export async function updateCitiesForecast(currentCity) {
    try {
        // Фильтруем текущий город и выбираем 4 случайных
        const citiesToShow = POPULAR_CITIES
            .filter(city => city.toLowerCase() !== currentCity.toLowerCase())
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        // Получаем данные погоды для выбранных городов
        const forecasts = await Promise.all(
            citiesToShow.map(city => fetchCityForecast(city))
        );

        // Отображаем карточки городов
        renderCitiesForecast(forecasts);
    } catch (error) {
        console.error('Error fetching cities forecast:', error);
        // В случае ошибки показываем заглушку
        renderErrorState();
    }
}

async function fetchCityForecast(city) {
    const response = await fetch(
        `${BASE_URL}/current.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(city)}&lang=ru`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch forecast for ${city}`);
    }

    const data = await response.json();
    return {
        ...data,
        // Добавляем название города, так как API может вернуть другое название (например, для "Санкт-Петербург" → "Saint Petersburg")
        originalCityName: city
    };
}

function renderCitiesForecast(forecasts) {
    const container = document.querySelector('.cities-forecast .cards-list');
    container.innerHTML = '';

    forecasts.forEach(data => {
        if (!data || !data.location || !data.current) {
            console.warn('Invalid forecast data:', data);
            return;
        }

        const card = document.createElement('div');
        card.className = 'cities-forecast-card';
        card.innerHTML = `
            <div class="card-block">
                <img src="https:${data.current.condition.icon}" width="48px" alt="${data.current.condition.text}">
                <div>
                    <h3 class="title-card">${data.originalCityName || data.location.name}</h3>
                    <p class="forecast-desc">
                        <span class="weather-city">${capitalizeFirstLetter(data.current.condition.text)}</span>
                        <span class="higt-city">${Math.round(data.current.temp_c)}°</span>
                    </p>
                </div>
            </div>
            <div class="card-num">
                <p class="num">${Math.round(data.current.temp_c)}°</p>
            </div>
        `;

        // Добавляем обработчик клика для поиска города
        card.addEventListener('click', () => {
            const searchInput = document.querySelector('.search-input');
            searchInput.value = data.originalCityName || data.location.name;
            const enterEvent = new KeyboardEvent('keypress', { key: 'Enter' });
            searchInput.dispatchEvent(enterEvent);
        });

        container.appendChild(card);
    });

    // Добавляем кнопку "Посмотреть больше"
    const seeMore = document.createElement('a');
    seeMore.href = "#";
    seeMore.className = "see-more";
    seeMore.textContent = "Посмотреть больше";
    seeMore.addEventListener('click', (e) => {
        e.preventDefault();
        // При клике обновляем список городов
        updateCitiesForecast(document.querySelector('.city-name').textContent.split(',')[0].trim());
    });
    container.appendChild(seeMore);
}

function renderErrorState() {
    const container = document.querySelector('.cities-forecast .cards-list');
    container.innerHTML = `
        <div class="error-message">
            Не удалось загрузить данные о других городах
        </div>
        <a href="#" class="see-more">Попробовать снова</a>
    `;

    // Добавляем обработчик для кнопки "Попробовать снова"
    const retryButton = container.querySelector('.see-more');
    retryButton.addEventListener('click', (e) => {
        e.preventDefault();
        updateCitiesForecast(document.querySelector('.city-name').textContent.split(',')[0].trim());
    });
}