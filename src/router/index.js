import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchResultsView from '../views/SearchResultsView.vue'
import ItemDetailsView from '../views/ItemDetailsView.vue'
import RecyclingGuideView from '../views/RecyclingGuideView.vue'
import CategoryDetailsView from '../views/CategoryDetailsView.vue'
import LocationSearchView from '../views/LocationSearchView.vue'
import LocationDetailsView from '../views/LocationDetailsView.vue'
import LoginRegisterView from '../views/LoginRegisterView.vue'

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
  ],

  scrollBehavior() {
    return {
      top: 0,
    }
  },
})

export default router