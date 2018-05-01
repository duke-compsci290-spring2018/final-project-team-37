<template>
<div id='dash' class='container-fluid'>
    <table class='dashnav'>
        <tr>
            <th v-on:click='getFav' class='choice' >Favorites</th>
            <th v-on:click='updateEvents' class='choice' >Events</th>
            <th>
                <input v-model="searchTerm" placeholder='search movies' class='searchbar' type='text'>
                <input v-on:click="findMovie" class='submit' type='submit'>
                <button v-on:click='clearSearch'>clear</button>
            </th>
            <th>filter by: 
                <button v-on:click='filterTitle' class='filter'>title</button>
                <button v-on:click='filterYear' class='filter' >year</button>
                <button v-on:click='filterPop' class='filter'>popularity</button>
            </th>
        </tr>
    </table>
    
    <div v-if='showFav' class='movieList'>
    <h3 id='faveHeader'>{{userName}}'s Favorite Movies</h3>
    <div v-for='(movie,index) in favorites' v-bind:key='movie.id' class='movie'>
        <h4>
            {{movie.title}} <button v-on:click='removeFav(index)'>x</button>
            <button v-on:click='chooseEvent(index)'>add</button>
        </h4>
        <img :src='movie.poster' v-on:click='openInfofav(index)' >
    </div>
    </div>
    
    <div v-if='!showFav' id='results'>
     <div v-for="(result,index) in searchResults" class='movie'>
        <h4>
            <input v-on:click='makeFav(index)' type='image' src='src/assets/star.png'> {{result.title}}
        </h4>
        <img :src='result.poster' v-on:click='openInfo(index)' >
    </div>
    </div>
        <transition class="modal addToEvent" name="modal" v-if="showChooseEvent">
        <div class="modal-mask">
            <table class="modal-container table text-center">
                <thead>
                <th>Choose and event to add to:</th>
                <th> <input v-on:click='showChooseEvent=false' type ='image' src='src/assets/exit.png'></th>
                </thead>
                <tbody class="modal-body"  v-for='(event,index) in events'>
                    <td> <p v-on:click='eventAddMovie(index)'>{{event.eventName}}</p> </td>
                </tbody>
            </table>
        </div>
        </transition>
    
    <transition class="modal movieInfoModal" name="modal" v-if="showInfo">
        <div class="modal-mask">
            <table class="modal-container table text-center">
                <thead class="modal-header">
                    <tr>
                        <th></th>
                        <th><h3 class='modhead'>{{modalName}}</h3> </th>
                        <th> <input v-on:click='showInfo=false' type ='image' src='src/assets/exit.png'> </th>
                    </tr>
                </thead>
                <tbody class="modal-body">
                    <tr>
                        <td colspan='3'><p>{{modalInfo}}</p></td>  
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>rating: {{modalRating}}</td>
                        <td></td>
                        <td>relased: {{modalYear}}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </transition>
    
    <div v-if='showEvents' class='events'>
        <div class='currentEvents'>
            <h4><button v-on:click='updateEvents'>update</button> Current Events:</h4>
            <div>
                <table class='eventListing' v-for='(event,index) in events'>
                <col width="130">
                <col width="5">
                    <td><p v-on:click='openEvent(index)'>{{event.eventName}}</p> </td>
                </table>
            </div>
        </div>
        <div class='createEvents'>
            <h4>New Event:</h4>
            <form >
            Event Name:<br>
            <input v-model='eventName' type="text" name="Event Name">
            <br>
            Description:<br>
            <input v-model='eventOverview' type="text">
            <br>
            Event Size:<br>
            <input v-model='eventSize' type='text' name='2-5'>
            <br>
            Friends Invited:<br>
            <input v-model='friends' type="text" name='suzie,john,kat'>
            <br>
            <br>
            <input v-on:click='createEvent' type="submit" value="Submit">
        </form> 
        
        <transition class="modal eventModal" name="modal" v-if="showEventModal">
        <div class="modal-mask">
            <table class="modal-container table text-center">
                <thead class="modal-header">
                    <tr>
                        <th></th>
                        <th><h3 class='modhead'>{{modalName}}</h3> </th>
                        <th> <input v-on:click='showEventModal=false' type ='image' src='src/assets/exit.png'> </th>
                    </tr>
                </thead>
                <tbody class="modal-body">
                    <tr>
                        <td colspan='3'><p>{{modalInfo}}</p></td>  
                    </tr>
                    <tr>   
                        Movies Added:
                        <p v-for='movie in movieList'>{{movie.title}}</p>
                    </tr>
                    
                </tbody>
                <tfoot>
                    <tr>
                        <td>stuff</td>
                        <td></td>
                        <td>more stuff</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        </transition>
            
    </div>
    </div>
    
    
    
