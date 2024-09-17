<template>
  <div class="container my-5">
    <h2>残高合計</h2>
    <apexchart type="donut" height="250" :options="chartOptions" :series="series"></apexchart>

    <h2 class="mt-5">取引一覧</h2>
    <b-table :items="transactions" :fields="fields">
      <template #cell(actions)="row">
        <b-button size="sm" variant="outline-info" @click="editTransaction(row.item)">
          編集
        </b-button>
        <b-button size="sm" variant="outline-danger" @click="deleteTransaction(row.item)">
          削除
        </b-button>
      </template>
    </b-table>

    <b-modal v-model="isModalVisible" title="取引の編集" hide-footer>
      <form @submit.prevent="updateTransaction">
        <b-form-group label="日付">
          <b-form-input v-model="selectedTransaction.date" type="date" required></b-form-input>
        </b-form-group>
        <b-form-group label="説明">
          <b-form-input v-model="selectedTransaction.description" type="text" required></b-form-input>
        </b-form-group>
        <b-form-group label="収入">
          <b-form-input v-model.number="selectedTransaction.income" type="number" required></b-form-input>
        </b-form-group>
        <b-form-group label="支出">
          <b-form-input v-model.number="selectedTransaction.expense" type="number" required></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="success">保存</b-button>
        <b-button variant="secondary" @click="cancelEdit">キャンセル</b-button>
      </form>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import VueApexCharts from 'vue-apexcharts';

export default {
  data() {
    return {
      accounts: [],
      transactions: [],
      chartOptions: {
        labels: [], 
        tooltip: {
          y: {
            formatter: function(value) {
              return value + '円'; 
            }
          }
        },
        dataLabels: {
          formatter: function(value, { seriesIndex, w }) {
            return w.config.series[seriesIndex] + '円'; 
          }
        }
      },
      series: [],
      fields: [
        { key: 'date', label: '日付' },
        { key: 'description', label: '説明' },
        { key: 'income', label: '収入' },
        { key: 'expense', label: '支出' },
        { key: 'actions', label: '', class: 'text-center' }
      ],
      selectedTransaction: {
        id: null,
        date: '',
        description: '',
        income: 0,
        expense: 0
      },
      isModalVisible: false,
    };
  },
  created() {
    this.fetchAccountData();
  },
  methods: {
    fetchAccountData() {
      const token = localStorage.getItem('jwt');
      
      axios.get(`http://localhost:3001/accounts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        this.accounts = response.data;

        this.accounts.forEach(account => {
          axios.get(`http://localhost:3001/accounts/${account.id}/transactions`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => {
            let balance = 0;
            response.data.forEach(transaction => {
              balance += transaction.income - transaction.expense;
            });

            this.series.push(balance);
            this.chartOptions.labels.push(account.name);

            this.transactions = [...this.transactions, ...response.data];
          })
          .catch(error => {
            console.error('取引の取得に失敗しました', error);
          });
        });
      })
      .catch(error => {
        console.error('口座の取得に失敗しました', error);
      });
    },
    editTransaction(transaction) {
      this.selectedTransaction = { ...transaction }; // 選択した取引データをコピー
      this.isModalVisible = true; 
    },
    updateTransaction() {
      const token = localStorage.getItem('jwt');
      const accountId = this.selectedTransaction.account_id; 
      const transactionId = this.selectedTransaction.id;

      axios.put(`http://localhost:3001/accounts/${accountId}/transactions/${transactionId}`, this.selectedTransaction, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        // 取引の更新後、テーブルのデータを更新
        const index = this.transactions.findIndex(t => t.id === transactionId);
        if (index !== -1) {
          this.transactions.splice(index, 1, response.data);
        }
        this.isModalVisible = false; 
      })
      .catch(error => {
        console.error('取引の更新に失敗しました', error);
      });
    },
    cancelEdit() {
      this.selectedTransaction = { id: null, date: '', description: '', income: 0, expense: 0 };
      this.isModalVisible = false; 
    },
    deleteTransaction(transaction) {
      const token = localStorage.getItem('jwt');
      const accountId = transaction.account_id;

      axios.delete(`http://localhost:3001/accounts/${accountId}/transactions/${transaction.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        this.transactions = this.transactions.filter(t => t.id !== transaction.id);
      })
      .catch(error => {
        console.error('取引の削除に失敗しました', error);
      });
    },
  },
  components: {
    apexchart: VueApexCharts,
  }
};
</script>
