import axios from 'axios';
import { IGroupInformation } from 'models/IGroupInformation';
import { GroupType } from 'views/Invitation/Invitation';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export function sendInvitation(csvGroups: GroupType[], eventID: String) {
  return axios.post(`/invite/${eventID}`, csvGroups)
}

export function generateGroups(groupInformation: IGroupInformation) {
  return axios.post('/generate', groupInformation);
}

export function sendGroups(groups: any) {
  return axios.post('/sendgroups', groups);
}
