import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

function sendInvitation(participants: any) {
  axios
    .post('/invite', participants)
    .then((response) => {
      console.log('Response: ', response);
    })
    .catch((error) => {
      console.log('Error: ', error);
    });
}
