export function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

export function getRandomCities(cities, count) {
    const shuffled = [...cities].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}