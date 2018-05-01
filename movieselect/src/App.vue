<template>
  <div id="app">
    <div class='navbar'>
    <h2 class='navheader'>Epic Movie App</h2>
    <ul>
        <li><router-link to='/'>home</router-link></li>
        <li><router-link to='/dash'>dash</router-link></li>
        <li><router-link  to='/login'>login</router-link></li>
        <li><button v-on:click='logout'>logout</button></li>
        
    </ul>
    </div>
     <hr>
     <router-view></router-view>
     
    
   
   
     
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'app',
  data () {
    return {
      movies: [],
      loggedIn: false,
      currUser: false
    }
  },
  methods:{
      created(){
       var user = firebase.auth().currentUser;

        if (user) {
          loggedIn = true;
        } else {
          loggedIn = false;
        }
      }, 
   
    logout: function(){
        firebase.auth().signOut().then(
            () =>{
                this.$router.push('/login');
        });
        this.loggedIn = false;
    }
    },
    
  
}

</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

h1, h2 {
  font-weight: normal;
}
.navheader{
    float: left;
    margin: 10px;
    color: white;
}

ul {
  list-style-type: none;
  padding: 0;
  float: right;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.navbar{
    width: 100%;
    margin: auto;
    background-color: lightblue;
    height: 50px;
}
button{
    border: none;
    padding: 5px;
    background-color: #42b983;
    color: white;
    
}

</style>
