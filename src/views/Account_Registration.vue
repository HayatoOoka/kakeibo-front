<template>
  <b-container class="my-5">
    <h1>口座登録</h1>
    
    <b-form @submit.prevent="createAccount">
      <b-form-group label="口座名:" label-for="name" label-cols-sm="2" label-align-sm="right" class="mb-3">
        <b-form-input 
          id="name"
          v-model="account.name"
          required
          placeholder="口座名を入力"
        ></b-form-input>
      </b-form-group>

      <div class="text-center">
        <b-button type="submit" variant="primary">登録</b-button>
      </div>
    </b-form>

    <b-alert variant="danger" show v-if="error" class="mt-3">
      {{ error }}
    </b-alert>
  </b-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      account: {
        name: ''
      },
      error: null
    };
  },
  methods: {
    createAccount() {
      const token = localStorage.getItem('jwt');
      axios.post('http://localhost:3001/accounts', { account: this.account }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Account created:', response.data);
        alert('口座が作成されました！');
      })
      .catch(error => {
        this.error = '口座の作成に失敗しました。';
        console.error(error);
      });
    }
  }
};
</script>
