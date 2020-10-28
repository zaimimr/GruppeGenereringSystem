import axios from 'axios';

import { IApprovedGroupsData, ICsvData, IFilterData, ILoginCredentials, SignUpData } from './types';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export function setAuthHeader(token: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
export function sendInvitation(csvGroups: ICsvData[], eventID: string) {
  return axios.post(`/invite/${eventID}`, csvGroups);
}

export function signUp(signUpData: SignUpData) {
  return axios.post('/register', signUpData);
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
