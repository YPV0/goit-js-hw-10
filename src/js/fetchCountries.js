export function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com';
  const BASE_SETTINGS = {
    method: 'GET',
  };
  const BASE_PARAMS = new URLSearchParams({
    fields: 'name,capital,population,flags,languages',
  });
  return fetch(`${BASE_URL}/v3.1/name/${name}?${BASE_PARAMS}`, BASE_SETTINGS)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.log(error);
    });
}
