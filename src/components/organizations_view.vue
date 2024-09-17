<template>
  <div>
    <h1>Organizations</h1>
    <form @submit.prevent="handleCreateOrganization" >
      <input  v-model="newOrganization.name" placeholder="New Organization Name">
      <button type="submit" class="btn btn-success">Create</button>
    
    <div>
      <input v-model="seachid" placeholder="Enter ID">
      <b-button @click="handleReadOrganization">Read</b-button>
    </div>
    </form>
    <div v-if="selectedOrganization">
      <h2>Search Results</h2>
      <p>ID: {{ selectedOrganization.id }}</p>
      <p>Name: {{ selectedOrganization.name }}</p>
    </div>

    <router-link to="/organization-list">
      <button>All Organizations</button>
    </router-link>
  </div>
</template>

<script>
import createOrganization from './function/createOrganization';
import readOrganization from './function/readOrganization';

export default {
  data() {
    return {
      organizations: [],
      newOrganization: {
        name: '',
      },
      seachid: '',
      selectedOrganization: null
    };
  },
  methods: {
    handleCreateOrganization() {
      createOrganization(this.newOrganization)
    },
    handleReadOrganization() {
      readOrganization(this.seachid)
        .then(data => {
          this.selectedOrganization = data;
        })
        .catch(() => {
          this.selectedOrganization = null;
        });
    },
  },
};
</script>
