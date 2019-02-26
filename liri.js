//Require .env File
require("dotenv").config();

//Require Request
let request = require("request");

//Require Moment
const moment = require('moment');

//Require File Systems
const fs = require("fs");

//Link Key Page
var keys = require("./keys.js");

//Initialize Spotify
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotifyKeys);

//OMDB and Bands in town API's
let omdb = (keys.omdb);
let bandsintown = (keys.bandsintown);

//in take user command and input

let userInput = process.argv[2];
let userQuery = process.argv.slice(3).join(" ");

//Main code
function userCommand(userInput, userQuery){
    switch(userInput){
        
        case "concert-this":
            concertThis();
            break;
        
        case "spotify-this":
            spotifyThisSong(userQuery);
            break;
        
        case "movie-this":
            movieThis(userQuery);
            break;
        
        case "do-what-it-says":
            doWhatItSays();
            break;
        
        default:
            console.log("I don't understand. I got a command " + userInput);
            break;
    }
}

userCommand(userInput, userQuery);

function spotifyThisSong(userQuery) {
    spotify.search({ 
        type: 'track', 
        query: userQuery,
        limit: 5
    }, function (err, data) {
        let spotifyArr = data.tracks.items;

        for (i=0; i<spotifyArr.length; i++){
            console.log(`\nTa-Da!  Here are your results...\n
            Artist: ${data.tracks.items[i].album.artists[0].name}
            Song: ${data.tracks.items[i].name}
            Album: ${data.tracks.items[i].album.name}
            Spotify link: ${data.tracks.items[i].external_urls.spotify}\n\n - - - - -`)
        }    
        }
    )};


function concertThis(){
    console.log(`\n- - - - -\n\nSEARCHING FOR...${userQuery}'s next show...`);

    request("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=" + bandsintown, function (error, response, body){

    if(!error && response.statusCode === 200){
        let userBand = JSON.parse(body);
        if(userBand.length > 0){
            for(i=0; i < 1; i++){ 
                    //console data
                    console.log(`\nTa DA! Here you go...\n\nArtist: ${userBand[i].lineup[0]}\nVenue: ${userBand[i].venue.name}\nVenue Location: ${userBand[i].venue.latitude},${userBand[i].venue.longitude}\nVenue City:${userBand[i].venue.city},${userBand[i].venue.country}`)
                    //moment .JS to format Date
                    let concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY hh:00 A");
                };
        }else {
            console.log('Band or concert not found!');
        };
    };
    });

};

function movieThis(){
    console.log(`\n - - - - -\n\nSearching for..."${userQuery}"`);
    if(!userQuery){
        userQuery = "mr nobody";
    };
    
    request("http://www.omdbapi.com/?t=" + userQuery + "&apikey=86fe999c", function (error, response, body) {
        let userMovie = JSON.parse(body);

        let ratingsArr = userMovie.Ratings;
        if (ratingsArr.length > 2) {}

        if (!error && response.statusCode === 200){
            
            var rottenTomatoesRating;

            for (i=0; i<userMovie.Ratings.length; i++){
                var ratings = userMovie.Ratings[i];
                if (ratings.Source === "Rotten Tomatoes"){
                    rottenTomatoesRating = ratings.Value;
                }
            }

            console.log(`\nTa-Da! That's for you... 
            Title: ${userMovie.Title}
            Year:${userMovie.Year}
            Rated:${userMovie.Rated}
            Rotten Tomatoes:${rottenTomatoesRating}
            Country:${userMovie.Country}
            Language:${userMovie.Language}
            Plot:${userMovie.Plot}
            Cast: ${userMovie.Actors}`);
        }
});
}



function doWhatItSays(){ 
fs.readFile('random.txt', 'utf8', function(err,data){
    if (err) throw err;

    var dataArr = data.split(',');

    if(dataArr.length === 2){
        userCommand(dataArr[0], dataArr[1]);
    }else if (dataArr.length ===1){
        userCommand(dataArr[0]);
    }
});
}