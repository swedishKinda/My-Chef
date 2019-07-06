$(document).ready(function () {

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
            // response 
            console.log(response)
            // logging the number of drinks in response (object array of drink objects)
            console.log(response.drinks.length)

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

    drinkCall("Gin");

    function drinkRecipe(drinkID) {
        var baseURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
        var queryURL = baseURL + drinkID
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response.drinks);

            var ingredients = [];
            for (key in response.drinks[0]) {
                if (key.includes("strIngredient")) {
                    if (response.drinks[0][key] !== null && response.drinks[0][key] != "") {
                        ingredients.push(response.drinks[0][key]);
                    }

                }
            }
            console.log(ingredients)

            var measurements = [];
            for (key in response.drinks[0]) {
                if (key.includes("strMeasure")) {
                    if (response.drinks[0][key] !== null && response.drinks[0][key] != "" && response.drinks[0][key] != " ") {
                        measurements.push(response.drinks[0][key]);
                    }
                }
            }
            console.log(measurements);

            var instructions = response.drinks[0].strInstructions;
            console.log(instructions);

            var drinkImg = $("<img>");
            drinkImg.attr('src', response.drinks[0].strDrinkThumb);
            drinkImg.addClass('float-right, meal-img');
            $(".display-drink").append(drinkImg);
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
            $(".display-drink").append(drinkTable);
            $(".display-drink").append(response.drinks[0].strInstructions);

        })

    }

    // test drink recipe
    drinkRecipe("12402");

    $("#drinks").on("click", function () {
        console.log("I've been clicked")
    })

});