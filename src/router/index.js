import {
  createRouter,
  createWebHistory,
} from 'vue-router'

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
import ContactView from '../views/ContactView.vue'
import WasteImpactView from '../views/WasteImpactView.vue'

import {
  useAuth,
} from '../services/authService'

const SITE_NAME =
  'WasteLess Melbourne'

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL,
  ),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,

      meta: {
        title: 'Home',
      },
    },

    {
      path: '/search',
      name: 'search-results',
      component: SearchResultsView,

      meta: {
        title: 'Search Results',
      },
    },

    {
      path: '/items/:id',
      name: 'item-details',
      component: ItemDetailsView,

      meta: {
        title: 'Item Details',
      },
    },

    {
      path: '/guide',
      name: 'recycling-guide',
      component: RecyclingGuideView,

      meta: {
        title: 'Recycling Guide',
      },
    },

    {
      path: '/guide/:slug',
      name: 'category-details',
      component: CategoryDetailsView,

      meta: {
        title: 'Category Details',
      },
    },

    {
      path: '/locations',
      name: 'location-search',
      component: LocationSearchView,

      meta: {
        title:
          'Find a Recycling Location',
      },
    },

    {
      path: '/locations/:id',
      name: 'location-details',
      component: LocationDetailsView,

      meta: {
        title: 'Location Details',
      },
    },

    {
      path: '/contact',
      name: 'contact',
      component: ContactView,

      meta: {
        title: 'Contact',
      },
    },

    {
      path: '/impact',
      name: 'waste-impact',
      component: WasteImpactView,

      meta: {
        title:
          'Waste Impact Calculator',
      },
    },

    {
      path: '/login',
      name: 'login-register',
      component: LoginRegisterView,

      meta: {
        title:
          'Login and Register',
      },
    },

    {
      path: '/account',
      name: 'my-account',
      component: MyAccountView,

      meta: {
        title: 'My Account',
        requiresAuth: true,
      },
    },

    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboardView,

      meta: {
        title:
          'Admin Dashboard',

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

/*
 * =========================================================
 * AUTHENTICATION AND AUTHORISATION GUARD
 * =========================================================
 */

router.beforeEach(
  async (to) => {
    const {
      authReady,
      isAuthenticated,
      isAdmin,
    } = useAuth()

    /*
     * Wait until Firebase has restored
     * the current authentication state.
     */
    await authReady

    /*
     * Protected routes require
     * authentication.
     */
    if (
      to.meta.requiresAuth &&
      !isAuthenticated.value
    ) {
      return {
        name: 'login-register',

        query: {
          redirect:
            to.fullPath,
        },
      }
    }

    /*
     * Admin routes require the
     * authenticated user's Firestore
     * role to be "admin".
     */
    if (
      to.meta.requiresAdmin &&
      !isAdmin.value
    ) {
      return {
        name: 'my-account',
      }
    }

    /*
     * An authenticated user does not
     * need to return to the login page.
     */
    if (
      to.name ===
        'login-register' &&
      isAuthenticated.value
    ) {
      return {
        name: 'my-account',
      }
    }

    return true
  },
)

/*
 * =========================================================
 * ACCESSIBILITY:
 * PAGE TITLE, FOCUS MANAGEMENT AND ROUTE ANNOUNCEMENT
 * =========================================================
 *
 * Important:
 *
 * The first page load must NOT automatically
 * focus the page heading.
 *
 * This keeps "Skip to main content" as the
 * first keyboard-focusable control after a
 * refresh.
 *
 * After later Vue Router navigation, the new
 * page heading receives focus so keyboard and
 * screen-reader users know that navigation has
 * completed.
 */

let hasCompletedInitialNavigation =
  false

router.afterEach((to) => {
  const pageTitle =
    to.meta.title || 'Page'

  /*
   * Give every route a meaningful
   * browser document title.
   */
  document.title =
    `${pageTitle} | ${SITE_NAME}`

  window.requestAnimationFrame(
    () => {
      const main =
        document.querySelector(
          'main',
        )

      if (main) {
        /*
         * The Skip Link in index.html
         * points to this ID.
         */
        main.id =
          'main-content'

        /*
         * Allow programmatic focus without
         * putting <main> into the normal
         * keyboard Tab order.
         */
        main.setAttribute(
          'tabindex',
          '-1',
        )
      }

      /*
       * Initial page load:
       *
       * Do not move keyboard focus.
       * The user's first Tab should reach
       * "Skip to main content".
       */
      if (
        !hasCompletedInitialNavigation
      ) {
        hasCompletedInitialNavigation =
          true
      } else {
        /*
         * Later SPA navigation:
         *
         * Move focus to the new page heading.
         */
        const heading =
          document.querySelector(
            'main h1',
          )

        if (heading) {
          heading.setAttribute(
            'tabindex',
            '-1',
          )

          heading.focus({
            preventScroll: true,
          })
        }
      }

      /*
       * Announce the new page to
       * screen-reader users.
       */
      const announcer =
        document.getElementById(
          'route-announcer',
        )

      if (announcer) {
        announcer.textContent =
          ''

        window.setTimeout(
          () => {
            announcer.textContent =
              `${pageTitle} page loaded`
          },
          100,
        )
      }
    },
  )
})

export default router