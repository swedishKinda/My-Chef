// var zomato_api = "6033cf9c9a435982e202cd2eb5e7716c";


function getRandomMeal() {
    // AJAX call to MealDB API to return a random meal
    var queryURL = "https://www.themealdb.com/api/json/v1/1/random.php";

    $.ajax ({
        url: queryURL,
        method: "GET",
    
        // 
        }).then(function(response) {
            // do something with the response
            console.log(response);
    });
    return response;
}

function getMealWithIngredient(ingredient) {
    // AJAX call to MealDB API to return a list of meals with a specific ingredient. 
    //    "ingredient" is passed as an arguement as a string. 
    var queryURL = "https://www.themealdb.com/api/json/v1/1/filter.php?i="; 
    queryURL += ingredient

    $.ajax ({
        url: queryURL,
        method: "GET",
    
        // 
        }).then(function(response) {
            // do something with the response
            console.log(response);
    });    
    return response;
}