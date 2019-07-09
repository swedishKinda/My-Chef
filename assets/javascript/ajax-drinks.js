$(document).ready(function () {

    // DOM manipulation variables:
    var firstForm = $(".first-form");
    var drinksForm = $(".drinks");
    var drinkCarousel = $(".display-slick");
    var randomDrinkButton = $("#random-drink");
    var drinkByIngredientButton = $("#drink-by-ingredient");
    var resetButton = $("#reset-button");

    // on click listeners & functions for DOM buttons

    $("#drinks").on("click", function () {
        firstForm.hide();
        drinksForm.show();
        resetButton.show();
    })

    randomDrinkButton.on("click", function () {
        getRandomDrink();
    })

    drinkByIngredientButton.on('click', function () {
        var input = $("#drink-ingredient-search").val().trim();
        if (input === "") {
            console.log('Please enter a valid search term');
        }
        else {
            getDrinkWithIngredient(input);
            drinksForm.hide();
            displayCarousel.show();
        }
    });

    $(document).on("click", ".carousel-item" , function() {
        var temp = $(this).attr('data-drink-id');
        singleDrink(temp); 
    });

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

        function singleDrink(drinkID) {
            var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkID;
          
            $.ajax({
              url: queryURL,
              method: "GET",
              // 
            }).then(function (response) {
              // do something with the response
              console.log(response)
              displaySingleDrink(response)
            });
          }

        function getDrinkWithIngredient(ingredient) {
            // AJAX call to MealDB API to return a list of drinks with a specific ingredient. 
            //    "ingredient" is passed as an argument as a string. 
            var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=";
            queryURL += ingredient

            $.ajax({
                url: queryURL,
                method: "GET",
                // 
            }).then(function (response) {
                // do something with the response
                // error handling for when no drinks are found in the DB for the particular ingredient. 
                if (response.drinks === null) {
                    console.log('no drinks found');
                }
                else {
                    console.log(response.drinks)
                    displayMultipleDrinks(response.drinks);
                }
            });
        }

        function displayMultipleDrinks(drinkArray) {
            var carouselDiv = $(".display-slick");

            for (var i = 0; i < drinkArray.length; i++) {
                var newDiv = $("<div>");
                var newImg = $("<img>");

                newImg.addClass('carousel-img');
                newImg.attr('src', drinkArray[i].strDrinkThumb)

                newDiv.addClass('carousel-item');
                newDiv.attr('data-drink-id', drinkArray[i].idDrink)
                newDiv.append(newImg);
                newDiv.append(drinkArray[i].strDrink)

                carouselDiv.append(newDiv);
            }

            carouselDiv.slick({
                centerMode: true,
                infinite: true,
                slidesToShow: 4,
                slidesToScroll: 4
            });

            carouselDiv.show();
        }
})   