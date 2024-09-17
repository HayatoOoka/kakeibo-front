import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accounts: []
  },
  getters: {
    getAccounts(state) {
      return state.accounts;
    }
  },
  mutations: {
    setAccounts(state, accounts) {
      state.accounts = accounts;
    }
  },
  actions: {
    fetchAccounts({ commit }) {
      const token = localStorage.getItem('jwt');
      axios.get('http://localhost:3001/accounts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        commit('setAccounts', response.data);
      })
      .catch(error => {
        console.error('口座一覧の取得に失敗しました', error);
      });
    }
  }
});
