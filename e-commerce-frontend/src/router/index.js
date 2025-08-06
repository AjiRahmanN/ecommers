import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/Login.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import RegisterView from '../views/Register.vue'
import ProductListView from '../views/ProductList.vue'
import CheckoutView from '../views/Checkout.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/products',
    name: 'products',
    component: ProductListView
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Simple route guard for admin routes
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (to.meta.requiresAdmin) {
    if (user && user.isAdmin) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
