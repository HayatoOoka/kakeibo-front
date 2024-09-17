import axios from 'axios';

export default function updateOrganization(context, organization) {
  axios.put(`http://localhost:3001/organizations/${organization.id}`, { organization })
    .then(response => {
      const index = context.organizations.findIndex(org => org.id === organization.id);
      context.$set(context.organizations, index, response.data);
      context.editOrganizationId = null;
    })
    .catch(error => {
      console.error("There was an error updating the organization:", error);
    });
}
