<template>
  <div>
    <h2>Sign Up</h2>
    <form @submit.prevent="signup">
      <input v-model="name" placeholder="Name" required>
      <input v-model="organization_id" placeholder="Organization ID" required>
      <input v-model="email" type="email" placeholder="Email" required>
      <input v-model="password" type="password" placeholder="Password" required>

      <button type="submit">Sign Up</button>
    </form>
    <router-link to="/">Log in</router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      organization_id: '',
      email: '',
      password: '',
      //password_confirmation: ''
    };
  },
  methods: {
    signup() {
      axios.post('http://localhost:3001/users', {
        user: {
          name: this.name,
          organization_id: parseInt(this.organization_id,10),
          email: this.email,
          password: this.password,//paswordを入力するとpassword_digestとして送る
          //password_confirmation: this.password_confirmation
        }
      })
      .then(response => {
        (response.data.status);
        this.$router.push('/');
      })
      .catch(error => {
        alert(error.response.data.errors);
      });
    }
  }
};
</script>
