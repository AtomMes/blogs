import axios from 'axios';
import router from '@/router';

const userClient = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
userClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      router.push('/network-issue');
    } else {
      window.location.href = '/404';
    }
  }
);

export default {
  register (user) {
    return userClient.post('/users', user);
  },
  login (user) {
    return userClient.get(
      '/users?email=' + user.email + '&password=' + user.password
    );
  },
  checkEmailUsage (email) {
    return userClient.get('/users?email=' + email);
  },
  getUserById (id) {
    return userClient.get('/users?id=' + id);
  },
  updateUser (id, newData) {
    return userClient.patch('/users/' + id, newData);
  },
};
