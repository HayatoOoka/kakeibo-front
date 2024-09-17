import axios from 'axios';

export default function deleteOrganization(context, id) {
  axios.delete(`http://localhost:3001/organizations/${id}`)
    .then(() => {
      context.organizations = context.organizations.filter(org => org.id !== id);
    })
    .catch(error => {
      console.error("There was an error deleting the organization:", error);
    });
}
