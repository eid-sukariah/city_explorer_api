const dotenv = require('dotenv');
dotenv.config();
const express = require('express')  //loud express module to our script
const PORT = process.env.PORT || 3000
const app = express();   //creat server application
const cors =require('cors');
app.use(cors());


app.get('/location',handleLocation);
app.get('/weather', handleWether);
// app.get('/',handleError);

function handleWether(req, res){
    const searchQuryCity = req.query.city ;
    const locationS = require('./data/weather.json');

    let arr =[];
    locationS.data.forEach(element =>{
        let newWeth = new Wether(searchQuryCity, element);
        arr.push(newWeth)
    });
    res.send(arr);

};


function handleLocation(req , res){
    const searchQuryCity = req.query.city ;
    const locationS = require('./data/location.json');

    let newLoc = new Location(searchQuryCity, locationS[0]);
    res.send(newLoc);
}

function Location (city, objLocation){
    this.search_query = city;
    this.formatted_query = objLocation.display_name;
    this.latitude = objLocation.lat;
    this.longitude = objLocation.lon;
};

function Wether (city, objWether){
    this.search_query = city;
    this.forecast = objWether.weather['description'];
    this.time = objWether.datetime;
};

app.listen(PORT,()=>{console.log(`i'm listen ${PORT}`);})