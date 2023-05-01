import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const searchQuery = e.target.value.trim();
  if (searchQuery.length > 0) {
    fetchCountries(searchQuery).then(countries => {
      const matchingCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchingCountries.length > 1) {
        renderCountryFlags(matchingCountries);
        refs.info.innerHTML = '';
      } else {
        renderCountryCards(matchingCountries);
      }
    });
  } else {
    clearResults();
  }
}

function renderCountryFlags(countries) {
  const markup = countries.map(country => countryFlagTpl(country)).join('');
  refs.list.innerHTML = markup;
}

function renderCountryCards(countries) {
  const markup = countries.map(country => countryCardTpl(country)).join('');
  refs.list.innerHTML = markup;
  refs.info.innerHTML = '';
}

function countryFlagTpl(country) {
  return `
    <div class="country-flag">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="20" height="20">
      <span>${country.name.common}</span>
    </div>
  `;
}

function countryCardTpl(country) {
  const languages = Object.values(country.languages).join(', ');
  return `
    <div class="country-card">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}">
      <h2>${country.name.common}</h2>
      <p><b>Capital:</b> ${country.capital[0]}</p>
      <p><b>Population:</b> ${country.population}</p>
      <p><b>Languages:</b> ${languages}</p>
    </div>
  `;
}

function clearResults() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}
