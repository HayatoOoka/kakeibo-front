import Vue from 'vue'
import VueRouter from 'vue-router'
import Organizations from '../components/organizations_view.vue'
import OrganizationList from '../components/Organization-List.vue'
import Signup from '../views/signup_page'
import Login from '../views/login_page'
import Account_Registration from '../views/Account_Registration.vue'
import AccountList from '../views/Account-List.vue'
import TransactionList from '../views/Transaction-List.vue'
import Kakeibo_Home from '../views/kakeibo-home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/organizations', name: 'Organizations', component: Organizations},
  { path: '/Organization-List', name: 'OrganizationList', component: OrganizationList},
  { path: '/signup', name: 'Signup', component: Signup},
  { path: '/login', name: 'Login', component: Login},
  { path: '/Account_Registration', name: 'Account_Registration', component: Account_Registration},
  { path: '/Account_List', name: 'AccountList', component: AccountList },
  { path: '/Account_List/:accountId/Transaction_List', name: 'TransactionList', component: TransactionList },
  { path: '/', name: 'kakeibo_home', component: Kakeibo_Home }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
