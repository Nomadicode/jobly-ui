import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import RegisterView from '../views/auth/RegisterView.vue'
import LoginView from '../views/auth/LoginView.vue'

import AccountContainer from '../views/account/AccountContainer.vue'
import AccountSettingsView from '../views/account/SettingsView.vue'
import AccountResumeView from '../views/account/ResumeView.vue'
import AccountJobsView from '../views/account/JobsView.vue'
import AccountSubscriptionView from '../views/account/SubscriptionView.vue'

import JobContainer from '../views/jobs/JobContainer.vue'
import JobSwipeView from '../views/jobs/SwipeView.vue'
import JobSearchView from '../views/jobs/SearchView.vue'
import JobDetailView from '../views/jobs/DetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    }, {
      path: '/account',
      component: AccountContainer,
      children: [
        {
          path: 'settings',
          name: 'account-settings',
          component: AccountSettingsView,
        }, {
          path: 'resume',
          name: 'account-resume',
          component: AccountResumeView,
        }, {
          path: 'jobs',
          name: 'account-jobs',
          component: AccountJobsView,
        }, {
          path: 'subscriptions',
          name: 'account-subscription',
          component: AccountSubscriptionView,
        }
      ]
    }, {
      path: '/jobs',
      name: 'jobs',
      component: JobContainer,
      children: [
        {
          path: 'search',
          name: 'jobs-search',
          component: JobSearchView,
        }, {
          path: 'swipe',
          name: 'jobs-swipe',
          component: JobSwipeView,
        }, {
          path: 'detail/:id',
          name: 'jobs-detail',
          component: JobDetailView,
        }
      ]
    }
  ],
})

export default router