</div>
</template>

<script>
import firebase from 'firebase';
import db from './firebaseinit';
const APIkey = "daf8b2a46d1116ea6223d92515460310";
let baseURL = "https://api.themoviedb.org/3/";

export default{
    name: 'dash',
    data() {
        return{
            configData: null,
            baseImageURL: null,
            searchTerm: '',
            userName: '',
            
            searchResults: null,
            originalResults: null,
            favorites: [],
            
            showFav: false,
            showInfo: false,
            showEvents: false,
            showEventModal: false,
            showChooseEvent: false,
            
            events: [],
            eventName: '',
            eventSize: '',
            friends: '',
            eventOverview: '',
            tempIndex:null,
            movies: [],
            
            
            
            modalName: '',
            modalDate: '',
            modalInfo: '',
            modalRating: '',
            modalYear: '',
            modalAdult: '',
        }
    },
    methods: {
        findMovie: function(){
            this.showFav = false;
             var keyword = this.searchTerm;
             let url = ''.concat(baseURL, 'search/movie?api_key=', APIkey, '&query=', keyword);
            fetch(url)
            .then(result=>result.json())
            .then((data)=>{
                //processing data before using it
                var r= [];
                for (var i=0;i<data.results.length;i++){
                    var current = data.results[i];
                    var movieObject = {
                    num: current.id,
                    title: current.title,
                    date: current.release_date.substr(0,4),
                    popularity: current.popularity,
                    overview: current.overview,
                    poster: "http://image.tmdb.org/t/p/w185"+current.poster_path,
                    }
                    r.push(movieObject);
                }
                this.searchResults = r;
                this.originalResults = this.searchResults;
            })
        },
        openInfo: function(index){
            this.showInfo = true;
            this.modalName = this.searchResults[index].title;
            this.modalInfo = this.searchResults[index].overview;
            this.modalRating = this.searchResults[index].popularity;
            this.modalYear = this.searchResults[index].date;
        },
        filterTitle: function(){
           this.searchResults.sort(function(a, b){
                var titleA=a.title.toLowerCase(), titleB=b.title.toLowerCase()
                if (titleA < titleB) //sort string ascending
                return -1 
                if (titleA > titleB)
                return 1
                return 0 //default return value (no sorting)
            })
        },
        filterYear: function(){
            this.searchResults.sort(function(a, b){
                return a.date-b.date
            })
        },
        filterPop: function(){
            this.searchResults.sort(function(a, b){
                return b.popularity-a.popularity
            })
        },
        resetResults: function(){
           //not sure why this isn't working !
        },
        clearSearch: function(){
            this.searchResults=null;
        },
        makeFav: function(index){
            var user = firebase.auth().currentUser.email;
            var splitUser = user.split("@");
            user = splitUser[0];   
                db.collection(user).add(this.searchResults[index]);
        },
        getFav: function(){
            this.showFav = !this.showFav
            this.showEvents = false;
            this.favorites = [];
            var user = firebase.auth().currentUser.email;
            var splitUser = user.split("@");
            this.userName = splitUser[0];  
            db.collection(this.userName).get().then(
            snapshot => {
                snapshot.forEach(doc => {
                    var data = {
                        'id': doc.id,
                        'num':doc.data().num,
                        'title': doc.data().title,
                        'date': doc.data().date,
                        'popularity': doc.data().popularity,
                         'overview': doc.data().overview,
                        'poster': doc.data().poster                        
                    }
                     console.log(data);
                     this.favorites.push(data);
                })
              
            }) 
        },
        openInfofav: function(index){
            this.showInfo = true;
            this.modalName = this.favorites[index].title;
            this.modalInfo = this.favorites[index].overview;
            this.modalRating = this.favorites[index].popularity;
            this.modalYear = this.favorites[index].date;
            
        },
        removeFav: function(index){        
            var curId = this.favorites[index].id;
            db.collection(this.userName).doc(curId).delete();
            this.favorites.splice(index,1);
        },
        createEvent: function(){
             var user = firebase.auth().currentUser.email;
             var newEvent = {
                creator: user,
                eventName: this.eventName,
                eventSize: this.eventSize,
                friends: this.friends,
                eventOverview: this.eventOverview,
                movieList: [],
                complete: false
             }
            db.collection('events').add(newEvent);
        },
        updateEvents: function(){
            this.showEvents = true;
            this.showFav = false;
            var user = firebase.auth().currentUser.email;
            this.events = []
            db.collection('events').get().then(
            snapshot => {
                snapshot.forEach(doc => {
                    var data = {
                        'id': doc.id,
                        'creator': doc.data().creator,
                        'eventName':doc.data().eventName,
                        'eventSize': doc.data().eventSize,
                        'friends': doc.data().friends,
                        'eventOverview': doc.data().eventOverview,
                        'complete': doc.data().complete,   
                        'movieList': doc.data().complete
                    }
                        var invited = data.friends.split(" ");
                        if(data.creator == user){
                            this.events.push(data);
                        }
                        for(var i =0; i<invited.length;i++){
                            if(invited[i] == user){
                                this.events.push(data);
                            }
                        }
                     
                })
              
            }) 
        },
        openEvent: function(index){
            this.showEventModal=true;
            this.modalName = this.events[index].eventName;
            this.modalInfo = this.events[index].eventOverview;
            this.movieList = this.events[index].movieList;
        },
        chooseEvent: function(index){
            this.showChooseEvent = true;
            this.updateEvents();
            this.tempIndex = index;
        },
        eventAddMovie: function(index){
            this.showChooseEvent = false;
            var curId = this.events[index].id;
            db.collection('events').doc(curId).set({
                 movieList: [this.favorites[this.tempIndex]]
            })
        }
       
    }
    
    
}
  
  

