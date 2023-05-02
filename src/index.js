import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const MAX_COUNTRIES = 10;

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const renderCountryList = countries => {
  const html = countries
    .map(
      country => `
    <div class="country-item">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="20"> 
      <span>${country.name.common}</span>
    </div>
  `
    )
    .join('');
  countryList.innerHTML = html;
};

const renderCountryInfo = country => {
  const { flags, name, capital, population, languages } = country;
  countryInfo.innerHTML = `
    <img src="${flags.svg}" alt="Flag of ${name.common}" width="400">
    <h2>${name.common}</h2>
    <p>Capital: ${capital[0]}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${Object.values(languages).join(', ')}</p>
  `;
};

const onInput = debounce(event => {
  const searchTerm = event.target.value.trim();
  if (!searchTerm) {
    clearAll();
    return;
  }
  fetchCountries(searchTerm)
    .then(countries => {
      if (countries.length > MAX_COUNTRIES) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length > 1) {
        renderCountryList(countries);
        clearInfo();
      } else {
        renderCountryInfo(countries[0]);
        clearList();
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      clearAll();
    });
}, DEBOUNCE_DELAY);

function clearInfo() {
  countryInfo.innerHTML = '';
}
function clearList() {
  countryList.innerHTML = '';
}

function clearAll() {
  clearInfo();
  clearList();
}

searchBox.addEventListener('input', onInput);
