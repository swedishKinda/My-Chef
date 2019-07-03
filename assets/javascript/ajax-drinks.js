$(document).ready(function () {

    function drinkCall(query) {
        baseURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?"

        params = {
            ingredient: "i="
        }
        queryURL = baseURL + params.ingredient + query

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            response
            console.log(response)
            console.log(response.drinks.length)
            for (var i=0; i < response.drinks.length;i++){
                console.log(response.drinks[i].strDrink)
            }
        
        });
    }

    drinkCall("Gin");
    drinkCall("Vodka");


});