</script>
<style lang='scss'>
.dashnav{
    width: 100%;
     margin-left:auto;
     text-align: center;
     color: green;
     border-bottom: medium lightblue solid;
}
th{
    padding-bottom: 10px;
}
.choice{
    font-size: 20px;
}
.submit{
    border: none;
    padding: 5px;
    background-color: #42b983;
    color: white;
}
.reset{
    background-color: whitesmoke;
    color: #42b983;
}
.movieList{
    text-align: center;
    padding: 2%;
    width: 100%;
    margin: auto;
    margin-top: 10px;
    float: left;
}
#faveHeader{
    text-align: left;
    color:#42b983;
}
#results{
     background-color:#42b983;
}
.movie{
    float: left;
    width: 25%;
    margine: 2%;
    overflow: auto;
    height: 400px;

   
}
::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
}

.modal-container{
    text-align: center;
    position: fixed; /* Stay in place */
    z-index: 9999; /* Sit on top */
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 50%;
    width: 50%;
    overflow: auto;
    background-color: white; 
    color: black; 
    vertical-align: middle;
    border: thick lightgray solid;
}
.modal-header{
    font-size: 40px;
    color: green;
    background-color: white;
}
.modal-body{
    font-size: 20px; 
    color:  #42b983;
    background-color: white;
}
tfoot{
     background-color: white;
}

.currentEvents{
    width: 50%;
    float: left;
   
}
.currenEvents, h4{
     text-align: left;
}
.createEvents{
    width: 50%;
    float: left;
}
.eventListing{
    width: 50%;
    border: medium #42b983 solid;
    color: green;
    font-size: 20px;
    margin: 1%;
}


</style>