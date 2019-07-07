// var zomato_api = "6033cf9c9a435982e202cd2eb5e7716c";
$(document).ready(function() {
    $('.display-slick').slick({
        dots: true,
        centerMode: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1
      });
  
// set up DOM manipulation variables:
var firstForm = $(".first-form");
var mealsForm = $(".meals");
var mealCarousel = $(".display-slick");
var randomMealButton = $("#random-meal");
var mealByIngredientButton = $("#meal-by-ingredient");



  // other DOM manipulation functions will go inside document.ready function here...
  $("#meals").on("click", function () {
    firstForm.hide();
    mealsForm.show();
  })

  randomMealButton.on('click', function() {
    getRandomMeal();
  })

  mealByIngredientButton.on('click', function() {
    var inputString = $("#meal-ingredient-search").val().trim();
    if (inputString === "") {
      console.log('please enter a search term');
    }
    else {
      getMealWithIngredient(inputString);
      mealsForm.hide();
      mealCarousel.show();
    }

  });









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
            console.log(response);
            displaySingleMeal(response);
    });
}

function getMealWithIngredient(ingredient) {
  // AJAX call to MealDB API to return a list of meals with a specific ingredient. 
  //    "ingredient" is passed as an argument as a string. 
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
    console.log(response)
    
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

function displayMultipleMeals (mealArray) {
   //  <div class="carousel-item"><img src="https://via.placeholder.com/200" class="carousel-img">Slide 1</div>
   var carouselDiv = $(".display-slick");

  for (var i=0; i < mealArray.length; i++) {
    var newDiv = $("<div>");
    var newImg = $("<img>");

   newImg.addClass('carousel-img');
   newImg.attr('src', mealArray[i].strMealThumb)
   
   newDiv.addClass('carousel-item');
   newDiv.append(newImg);
   newDiv.append(mealArray[i].strMeal)

   carouselDiv.append(newDiv);
  }
   
  // carouselDiv.slick({
  //   dots: true,
  //   centerMode: true,
  //   infinite: true,
  //   slidesToShow: 3,
  //   slidesToScroll: 1
  // });

  carouselDiv.show();

}