const BASE_URL = 'https://restcountries.com';
const BASE_PARAMS = new URLSearchParams({
  fields: 'name,capital,population,flags,languages',
});

const BASE_SETTINGS = {
  method: 'GET',
};

export function fetchCountries(name) {
  const url = `${BASE_URL}/v3.1/name/${name}?${BASE_PARAMS}`;
  return fetch(url, BASE_SETTINGS)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      console.log(error);
    });
}
