var moves;
var misses;
var activeCards = 0;
var content = ["🍇", "🍈", "🍉", "🍊", "🍋", "🍋‍🟩", "🍌", "🍍","🍇", "🍈", "🍉", "🍊", "🍋", "🍋‍🟩", "🍌", "🍍"];
var flippedCards;
var activatedCards;
var countdown = null;
var round = 1;
var totalPoints = 0;
var levelPoints;
const flipSound = new Audio("./sounds/card-flip.mp3");
flipSound.volume = 0.2;
const winSound = new Audio("./sounds/correct.mp3");
winSound.volume = 0.075;
const buttonClick = new Audio("./sounds/button-click.mp3");
buttonClick.volume = 0.3;
function displayResults(){
    var labels = $(".footer-style").find("h1");
    $("#moves").html(`Moves: ${moves}`);
    $("#round").html(`Round: ${round}`)
    $("#misses").html(`Misses: ${misses}`);
}

function initialize(){
    $("div.tile.hide").removeClass("hide");
    $("div.card.action").removeClass("action");
    $("div.stats").addClass("hide");
    round++;
    levelPoints = 0;
    activeCards = 0;
    moves = 0;
    misses = 0;
    var indices = [];
    flippedCards = [];
    activatedCards = [];
    var cardBacks = $(".back");
    var length = content.length;
    var random;
    for(var i = 0;i < length; i++){
        indices.push(i);
    }
    for(var i = 0; i < content.length; i++){
        random = Math.floor(Math.random()*indices.length);
        $(cardBacks[i]).html(content[indices[random]]);
        indices.splice(random,1);
    }
    displayResults();
}

$(document).ready(function(){
    round = 0;
    initialize();
});

function checkCards(){
    if($(flippedCards[0]).find(".back").html() === $(flippedCards[1]).find(".back").html()){
        winSound.play();
        $(flippedCards[0]).addClass("hide");
        $(flippedCards[1]).addClass("hide");
        levelPoints += 10;
        totalPoints += 10;
        var classes = $("div.tile.hide");
        if(classes.length === 16){
            $("#points").html(`Points: ${levelPoints}`);
            $("#result-title").html(`Round ${round} Results:`);
            var accuracy = (moves-misses)/(moves)*100;
            $("#accuracy").html(`Accuracy: ${Math.round(accuracy)}%`);
            $("div.stats").removeClass("hide");
            $("div.stats").css("opacity", "1");
        }
    }
    else{
        for(var i = 0; i < flippedCards.length; i++){
            if(activatedCards.includes(flippedCards[i].find(".card").attr("id"))){
                misses++;
                levelPoints -= 5;
                totalPoints -= 5;
                break;
            }
        }
        for(var i = 0; i < flippedCards.length; i++){
            if(!activatedCards.includes(flippedCards[i].find(".card").attr("id"))){
                activatedCards.push(flippedCards[i].find(".card").attr("id"));
            }
        }
        $(flippedCards[0]).find(".card").removeClass("action");
        $(flippedCards[1]).find(".card").removeClass("action");
    }
    $("#total").html(`Total Points: ${totalPoints}`);
    moves++;
    displayResults();
    activeCards = 0;
    flippedCards = [];
    countdown = null;
}

function handleClick(){

    if(activeCards < 2){
        if(!($(this).find(".card").hasClass("action"))){
            activeCards++;
            flippedCards.push($(this));
            flipSound.play();
            $(this).find(".card").toggleClass("action");
        }
    }
    if(activeCards === 2 && countdown !== null){
        var check = 1;
        for(var i = 0; i < flippedCards.length; i++){
            if(flippedCards[i].is($(this))){
                check = 0;
                break;
            }
        }
        if(check){
            clearTimeout(countdown);
            countdown = null;
            checkCards();
            activeCards++;
            flippedCards.push($(this));
            flipSound.play();
            $(this).find(".card").toggleClass("action");
        }
    }
    else if(activeCards === 2){
        for(var i = 0; i < flippedCards.length; i++){
            flippedCards[i].off("click");
        }
        countdown = setTimeout(checkCards,2000);
        for(var i = 0; i < flippedCards.length; i++){
            flippedCards[i].on("click", handleClick);
        }
    }
}

$(".tile").on("click", handleClick); 

$("button").on("click", function(){
    buttonClick.play();
    initialize();
}
);
