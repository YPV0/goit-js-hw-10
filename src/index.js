import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const MAX_COUNTRIES = 10;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const searchQuery = e.target.value.trim();

  if (searchQuery.length > 0) {
    fetchCountries(searchQuery)
      .then(countries => {
        const matchingCountries = countries.filter(country =>
          country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (matchingCountries.length >= MAX_COUNTRIES) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          clearResults();
        } else if (matchingCountries.length > 1) {
          renderCountryFlags(matchingCountries);
          clearInfo();
        } else {
          renderCountryCard(matchingCountries[0]);
        }
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        clearResults();
      });
  } else {
    clearResults();
  }
}

function renderCountryFlags(countries) {
  const flagsHtml = countries
    .map(country => createCountryFlagHtml(country))
    .join('');
  refs.list.innerHTML = flagsHtml;
}

function createCountryFlagHtml(country) {
  return `
    <div class="country-flag">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="20" height="20">
      <span>${country.name.common}</span>
    </div>
  `;
}

function renderCountryCard(country) {
  const cardHtml = createCountryCardHtml(country);
  refs.list.innerHTML = cardHtml;
  clearInfo();
}

function createCountryCardHtml(country) {
  const languages = Object.values(country.languages).join(', ');

  return `
    <div class="country-card">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="400">
      <h2>${country.name.common}</h2>
      <p><b>Capital:</b> ${country.capital[0]}</p>
      <p><b>Population:</b> ${country.population}</p>
      <p><b>Languages:</b> ${languages}</p>
    </div>
  `;
}

function clearResults() {
  refs.list.innerHTML = '';
  clearInfo();
}

function clearInfo() {
  refs.info.innerHTML = '';
}
