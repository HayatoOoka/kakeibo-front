import axios from 'axios';

export default function createOrganization(newOrganization) {
  return axios.post('http://localhost:3001/organizations', { organization: newOrganization })
    .then(response => response.data)
    .catch(error => {
      console.error("There was an error creating the organization:", error);
      throw error;
    });
}
