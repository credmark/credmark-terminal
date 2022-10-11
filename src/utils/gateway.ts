import axios from 'axios';

function sendGetRequest(
  path: string,
  query?: Record<string, string | string[]>,
) {
  let headers;
  if (process.env.GATEWAY_API_KEY) {
    headers = { Authorization: `Bearer ${process.env.GATEWAY_API_KEY}` };
  }

  return axios({
    method: 'GET',
    headers,
    baseURL: process.env.GATEWAY_BASE_URL,
    url: path,
    params: query,
  });
}

function sendPostRequest<D>(path: string, data?: D) {
  let headers;
  if (process.env.GATEWAY_API_KEY) {
    headers = { Authorization: `Bearer ${process.env.GATEWAY_API_KEY}` };
  }

  return axios({
    headers,
    method: 'POST',
    baseURL: process.env.GATEWAY_BASE_URL,
    url: path,
    data,
  });
}

const Gateway = {
  sendGetRequest,
  sendPostRequest,
};

export default Gateway;
