import Vue from 'vue'
import App from './App.vue'
import login from './components/login.vue'
import vueRouter from 'vue-router'
import home from './components/home.vue'
import dash from './components/dash.vue'
import firebase from 'firebase'
import './components/firebaseinit.js'

Vue.use(vueRouter);

let routes = [
    {
        path: '/login',
        component: login,
        meta: {requiresGuest: true}
    },
    {
        path: '/', 
        component: home,
        meta: {requiresGuest: false}
    },
    {
        path: '/dash',
        component: dash,
        meta: {requiresAuth: true}
    }
];

const router = new vueRouter({
    routes
});



//found in vue-router documentation.. 
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    //if there are no 'currentusers' logged in, it takes you to the login page
    if (!firebase.auth().currentUser) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if NO logged user
    if (firebase.auth().currentUser) {
      // Go to login
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else {
    // Proceed to route
    next();
  }
});

let app;
firebase.auth().onAuthStateChanged( user =>{
    if(!app){
              app = new Vue({
              el: '#app',
              router: router,      
              render: h => h(App)
            });
       }
});




