import axios from 'axios';

/**
 * Shared Axios instance. Use it in every module's api file, e.g.
 *   // src/api/questions.js
 *   import api from './client';
 *   export const createQuestion = (data) => api.post('/questions', data).then((r) => r.data);
 *
 * It adds the login token to every request, and logs the user out
 * automatically when the server answers 401 (expired / logged out session).
 */
const api = axios.create({ baseURL: '/api' });

let getToken = () => null;
let onUnauthorized = () => {};

export function configureApi({ tokenGetter, unauthorizedHandler }) {
  getToken = tokenGetter;
  onUnauthorized = unauthorizedHandler;
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) onUnauthorized();
    return Promise.reject(err);
  }
);

/**
 * Turns an API error into { code, message, field } (SAD 4.4 format), so forms
 * can show the message next to the failing field:
 *   catch (e) { const { field, message } = apiError(e); setErrors({ [field]: message }); }
 */
export function apiError(err) {
  const e = err?.response?.data?.error;
  if (e) return { code: e.code, message: e.message, field: e.field };
  return { code: 'NETWORK_ERROR', message: 'Could not reach the server. Please try again.' };
}

export default api;
