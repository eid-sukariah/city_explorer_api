const dotenv = require('dotenv');
dotenv.config();
const express = require('express')  //loud express module to our script
const PORT = process.env.PORT || 3000
const app = express();   //creat server application

const cors =require('cors');
app.use(cors());

app.listen(PORT,()=>{
    console.log(`i'm listen ${PORT}`);
})
app.get('/location',hadleRequest);

function hadleRequest(req , res){
    const searchQuryCity = req.query.city ;
    const locationS = require('./data/location.json')

    let newLoc = new Location(searchQuryCity, locationS[0]);
    res.send(newLoc);
}

function Location (city, objK){
    this.search = city;
    this.lat = objK.lat;
    this.lon = objK.lon;
    this.display_name = objK.display_name;
    this.type = objK.type;
}