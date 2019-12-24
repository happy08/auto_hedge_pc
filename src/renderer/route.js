import Home from './pages/Home';
import menus from './menu';
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
let childrenRoutes = [];

for (const menu of menus) {
  childrenRoutes.push(menu);
}

childrenRoutes.push({
  path: '*',
  redirect: menus[ 0 ].path
});

const routes = [
  {
    path: '/home',
    component: Home,
    children: childrenRoutes
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => require(['@/pages/login'], resolve)
  },
  {
    path: '/',
    name: 'index',
    redirect: '/login'
  },
];

export default new Router({
  routes: routes
})