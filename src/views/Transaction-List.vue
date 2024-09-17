<template>
  <div class="container my-5">
    <h2>取引一覧 - {{ account.name }}</h2>
    <apexchart type="line" height="250" :options="chartOptions" :series="series"></apexchart>
    <b-button style="background-color: #563d7c;" @click="showModal">新しい取引を追加</b-button>
    <b-row>
      <b-col cols="12" md="8" lg="6" class="mx-auto">
        <b-list-group>
          <b-list-group-item
            v-for="transaction in transactions"
            :key="transaction.id"
            class="d-flex justify-content-between align-items-center"
            variant="secondary"
          >
            <div>
              <h5>{{ transaction.date }}</h5>
              <p>{{ transaction.description }}</p>
              <p class="text-success">収入: {{ transaction.income }}円</p>
              <p class="text-danger">支出: {{ transaction.expense }}円</p>
            </div>
            <div>
              <b-button variant="outline-info" size="sm" class="mr-2" @click="selectTransactionForEdit(transaction)">
                編集
              </b-button>
              <b-button variant="outline-danger" size="sm" @click="deleteTransaction(transaction.id)">
                削除
              </b-button>
            </div>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <b-button style="background-color: #563d7c;" @click="showModal">新しい取引を追加</b-button>
    <b-modal v-model="isModalVisible" title="新しい取引を追加" hide-footer>
      <form @submit.prevent="isEditing ? updateTransaction() : createTransaction()">
        <b-form-group label="日付">
          <b-form-input v-model="selectedTransaction.date" type="date" required></b-form-input>
        </b-form-group>
        <b-form-group label="説明">
          <b-form-input v-model="selectedTransaction.description" type="text" placeholder="説明" required></b-form-input>
        </b-form-group>
        <b-form-group label="収入">
          <b-form-input v-model.number="selectedTransaction.income" type="number" placeholder="収入"></b-form-input>
        </b-form-group>
        <b-form-group label="支出">
          <b-form-input v-model.number="selectedTransaction.expense" type="number" placeholder="支出"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="success">{{ isEditing ? '更新' : '追加' }}</b-button>
        <b-button variant="secondary" @click="cancelEdit" v-if="isEditing">キャンセル</b-button>
      </form>
    </b-modal>

    <br><br><router-link to="/Account_List">口座一覧に戻る</router-link>
  </div>
</template>

<script>
import axios from 'axios';
import VueApexCharts from 'vue-apexcharts';
import { BModal, BButton, BFormInput, BFormGroup } from 'bootstrap-vue';

export default {
  data() {
    return {
      account: {},
      transactions: [],
      selectedTransaction: {
        date: '',
        description: '',
        income: 0,
        expense: 0
      },
      isEditing: false,
      isModalVisible: false,
      BalanceData: [], 
      chartOptions: {
      chart: {
        id: 'balance-chart'
      },
      xaxis: {
        type: 'datetime',
        labels:{
          format: 'MM-dd',},
      },
      yaxis: {
        title: {
          text: '所持金額 (円)'
        },
      },
      title: {
        text: '所持金額'
      }
    },
    series: [{
      name: '所持金額',
      data: this.BalanceData
    }]  
    };
  },
  created() {
    const token = localStorage.getItem('jwt');
    const accountId = this.$route.params.accountId;
    
    axios.get(`http://localhost:3001/accounts/${accountId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      this.account = response.data;
    })
    .catch(error => {
      console.error('口座の取得に失敗しました', error);
    });

    axios.get(`http://localhost:3001/accounts/${accountId}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      this.transactions = response.data;
      this.calculateBalanceData();
    })
    .catch(error => {
      console.error('取引一覧の取得に失敗しました', error);
    });
  },
  methods: {
    createTransaction() {
      const token = localStorage.getItem('jwt');
      const accountId = this.$route.params.accountId;
      
      axios.post(`http://localhost:3001/accounts/${accountId}/transactions`, this.selectedTransaction, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        this.transactions.push(response.data);
        this.resetTransactionForm();
        this.isModalVisible = false; 
        this.calculateBalanceData();
      })
      .catch(error => {
        console.error('取引の作成に失敗しました', error);
      });
    },
    selectTransactionForEdit(transaction) {
      this.selectedTransaction = { ...transaction };
      this.isEditing = true;
      this.isModalVisible = true; 
    },
    updateTransaction() {
      const token = localStorage.getItem('jwt');
      const accountId = this.$route.params.accountId;
      const transactionId = this.selectedTransaction.id;

      axios.put(`http://localhost:3001/accounts/${accountId}/transactions/${transactionId}`, this.selectedTransaction, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        const index = this.transactions.findIndex(t => t.id === transactionId);
        if (index !== -1) {
          this.transactions.splice(index, 1, response.data); 
        }
        this.resetTransactionForm();
        this.isModalVisible = false; 
      })
      .catch(error => {
        console.error('取引の更新に失敗しました', error);
      });
    },
    deleteTransaction(transactionId) {
      const token = localStorage.getItem('jwt');
      const accountId = this.$route.params.accountId;
      
      axios.delete(`http://localhost:3001/accounts/${accountId}/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        this.transactions = this.transactions.filter(t => t.id !== transactionId);
      })
      .catch(error => {
        console.error('取引の削除に失敗しました', error);
      });
    },
    showModal() {
      this.isModalVisible = true;
    },
    cancelEdit() {
      this.resetTransactionForm();
      this.isModalVisible = false; 
    },
    resetTransactionForm() {
      this.selectedTransaction = {
        date: '',
        description: '',
        income: 0,
        expense: 0
      };
      this.isEditing = false;
    },
    calculateBalanceData() {
      const dailyBalances = {};

      let cumulativeBalance = 0;
      
      this.transactions.forEach(transaction => {
        const date = transaction.date;

        // 日付ごとの収入と支出を集計する
        if (!dailyBalances[date]) {
          dailyBalances[date] = {
            income: 0,
            expense: 0
          };
        }

        dailyBalances[date].income += transaction.income;
        dailyBalances[date].expense += transaction.expense;
      });

      this.BalanceData = Object.keys(dailyBalances).map(date => {
        const balanceForDate = dailyBalances[date];
        cumulativeBalance += balanceForDate.income - balanceForDate.expense;
        
        return {
          x: date,
          y: cumulativeBalance
        };
      });
    }
  },
  watch: {
  BalanceData(newData) {
    this.series = [{ name: '所持金額', data: newData }];
  }
  }, 
  components: {
    BModal,
    BButton,
    BFormInput,
    BFormGroup,
    apexchart: VueApexCharts,
  }
};
</script>

