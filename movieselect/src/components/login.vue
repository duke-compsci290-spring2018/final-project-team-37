<template>
<div id='login'>
        <h1 v-if='!showRegister'>login</h1>
        <h1 v-if='showRegister'>Register</h1>
        <form >
            Email:<br>
        <input v-model='email' type="text" name="firstname">
        <br>
         Password:<br>
        <input v-model='password' type="text" name="lastname">
        <br><br>
        <input v-if='!showRegister' @click='signin' type="submit" value="Submit">
        <input v-if='showRegister' @click='register' type="submit" value="Submit">
        </form> 
        <br></br>
        <p>Don't have an account?</p>
        <button v-if='!showRegister' v-on:click='showRegister=true'>register</button>
        <button v-if='showRegister'  v-on:click='showRegister=false'>login</button>
</div>
</template>

<script>
import firebase from 'firebase';
export default{
    name: 'login',
    data() {
        return{
            email: '',
            password: '',
            showRegister: false,
        }
    },
    methods: {
        signin: function(e){
            firebase.auth().signInWithEmailAndPassword(this.email,this.password).then(
             user =>{
                var user = firebase.auth().currentUser.email
                alert('you are logged in as ' + user);
                this.$router.push('/dash');
             },
             err => {
                alert(err.message);
             }
            );
            e.preventDefault();
        },
        register: function(e){
            firebase.auth().createUserWithEmailAndPassword(this.email,this.password).then(
            user =>{
                alert('an account for' + this.email + 'has been created!');
            })
        }
    }
  
}
</script>



<style lang='scss'>
#login{
   color: #42b983;
}
</style>