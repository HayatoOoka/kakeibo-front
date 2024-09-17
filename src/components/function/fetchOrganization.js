import axios from 'axios';

export default function fetchOrganizations(context) {
  axios.get('http://localhost:3001/organizations')
    .then(response => {
      context.organizations = response.data;
    })
    .catch(error => {
      console.error("There was an error fetching the organizations:", error);
    });
}
