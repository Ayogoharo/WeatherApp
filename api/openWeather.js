import axios from 'axios';

import { apiKey } from '../constants';

const baseUrl = 'https://api.openweathermap.org';
const locationEndpoint = params =>
  `${baseUrl}/geo/1.0/direct?q=${params.q}&limit=${params.limit}&appid=${apiKey}`;
const weatherEndpoint = params =>
`${baseUrl}/data/3.0/onecall?lat=${params.lat}&lon=${params.lon}&appid=${apiKey}&units=${params.units}`;

const apiCall = async (endpoint) => {
  const options = {
    method: 'GET',
    url: endpoint,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const fetchLocation = params => {
  return apiCall(locationEndpoint(params));
};

export const fetchWeather = (params) => {
  return apiCall(weatherEndpoint(params));
};
