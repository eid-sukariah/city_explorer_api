
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY
const WEATHER_API_KEY = process.env.WEATHER_API_KEY
const PARKS_API_KEY = process.env.PARKS_API_KEY



//route middlewares
app.get('/location',handleLocation);
app.get('/weather', handleWether);
app.get('/parks', handlePark);
app.get('*', notFoundHandler);



function handleWether(req, res){
    const searchQuryCity = req.query.search_query ;
    // const locationS = require('./data/weather.json');
    
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchQuryCity}&key=${WEATHER_API_KEY}`

    superAgent.get(url).then(dataWeather => {   //send req 
        console.log(dataWeather);
        let arr = dataWeather.body.data.map(element => new Wether(searchQuryCity, element))

        res.send(arr);
    });
};


function handleLocation(req,res) {
    const search_query = req.query.city; // localhost:3000/location?city=amman


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
function notFoundHandler(request, response) {response.status(404).send('requested API is Not Found!');}


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