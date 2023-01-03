const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const https = require('https');
app.set('view engine', 'ejs');

//app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const apiKey = process.env.API_KEY;

app.post('/', (req, res) => {
    let cityName = req.body.cityName;
    const weatherData = [];

    https.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`, (apiRes) => {

        if(apiRes.statusCode === 404 || cityName.length === 0){
            res.sendFile(__dirname + "/failure.html");
        }else{
            apiRes.on('data', (data) => {
                const apiData = JSON.parse(data);
                const temp = apiData.main.temp;
                const weatherDescription = apiData.weather[0].description;
                const icon = apiData.weather[0].icon;
                const imgURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    
                weatherData.push({
                    cityName: req.body.cityName,
                    temperature: temp,
                    weather: weatherDescription,
                    weatherIcon: imgURL
                });
    
                res.render('home', {weather: weatherData})
            });
        }
    }).on('error', (error) => {
        console.error(error);
    });
        
});

app.post('/failure', (req, res) => {
    res.redirect('/');
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
