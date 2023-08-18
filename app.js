import jsdom from 'jsdom';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';

const app = express();

const { JSDOM } = jsdom;

const html = fs.readFileSync('views/index.ejs', 'utf-8');

app.set('view engine', 'ejs');

// The bodyparser() module is used for passing the clicked_bt body, so you can read post data. It will then listen for POST requests on the route /
app.use(bodyParser.urlencoded({ extended: true }));

//[Static files] This line of code specifies a static folder which helps render the images and css file
app.use(express.static("public"));



// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// Create a new DOM environment using jsdom
const dom = new JSDOM(html);

// Access and manipulate the DOM
const document = dom.window.document;

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");


app.post('/', (req, res) => {

    let clicked_btn = req.body.buttonID;
    console.log(`Form clicked_btn info: ${clicked_btn}`);


    if (clicked_btn === 'unfunded'){
        clicked_btn = filterUnfundedOnly();
    }else if(clicked_btn === 'funded'){
        clicked_btn = filterFundedOnly();
    }else{
        clicked_btn = showAllGames();
    }

    res.render('index', {games: clicked_btn, displayStr: displayStr});
});


app.get('/', (req, res)=>{


    res.render('index', {games: GAMES_JSON, displayStr: displayStr, topFundedGames: [first, second]});
});

app.listen(3000, () => {
    console.log(`Server is listening on port ${3000}`);
});


/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/



// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    // deleteChildElements(gamesContainer);

    const result = GAMES_JSON.filter((game) => game.pledged < game.goal);

    return result;
    // use filter() to get a list of games that have not yet met their goal

    // use the function we previously created to add the unfunded games to the DOM
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    
    const result = GAMES_JSON.filter((game) => game.pledged > game.goal);

    return result;
    // use the function we previously created to add unfunded games to the DOM

}

// console.log(`New Funded games:  ${filterFundedOnly().length}`);


// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    return GAMES_JSON;
}



/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// use filter or reduce to count the number of unfunded games
const num_funded = filterFundedOnly().length;
const totalRaised = showAllGames().reduce((accumulator, currGame)=>{ return accumulator + currGame.pledged}, 0);

const displayStr = `A total of $${totalRaised.toLocaleString('en-US')} has been raised for ${GAMES_JSON.length} games. Currently, ${GAMES_JSON.length - num_funded} games remain unfunded. We need your help to fund these amazing games!`;

// create a string that explains the number of unfunded games using the ternary operator


// create a new DOM element containing the template string and append it to the description container

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});







// use destructuring and the spread operator to grab the first and second games
const [first, second] = sortedGames;
const {firstGame, secondGame, ...remainingGames} = sortedGames;

console.log([first.name, second.name]);
// create a new element to hold the name of the top pledge game, then append it to the correct element

// do the same for the runner up item