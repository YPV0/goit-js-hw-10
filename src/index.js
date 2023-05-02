import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const MAX_COUNTRIES = 10;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const searchTerm = event.target.value.trim();
  if (!searchTerm) {
    clearAll();
    return;
  }
  fetchCountries(searchTerm).then(showResults).catch(showError);
}

function showResults(countries) {
  if (countries.length > MAX_COUNTRIES) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    clearAll();
  } else if (countries.length > 1) {
    renderCountryList(countries);
    clearInfo();
  } else {
    renderCountryInfo(countries[0]);
    clearList();
  }
}

function showError(error) {
  Notify.failure('Oops, there is no country with that name');
  clearAll();
}

function renderCountryList(countries) {
  const html = countries.map(renderCountryItem).join('');
  refs.countryList.innerHTML = html;
}

function renderCountryItem(country) {
  const { flags, name } = country;
  return `
    <div class="country-item">
      <img src="${flags.svg}" alt="Flag of ${name.common}" width="20"> 
      <span>${name.common}</span>
    </div>
  `;
}

function renderCountryInfo(country) {
  const { flags, name, capital, population, languages } = country;
  refs.countryInfo.innerHTML = `
    <img src="${flags.svg}" alt="Flag of ${name.common}" width="400">
    <h2>${name.common}</h2>
    <p>Capital: ${capital[0]}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${Object.values(languages).join(', ')}</p>
  `;
}

function clearInfo() {
  refs.countryInfo.innerHTML = '';
}

function clearList() {
  refs.countryList.innerHTML = '';
}

function clearAll() {
  clearInfo();
  clearList();
}
