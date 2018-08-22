require("dotenv").config();

var fs = require("fs");
var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment');
var keys = require('./keys.js');
var spotifyKeys = keys.spotify;
var spotify = new Spotify({
    id: spotifyKeys.id,
    secret: spotifyKeys.secret,
  });

moment().format();

var action = process.argv[2];
var input = "";


for (i = 3; i < process.argv.length; i++) {
    console.log(process.argv[i]);
    input = input + " " + process.argv[i];
    input = input.trim();
}

console.log(input)
switch (action) {
    case "movie-this":
      movieThis();
      break;
    
    case "concert-this":
      concertThis();
      break;
    
    case "spotify-this-song":
      spotifySong();
      break;
    
    case "do-what-it-says":
      random();
      break;
    }

function movieThis(){

if(input == ""){
     input = "Mr. Nobody"
}
    console.log(input)
var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

request(queryUrl, function(error, response, body){
    if(!error && response.statusCode === 200) {
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Release Year: " + JSON.parse(body).Year);
        console.log("IMDB: " + JSON.parse(body).Ratings[1].Value);
        console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[2].Value);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Actors: " + JSON.parse(body).Actors);
        console.log("Plot: " + JSON.parse(body).Plot);
    }
});
};

function concertThis(){

    if(input == ""){
        input = "Wilco"
   }

    var queryUrl = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";
    
    request(queryUrl, function(error, response, body){
        
        if(!error && response.statusCode === 200) {
            console.log("Venue Name: " + JSON.parse(body)[0].venue.name);
            console.log("Venue Location: " + JSON.parse(body)[0].venue.country + ", " + JSON.parse(body)[0].venue.city);
            var dateTime = JSON.parse(body)[0].datetime
            var date = moment(dateTime).format('MM-DD-YYYY')
            console.log("Date: " + date);
        }
    });
    };

function spotifySong(){
    if (input ===""){
        input = "The Sign the Ace of Base"
    }
    spotify.search({ type: 'track', query: input }, function(err, data) {
    
        console.log("Artist(s):    " + data.tracks.items[0].artists[0].name);
        console.log("Song:         " + data.tracks.items[0].name);
        console.log("Preview Link: " + data.tracks.items[0].preview_url);
        console.log("Album:        " + data.tracks.items[0].album.name);
      });
};

function random (){
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }
      
        // Break the string down by comma separation and store the contents into the output array.
        var output = data.split(",");
      
        spotify.search({ type: 'track', query: output[1] }, function(err, data) {
    
            console.log("Artist(s):    " + data.tracks.items[0].artists[0].name);
            console.log("Song:         " + data.tracks.items[0].name);
            console.log("Preview Link: " + data.tracks.items[0].preview_url);
            console.log("Album:        " + data.tracks.items[0].album.name);
          });
        
      });
}