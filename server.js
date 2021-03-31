const dotenv = require('dotenv');
dotenv.config();

const express = require('express')  //loud express module to our script
let app = express();

const superAgent = require('superagent');
const cors =require('cors');
app.use(cors());

const PORT = process.env.PORT || 3000
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY
const WEATHER_API_KEY = process.env.WEATHER_API_KEY
const PARKS_API_KEY = process.env.PARKS_API_KEY


app.listen(PORT,()=>{console.log(`i'm listen ${PORT}`);})

//route middlewares
app.get('/location',handleLocation);
app.get('/weather', handleWether);
// app.get('/park', handlePark);
app.get('*', notFoundHandler);



function handleWether(req, res){
    const searchQuryCity = req.query.city ;
    // const locationS = require('./data/weather.json');
    
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchQuryCity}&key=${WEATHER_API_KEY}`

    superAgent.get(url).then(dataWeather => {   //send req 
        let arr = JSON.parse(dataWeather.text).data.map(element => new Wether(searchQuryCity, element))
        // console.log(JSON.parse(dataWeather.text));
        res.send(arr);
    });
};


function handleLocation(req,res) {
    const search_query = req.query.city; // localhost:3000/location?city=amman
    const url = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${search_query}&format=json`;
    superAgent.get(url).then(loc =>{
      let arr =  new Location(search_query,loc.body[0]);
      res.status(200).send(arr);
    }).catch((error)=>{
      res.status(500).send(`something ${error}`);
    });
  }

function notFoundHandler(request, response) 
{  response.status(404).send('requested API is Not Found!');}


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
