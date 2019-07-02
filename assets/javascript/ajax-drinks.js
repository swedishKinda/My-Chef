$(document).ready(function () {

    function drinkCall(query) {
        baseURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?"

        params = {
            ingredient: "i="
        }
        queryURL = baseURL + params.ingredient + query

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            response.data
            console.log(response.data)
        });
    }

    drinkCall(gin);
    console.log(drinkCall(gin));
    drinkCall(vodka);
    console.log(drinkCall(vodka));
    drinkCall(tequila);
    console.log(drinkCall(tequila))

});