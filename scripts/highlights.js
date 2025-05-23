// highlights.js


export function updateHighlights(data) {
    const highlightsData = [
        {
            title: "Ощущается как",
            value: `${Math.round(data.current.feelslike_c)}°`,
            icon: "feels-like"
        },
        {
            title: "Влажность",
            value: `${data.current.humidity}%`,
            icon: "humidity"
        },
        {
            title: "Скорость ветра",
            value: `${Math.round(data.current.wind_kph)} км/ч`,
            icon: "wind"
        },
        {
            title: "Давление",
            value: `${Math.round(data.current.pressure_mb)} мбар`,
            icon: "pressure"
        },
        {
            title: "Видимость",
            value: `${Math.round(data.current.vis_km)} км`,
            icon: "visibility"
        },
        {
            title: "UV индекс",
            value: data.current.uv,
            icon: "uv"
        }
    ];

    const cardsContainer = document.querySelector('.cards-list');
    cardsContainer.innerHTML = '';

    highlightsData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'today-highlights-card';
        card.innerHTML = `
            <div class="card-block">
                <img src="/assets/images/${item.icon}.png" width="48px" alt="${item.title}">
                <div>
                    <h3 class="title-card">${item.title}</h3>
                    <h4 class="desc-card">${item.value}</h4>
                </div>
            </div>
            <div class="card-num">
                <p class="num">${item.value}</p>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
}