const cardContainer = document.querySelector(".card-container");
const filter = document.querySelector('.filter');
const search = document.querySelector('.search');
let allcountries;

fetch("https://restcountries.com/v3.1/all")
  .then((res) => res.json())
  .then((data) => {
    allcountries = data;
    renderCountries(data);
  });

filter.addEventListener('change', (e) => {
  let value = filter.value.toLowerCase();
  fetch(`https://restcountries.com/v3.1/region/${value}`)
    .then((res) => res.json())
    .then((data) => {
      allcountries = data;
      renderCountries(data);
    });
});

search.addEventListener('input', (e) => {
  let countryname = search.value.trim();
  if (countryname !== '') {
    countryname = countryname.charAt(0).toUpperCase() + countryname.slice(1);
    let filteredCountries = allcountries.filter((country) => country.name.common.includes(countryname));
    renderCountries(filteredCountries);
  } else {
    renderCountries(allcountries);
  }
});

function renderCountries(countries) {
  cardContainer.innerHTML = '';
  countries.forEach((country) => {
    const countriesCards = document.createElement("a");
    countriesCards.classList.add('country-card');
    countriesCards.href = `/country.html?name=${country.name.common}`;
    countriesCards.classList.add("countries-cards");
    countriesCards.innerHTML = `<img src="${country.flags.svg}" alt="${country.flags.alt}" class="flag">
          <div class="info">
              <h3 class="name">${country.name.common}</h3>
              <p class="population"><b>Population: </b>${country.population.toLocaleString("en-IN")}</p>
              <p class="Region"><b>Region: </b>${country.region}</p>
              <p class="capital"><b>Capital: </b>${country.capital}</p>
          </div>`;
    cardContainer.appendChild(countriesCards);
  });
}
