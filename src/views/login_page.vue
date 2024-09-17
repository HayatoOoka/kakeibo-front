<template>
  <div>
    <h2>Log In</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required>
      <input v-model="password" type="password" placeholder="Password" required>
      <button type="submit">Log In</button>
    </form>
    <router-link to="/signup">Sign up</router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    login() {
      axios.post('http://localhost:3001/login', {
        email: this.email,
        password: this.password
      })
      .then(response => {
        const token = response.data.token;
        localStorage.setItem('jwt', token);
        if (token){
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;}
          alert(response.data.status);
          this.$router.push('/');
      })
      .catch(error => {
        alert(error.response.data.errors);
      });
    }
  },
//   created() {
//     const token = localStorage.getItem('jwt');
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }
//   }  
 };
</script>
