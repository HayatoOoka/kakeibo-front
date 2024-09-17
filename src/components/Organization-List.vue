<template>
  <div class="container my-5">
    <b-row class="mb-3">
      <b-col>
        <h1>組織一覧</h1>
      </b-col>
      <b-col class="text-right">
        <b-button variant="primary" @click="$router.push('/organizations')">グループ作成</b-button>
      </b-col>
    </b-row>

    <b-table :items="organizations" :fields="fields" bordered hover striped>
      <template #cell(name)="row">
        <div v-if="row.item.id === editOrganizationId">
          <b-input-group>
            <b-form-input v-model="row.item.name" placeholder="New Name"></b-form-input>
            <b-input-group-append>
              <b-button variant="success" @click="updateOrganization(row.item)">Save</b-button>
              <b-button variant="danger" @click="cancelEdit">Cancel</b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
        <div v-else>
          <b>{{ row.item.name }}</b>
        </div>
      </template>

      <template #cell(actions)="row">
        <b-button size="sm" variant="outline-info" @click="editOrganization(row.item.id)">編集</b-button>
        <b-button size="sm" variant="outline-danger" @click="deleteOrganization(row.item.id)">削除</b-button>
        <b-button size="sm" variant="outline-primary" @click="fetchUsers(row.item.id)">所属メンバー</b-button>
      </template>
    </b-table>

    <b-modal v-if="viewUsersOrganizationId" :visible="true" @hide="viewUsersOrganizationId = null">
      <template #modal-title>
        所属メンバー
      </template>
      <b-list-group>
        <b-list-group-item v-for="user in users" :key="user.id">
          <div class="d-flex justify-content-between align-items-center">
            <span><b>{{ user.name }}</b></span>
            <div>
              <b-button size="sm" variant="secondary" @click="toggleUserTransactions(user.id)">取引記録</b-button>
              <b-button size="sm" variant="outline-danger" class="ml-2" @click="deleteUser(user.id)">削除</b-button>
            </div>
          </div>

          <b-list-group v-if="user.id === viewTransactionsUserId" class="mt-2">
            <b-list-group-item v-for="transaction in transactions" :key="transaction.id">
              {{ transaction.date }}: {{ transaction.description }} - <b>収入:</b> {{ transaction.income }}円, <b>支出:</b> {{ transaction.expense }}円
            </b-list-group-item>
          </b-list-group>
        </b-list-group-item>
      </b-list-group>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import fetchOrganization from './function/fetchOrganization';
import deleteOrganization from './function/deleteOrganization';
import editOrganization from './function/editOrganization';
import cancelEdit from './function/cancelEdit';
import updateOrganization from './function/updateOrganization';

export default {
  data() {
    return {
      organizations: [],
      users: [],
      transactions: [], 
      editOrganizationId: null,
      viewUsersOrganizationId: null,
      viewTransactionsUserId: null,
      fields: [
        { key: 'name', label: '組織名' },
        { key: 'actions', label: '', class: 'text-center' }
      ]
    };
  },
  created() {
    fetchOrganization(this);
  },
  methods: {
    fetchOrganizations() {
      fetchOrganization(this);
    },
    deleteOrganization(id) {
      deleteOrganization(this, id);
    },
    editOrganization(id) {
      editOrganization(this, id);
    },
    cancelEdit() {
      cancelEdit(this);
    },
    updateOrganization(organization) {
      updateOrganization(this, organization);
    },
    fetchUsers(organizationId) {
      const token = localStorage.getItem('jwt');
      axios.get(`http://localhost:3001/organizations/${organizationId}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        this.users = response.data;
        this.viewUsersOrganizationId = organizationId;
      })
      .catch(error => {
        console.error('ユーザー一覧の取得に失敗しました', error);
      });
    },
    toggleUserTransactions(userId) {
      if (this.viewTransactionsUserId === userId) {
        // 同じユーザーの場合、表示を閉じる
        this.viewTransactionsUserId = null;
      } else {
        // 違うユーザーの場合、取引記録を表示
        this.fetchUserTransactions(userId);
      }
    },
    fetchUserTransactions(userId) {
      const token = localStorage.getItem('jwt');
      axios.get(`http://localhost:3001/users/${userId}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        this.transactions = response.data;
        this.viewTransactionsUserId = userId;
      })
      .catch(error => {
        console.error('取引記録の取得に失敗しました', error);
      });
    },
    deleteUser(userId) {
      const token = localStorage.getItem('jwt');
      axios.delete(`http://localhost:3001/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        this.users = this.users.filter(user => user.id !== userId);
      })
      .catch(error => {
        console.error('ユーザーの削除に失敗しました', error);
      });
    }
  }
};
</script>
