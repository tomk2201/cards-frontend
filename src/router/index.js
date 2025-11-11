import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import CardsView from '../views/CardsView.vue'
import { authService } from '../services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/cards',
      name: 'cards',
      component: CardsView,
      meta: { requiresAuth: true } 
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
})

// sprawdzanie
router.beforeEach((to, from, next) => {
  const isLoggedIn = authService.isAuthenticated();

  // nie zalogowany
  if (to.meta.requiresAuth && !isLoggedIn) {
    // wyslij do logowania
    next('/login');
  } else {
    next();
  }
})

export default router