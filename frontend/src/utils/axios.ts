import axios from 'axios';
import { IGroupInformation } from 'models/IGroupInformation';
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
/*
function sendInvitation(participants: IParticipants) {
  axios
    .post('/invite', participants)
    .then((response) => {
      console.log('Response: ', response);
    })
    .catch((error) => {
      console.log('Error: ', error);
    });
}
*/

export function generateGroups(groupInformation: IGroupInformation) {
  return axios.post('/generate', groupInformation);
}
