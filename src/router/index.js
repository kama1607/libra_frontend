import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import token from '@/api/Manager/TokenManager'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/students',
    name: 'students',
    component: () => import(/* webpackChunkName: "about" */ '../views/Students.vue')
  },
  {
    path: '/books',
    name: 'books',
    component: () => import(/* webpackChunkName: "about" */ '../views/Books.vue')
  },
  {
    path:'/authors',
    name: 'Authors',
    component: () => import('../views/Authors')
  },
  {
    path: "/accountings",
    name: "Accounting",
    component: ()=> import ("../views/Accountings")
  },//test
  
  {
    path: "/login",
    name: "Login",
    component: () => import ("../views/loginForm.vue")
  },

  //404 route
  {
    path: "*",
    name: "404",
    component: () => import("../views/Error404")
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (token.isEmpty() && to.name !== 'Login') {
      next({name: 'Login'})
  } else {
      next();
  }
});

export default router
