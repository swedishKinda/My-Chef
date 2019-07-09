$(document).ready(function () {

    // DOM manipulation variables:
    var firstForm = $(".first-form");
    var drinksForm = $(".drinks");
    var drinkCarousel = $(".display-slick");
    var randomDrinkButton = $("#random-drink");
    var drinkByIngredientButton = $("#drink-by-ingredient");

    // on click listeners & functions for DOM buttons

    $("#drinks").on("click", function () {
        firstForm.hide();
        drinksForm.show();
    })

    randomDrinkButton.on("click", function () {
        getRandomDrink ();
    })

    function getRandomDrink() {
        // AJAX call to API to return a random drink
        var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

        $.ajax({
            url: queryURL,
            method: "GET",
            // 
        }).then(function (response) {
            // do something with the response
            console.log(response);
            displaySingleDrink(response);
        });
    }

    function displaySingleDrink(response) {

        $(".display-single").html("<h3>" + response.drinks[0].strDrink + "</h3>");
        var ingredients = [];
        for (key in response.drinks[0]) {
            if (key.includes("strIngredient")) {
                if (response.drinks[0][key] !== null && response.drinks[0][key] != "") {
                    ingredients.push(response.drinks[0][key]);
                }

            }
        }

        var measurements = [];
        for (key in response.drinks[0]) {
            if (key.includes("strMeasure")) {
                if (response.drinks[0][key] !== null && response.drinks[0][key] != "" && response.drinks[0][key] != " ") {
                    measurements.push(response.drinks[0][key]);
                }
            }
        }
        var instructions = response.drinks[0].strInstructions;

        var drinkImg = $("<img>");
        drinkImg.attr('src', response.drinks[0].strDrinkThumb);
        drinkImg.addClass('float-right, meal-img');
        $(".display-single").append(drinkImg);
        var drinkTable = $("<table>");
        for (var i = 0; i < ingredients.length; i++) {
            var newRow = $("<tr>");
            var newCell = $("<td>");

            newCell.addClass('p-2')
            newCell.text(measurements[i]);
            newRow.append(newCell);

            newCell = $("<td>");
            newCell.addClass('p-2')
            newCell.text(ingredients[i]);
            newRow.append(newCell);

            drinkTable.append(newRow);
        }
        $(".display-single").append(drinkTable);
        $(".display-single").append(response.drinks[0].strInstructions);
        
    }

    function drinkCall(query) {
        var baseURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?"

        var params = {
            ingredient: "i="
        }

        var queryURL = baseURL + params.ingredient + query

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            // Returns 10 random drinks of alcohol entered in query
            for (var e = 0; e < 10; e++) {
                var item = response.drinks[Math.floor(Math.random() * response.drinks.length)];
                console.log(query + " Drink: " + JSON.stringify(item.strDrink));
            }
            // // Returns all drinks of alcohol entered in query
            // // for (var i = 0; i < response.drinks.length; i++) {
            // //     console.log(response.drinks[i].strDrink)


            // }

        });
    }
});