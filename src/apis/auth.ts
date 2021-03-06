import axios from 'axios';
import authorizationInterceptor from '../utilities/authorization-interceptor';
const SERVER_DOMAIN = process.env.REACT_APP_SERVER_DOMAIN ?? '';
const authAPI = axios.create({
  baseURL: `${SERVER_DOMAIN}/api/auth`,
});

authAPI.interceptors.request.use(authorizationInterceptor);

export default authAPI;
