'use strict';   // run js in strict mode
const dotenv = require('dotenv');  //dotenv allows us to load envauroment variable 
const express = require('express')  //loud express module to our script
const superAgent = require('superagent');   //req rse for api 
const pg = require('pg');   //load pg
const cors =require('cors'); //load cors library allowes our server to accept APIs call from other domain 
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL
const NODE_ENV = process.env.NODE_ENV;
const options = NODE_ENV === 'production' ? { connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } } : { connectionString: DATABASE_URL };
const client = new pg.Client(options);

let app = express();   //creat a new server
app.use(cors());      // middleware

// const client = new pg.Client(process.env.DATABASE_URL)   //spicific the res from api
// console.log(client);

const PORT = process.env.PORT || 3000   // get the port from .env
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY
const WEATHER_API_KEY = process.env.WEATHER_API_KEY
const PARKS_API_KEY = process.env.PARKS_API_KEY
const MOVIE_API_KEY = process.env.MOVIE_API_KEY
const YELP_API_KEY = process.env.YELP_API_KEY

//open our port
client.connect().then(()=> app.listen(PORT,()=>{console.log(`i'm listen ${PORT}`);})) ;

//route middlewares
app.get('/location',handleLocation);
app.get('/weather', handleWether);
app.get('/parks', handlePark);
app.get('/movies', handleMoves);
app.get('/yelp', handleYelp);
app.get('*', notFoundHandler);



function handleWether(req, res){
    const searchQuryCity = req.query.search_query ;
    // const locationS = require('./data/weather.json');
    
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchQuryCity}&key=${WEATHER_API_KEY}`

    superAgent.get(url).then(dataWeather => {   //send req 
        // console.log(dataWeather);
        let arr = dataWeather.body.data.map(element => new Wether(searchQuryCity, element))
        // console.log(dataWeather.text);
        res.send(arr);
    });
};


function handleLocation(req,res) {
    const search_query = req.query.city; // localhost:3000/location?city=amman
    const city = [search_query]
    const sql = 'SELECT * FROM locations WHERE search_query=$1;'  //$1 = city[1]
    const url = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${search_query}&format=json`;
    // console.log(search_query);
    client.query(sql , city).then(element =>{
      console.log(element);
      if(element.rows.length !== 0){  // row=>for table
        res.send(element.rows[0]);
      }else{
        superAgent.get(url).then(locData =>{
          let location =  new Location(search_query,locData.body[0]);  //spicific the res from api
          let SQL='INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4);'  // to add this var
          console.log(locData.body[0]);
          let Values = [location.search_query, location.formatted_query, location.latitude, location.longitude];
          client.query(SQL, Values).then(result => {  //add this value to sql
          console.log(result);
        });
          res.status(200).send(location);
        }).catch((error)=>{
          // console.log(error);
          res.status(500).send(`something ${error}`);
        });
      }
    }) //go to data 'sql' & search about city
   
}

function handlePark(req, res){
      const search_query = req.query.city
      const url = `https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=${PARKS_API_KEY}`
      superAgent.get(url).then(parData => {
        let arr = parData.body.data.map(element => new Parks (element))
        // console.log(JSON.parse(dataWeather.text));
        res.send(arr);
        console.log(arr);
    }).catch((error)=>{
        res.status(500).send(`something ${error}`);
      });
}
function handleMoves(req, res){
    const search = req.query.city;
    const url = `https://api.themoviedb.org/3/movie/550?api_key=${MOVIE_API_KEY}&query=${search}`;

    superagent.get(url).then(mov => {
      let arr = mov.body.results.map(movData => new Movies(movData));
      res.status(200).send(arr);
    }).catch((error) => {
      res.status(500).send(`something ${error}`);
    });
}
function handleYelp(req,res) {
  const search_query = req.query.search_query;
  const url = `https://api.yelp.com/v3/businesses/search?location=${search_query}&limit=50&api_key=${YELP_API_KEY}`;
  superagent.get(url).then(res => {
    let arr = res.body.businesses.map(reskData => new Yelp(reskData));
    res.status(200).send(arr);
  }).catch((error) => {
    res.status(500).send(`something ${error}`);
  });
}



function Location (city, objLocation){
    this.search_query = city;
    this.formatted_query = objLocation.display_name;
    this.latitude = objLocation.lat;
    this.longitude = objLocation.lon;
}
function Wether (city, time){
    this.search_query = city;
    this.forecast = time.weather.description;
    this.time = time.datetime;
}
function Parks (data){
    this.name = data.fullName;
    this.address = Object.values(data.addresses[0]).join('-');
    this.fee = data.entranceFees[0].cost;
    this.description = data.description;
    this.url = data.url;
}
function Movies(){
    this.title = title;
    this.overview = overview;
    this.average_votes = average_votes;
    this.total_votes = total_votes;
    this.image_url = image_url;
    this.popularity = popularity;
    this.released_on = released_on;
}
function Yelp(){
    this.name = name;
    this.image_url = image_url;
    this.price = price;
    this.rating = rating;
    this.url = url;
}


function notFoundHandler(request, response) {response.status(404).send('requested API is Not Found!');}

