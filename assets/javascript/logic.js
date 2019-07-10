// var zomato_api = "6033cf9c9a435982e202cd2eb5e7716c";
$(document).ready(function() {
    // $('.display-slick').slick({
    //     dots: true,
    //     centerMode: true,
    //     infinite: true,
    //     slidesToShow: 3,
    //     slidesToScroll: 1
    //   });
  
// set up DOM manipulation variables:
var firstForm = $(".first-form");
var mealsForm = $(".meals");
var displayCarousel = $(".display-slick");
var randomMealButton = $("#random-meal");
var mealByIngredientButton = $("#meal-by-ingredient");
var resetButton = $("#reset-button");    
var drinksForm = $(".drinks");
var randomDrinkButton = $("#random-drink");
var drinkByIngredientButton = $("#drink-by-ingredient");


  // other DOM manipulation functions will go inside document.ready function here...
  $("#meals").on("click", function () {
    firstForm.hide();
    mealsForm.show();
    resetButton.show();
  })

  $("#drinks").on("click", function () {
    firstForm.hide();
    drinksForm.show();
    resetButton.show();
})

  randomMealButton.on('click', function() {
    getRandomMeal();
  })

  randomDrinkButton.on("click", function () {
    getRandomDrink();
})

  mealByIngredientButton.on('click', function() {
    var inputString = $("#meal-ingredient-search").val().trim();
    if (inputString === "") {
      console.log('please enter a search term');
    }
    else {
      getMealWithIngredient(inputString);
      mealsForm.hide();
      displayCarousel.show();
    }

  });

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
    var temp = $(this).attr('data-meal-id');
    var temp2 = $(this).attr('data-drink-id');
    if (temp === undefined) {
      singleDrink(temp2);
    }
    else {
      singleMeal(temp); 
    }
});

resetButton.on('click', function() {
  resetButton.hide();
  displayCarousel.slick('unslick');
  displayCarousel.empty();
  displayCarousel.hide();
  $(".display-single").empty();
  firstForm.show();
  mealsForm.hide();

})





});  // close document.ready for DOM manipulation.


function getRandomMeal() {
    // AJAX call to MealDB API to return a random meal
    var queryURL = "https://www.themealdb.com/api/json/v1/1/random.php";

    $.ajax ({
        url: queryURL,
        method: "GET",
        // 
        }).then(function(response) {
            // do something with the response
            displaySingleMeal(response);
    });
}

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

function getMealWithIngredient(ingredient) {
  // AJAX call to MealDB API to return a list of meals with a specific ingredient. 
  //    "ingredient" is passed as an argument as a string. 
  console.log(ingredient);

  var queryURL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";
  queryURL += ingredient

  $.ajax({
    url: queryURL,
    method: "GET",
    // 
  }).then(function (response) {
    // do something with the response
    // error handling for when no meals are found in the DB for the particular ingredient. 
    if (response.meals === null) {
      console.log('no meals found');
    }
    else {
      console.log(response.meals)
      displayMultipleMeals(response.meals);
    }
  });
}



function singleMeal(mealID) {
  var queryURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealID;

  $.ajax({
    url: queryURL,
    method: "GET",
    // 
  }).then(function (response) {
    // do something with the response
    displaySingleMeal(response)
  });
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

function displaySingleMeal(mealToDisplay) {
  var ingredients = [];
  var measurements = [];
  var mealDisplay = $(".display-single");

  mealDisplay.html("<h3>" + mealToDisplay.meals[0].strMeal + "</h3>");
  for (key in mealToDisplay.meals[0]) {
    if (key.includes("strIngredient")) {
      if (mealToDisplay.meals[0][key] !== null && mealToDisplay.meals[0][key] !== "") {
        ingredients.push(mealToDisplay.meals[0][key]);
      }
    }
  }
  for (key in mealToDisplay.meals[0]) {
    if (key.includes("strMeasure")) {
      if (mealToDisplay.meals[0][key] !== null && mealToDisplay.meals[0][key] !== "") {
        measurements.push(mealToDisplay.meals[0][key]);
      }
    }
  }
  var mealImg = $("<img>");
  mealImg.attr('src', mealToDisplay.meals[0].strMealThumb);
  mealImg.addClass('float-right, meal-img');
  mealDisplay.append(mealImg);
  var mealTable = $("<table>");
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

    mealTable.append(newRow);
  }
  mealDisplay.append(mealTable);
  mealDisplay.append(mealToDisplay.meals[0].strInstructions);
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

function displayMultipleMeals (mealArray) {
   //  <div class="carousel-item"><img src="https://via.placeholder.com/200" class="carousel-img">Slide 1</div>
   var carouselDiv = $(".display-slick");

  for (var i=0; i < mealArray.length; i++) {
    var newDiv = $("<div>");
    var newImg = $("<img>");

   newImg.addClass('carousel-img');
   newImg.attr('src', mealArray[i].strMealThumb)
   
   newDiv.addClass('carousel-item');
   newDiv.attr('data-meal-id', mealArray[i].idMeal)
   newDiv.append(newImg);
   newDiv.append(mealArray[i].strMeal)

   carouselDiv.append(newDiv);
  }
   
  carouselDiv.slick({
    dots: true,
    centerMode: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1
  });

  carouselDiv.show();

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