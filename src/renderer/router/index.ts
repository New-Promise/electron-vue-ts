import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/views/home').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
export default router
