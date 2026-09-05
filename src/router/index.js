import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchResultsView from '../views/SearchResultsView.vue'
import ItemDetailsView from '../views/ItemDetailsView.vue'
import RecyclingGuideView from '../views/RecyclingGuideView.vue'
import CategoryDetailsView from '../views/CategoryDetailsView.vue'
import LocationSearchView from '../views/LocationSearchView.vue'
import LocationDetailsView from '../views/LocationDetailsView.vue'
import LoginRegisterView from '../views/LoginRegisterView.vue'
import MyAccountView from '../views/MyAccountView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import { useAuth } from '../services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/search',
      name: 'search-results',
      component: SearchResultsView,
    },
    {
      path: '/items/:id',
      name: 'item-details',
      component: ItemDetailsView,
    },
    {
      path: '/guide',
      name: 'recycling-guide',
      component: RecyclingGuideView,
    },
    {
      path: '/guide/:slug',
      name: 'category-details',
      component: CategoryDetailsView,
    },
    {
      path: '/locations',
      name: 'location-search',
      component: LocationSearchView,
    },
    {
      path: '/locations/:id',
      name: 'location-details',
      component: LocationDetailsView,
    },
    {
      path: '/login',
      name: 'login-register',
      component: LoginRegisterView,
    },
    {
      path: '/account',
      name: 'my-account',
      component: MyAccountView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
  ],

  scrollBehavior() {
    return {
      top: 0,
    }
  },
})

router.beforeEach(async (to) => {
  const {
    authReady,
    isAuthenticated,
    isAdmin,
  } = useAuth()

  await authReady

  if (
    to.meta.requiresAuth &&
    !isAuthenticated.value
  ) {
    return {
      name: 'login-register',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (
    to.meta.requiresAdmin &&
    !isAdmin.value
  ) {
    return {
      name: 'my-account',
    }
  }

  if (
    to.name === 'login-register' &&
    isAuthenticated.value
  ) {
    return {
      name: 'my-account',
    }
  }

  return true
})

export default router