import axios from 'axios';
import { ICsvData, IFilterData, IApprovedGroupsData } from './types';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export function sendInvitation(csvGroups: ICsvData[], eventID: String) {
  return axios.post(`/invite/${eventID}`, csvGroups)
}

export function generateGroups(groupInformation: IFilterData) {
  return axios.post('/generate', groupInformation);
}

export function sendGroups(groups: IApprovedGroupsData) {
  return axios.post('/sendgroups', groups);
}
