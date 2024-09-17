<template>
  <div class="container my-5">
    <h2>口座一覧</h2>
    <b-row>
      <b-col cols="12" md="6" lg="4" v-for="account in accounts" :key="account.id">
        <b-card
          :title="account.name"
          class="mb-4"
          style="max-width: 20rem;"
        >
          <router-link :to="{ name: 'TransactionList', params: { accountId: account.id }}" >
            <b-button style="background-color: #563d7c;">取引一覧を見る</b-button>
          </router-link>
        </b-card>
      </b-col>
    </b-row>
    <div class="text-center mt-4">
      <router-link to="/Account_Registration" class="btn btn-success">
        新しい口座を作成する
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    accounts() {
      return this.$store.state.accounts; 
    }
  },
  created() {
    this.$store.dispatch('fetchAccounts'); 
  }
};

</script>
