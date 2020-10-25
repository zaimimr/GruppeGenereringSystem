import axios from 'axios';
import { ICsvData, IFilterData, IApprovedGroupsData, ILoginCredentials } from './types';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export function setAuthHeader(token: String) {
  axios.defaults.headers.common['authorization'] = `Bearer ${token}`
}

export function sendInvitation(csvGroups: ICsvData[], eventID: String) {
  return axios.post(`/invite/${eventID}`, csvGroups);
}

export function generateGroups(groupInformation: IFilterData) {
  return axios.post('/generate', groupInformation);
}

export function sendGroups(groups: IApprovedGroupsData) {
  return axios.post('/sendgroups', groups);
}

export function login(loginCredentials: ILoginCredentials) {
  return axios.post('/login', loginCredentials);
}

export function verifyToken() {
  return axios.get('/verify');
}

export function getUserWithToken() {
  return axios.get('/user');
}
