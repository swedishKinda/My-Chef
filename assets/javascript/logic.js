var state = {
  // Using a state object to track the last seen open form when an modal alert 
  //  is displayed. 
  // Also using the slickUsed to determine if we need to 'unslick' the carousel div to 
  //  be refilled with new recpie or drink fingernails. 
  slickUsed: false,
  lastView: ""
}

$(document).ready(function() {
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
var recipeDisplay = $(".display-single");


  // other DOM manipulation functions will go inside document.ready function here...

  // Click listener for the meals button.
  $("#meals").on("click", function () {
    // sets the object state, hides the start form, and shows the reset button and the meals form. 
    state.lastView = ".meals";
    firstForm.hide();
    mealsForm.show();
    resetButton.show();
  });

  // Click listener for the drinks button.
  $("#drinks").on("click", function () {
    // sets the object state, hides the start form, and shows the reset button and the drinks form. 
    state.lastView = ".drinks";
    firstForm.hide();
    drinksForm.show();
    resetButton.show();
  });

  randomMealButton.on('click', function() {
    // calls the function to get a random meal.
    getRandomMeal();
  });

  randomDrinkButton.on("click", function () {
    // calls the function to get a random drink. 
    getRandomDrink();
  });

  mealByIngredientButton.on('click', function() {
    // Does an API call to mealsDB to pull a list of meals with a single ingredient, which is pulled from an input field.

    // pull the input from the text field
    var inputString = $("#meal-ingredient-search").val().trim();
    if (inputString === "") {
      // handle blank input
      showAlert('Please enter a valid search term.');
    }
    else {
      // call a function to do the AJAX call with the validated ingredient
      getMealWithIngredient(inputString);
      // hide the meal search form and prepare to display the info in a carousel. 
      mealsForm.hide();
      displayCarousel.show();
    }
  });

  drinkByIngredientButton.on('click', function () {
    // Does an API call to drinkeDB to pull a list of drinks with a single ingredient, which is pulled from an input field.

    // pull the input from the text field
    var input = $("#drink-ingredient-search").val().trim();
    if (input === "") {
      // handle blank input
      showAlert('Please enter a valid search term.');
    }
    else {
      // call a function to do the AJAX call with the validated ingredient
      getDrinkWithIngredient(input);
      // hide the meal search form and prepare to display the info in a carousel.
      drinksForm.hide();
      displayCarousel.show();
    }
  });

  //DOM click listener for the carousel items. 
  $(document).on("click", ".carousel-item" , function() {
    // need to check to see if we are displaying drinks or meals
    var temp = $(this).attr('data-meal-id');
    var temp2 = $(this).attr('data-drink-id');
    // determine if we have a drink or meal being clicked, and call the appropriate display function. 
    if (temp === undefined) {
      singleDrink(temp2);
    }
    else {
      singleMeal(temp); 
    }
  });

// click listener for the reset button.
  resetButton.on('click', function() {
    // Check to see if we used the slick carousel. if we did, we have to 'unslick' the div to remove all of the 
    //  extra code so that we can re-write it and re-add the code if necessary
    if(state.slickUsed) {
      displayCarousel.slick('unslick');
    state.slickUsed = false;
    }
    // empty the carousel and hide it
    displayCarousel.empty();
    displayCarousel.hide();
    // empty the single recipe display
    recipeDisplay.hide();
    // reset display to the initial form
    firstForm.show();
    mealsForm.hide();
    drinksForm.hide();

  });

  // Click listener for the OK button on the modal alert div. 
  $("#clear-alert").on('click', function() {
    // clear the modal alert. 
    $(".my-alert").hide();
    $(state.lastView).show();
  });

});  // close document.ready for DOM manipulation.

//--------------------------------------------------
//
// Random API call functions
//
//--------------------------------------------------

function getRandomMeal() {
    // AJAX call to MealDB API to return a random meal
    var queryURL = "https://www.themealdb.com/api/json/v1/1/random.php";

    $.ajax ({
        url: queryURL,
        method: "GET",
        // 
        }).then(function(response) {
            // Call the display function, passing in the single meal JSON response.
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
      // Call the recipe display function, passing in the single drink JSON response.
      displaySingleDrink(response);
  });
}

//--------------------------------------------------
//
// Search with ingredient functions
//
//--------------------------------------------------

function getMealWithIngredient(ingredient) {
  // AJAX call to MealDB API to return a list of meals with a specific ingredient. 
  //    "ingredient" is passed as an argument as a string. 

  var queryURL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";
  queryURL += ingredient;

  $.ajax({
    url: queryURL,
    method: "GET",
    // 
  }).then(function (response) {
    // error handling for when no meals are found in the DB for the particular ingredient. 
    if (response.meals === null) {
      showAlert('There were no meals found with that search term. Please try again.');
    }
    else {
      // call the multiple display function to put the meals into the carousel display. 
      //   here, we are passing the meal array as an array. 
      displayMultipleMeals(response.meals);
    }
  });
}

function getDrinkWithIngredient(ingredient) {
  // AJAX call to drinksDB API to return a list of drinks with a specific ingredient. 
  //    "ingredient" is passed as an argument in a string. 
  var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=";
  queryURL += ingredient

  $.ajax({
      url: queryURL,
      method: "GET",
      // 
  }).then(function (response) {
      // do something with the response
      // error handling for when no drinks are found in the DB for the particular ingredient. 
      if (response.drinks === undefined) {
          showAlert('There were no meals found with that search term. Please try again.');
      }
      else {
          console.log(response.drinks)
          displayMultipleDrinks(response.drinks);
      }
  });
}

//--------------------------------------------------
//
// Get specific item functions
//
//--------------------------------------------------

function singleMeal(mealID) {
  // build the jquery URL using the meal ID passed in as an argument. 
  var queryURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealID;

  $.ajax({
    // make the AJAX call using the URL we built.
    url: queryURL,
    method: "GET",
    // 
  }).then(function (response) {
    // Call the recipe display function, passing in the single meal as a JSON response
    displaySingleMeal(response);
  });
}

function singleDrink(drinkID) {
  // build the jquery URL using the drink ID passed in as an argument. 
  var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkID;

  $.ajax({
    // make the AJAX call using the URL we built.
    url: queryURL,
    method: "GET",
    // 
  }).then(function (response) {
    // Call the recipe display function, passing in the single drink as a JSON response
    displaySingleDrink(response);
  });
}

//--------------------------------------------------
//
// Single recipe display functions
//
//--------------------------------------------------

function displaySingleMeal(mealToDisplay) {
  // setting some local variables to assist in the display of the meal. 
  var ingredients = [];
  var measurements = [];
  var mealDisplay = $(".display-single");
  var mealImg = $("<img>");
  var mealTable = $("<table>");

  // start building the display of the meal. 
  mealDisplay.html("<h3>" + mealToDisplay.meals[0].strMeal + "</h3>");

  // This code that checks each key in the JSON to see if it is one of the ingredient keys.
  //  if it is, and it does not contain an empty string or a null value, that data is pushed 
  //  into our ingredients display. 
  for (key in mealToDisplay.meals[0]) {
    if (key.includes("strIngredient")) {
      if (mealToDisplay.meals[0][key] !== null && mealToDisplay.meals[0][key] !== "") {
        ingredients.push(mealToDisplay.meals[0][key]);
      }
    }
  }
  // this code does the same as the above code, except for measurements. 
  for (key in mealToDisplay.meals[0]) {
    if (key.includes("strMeasure")) {
      if (mealToDisplay.meals[0][key] !== null && mealToDisplay.meals[0][key] !== "") {
        measurements.push(mealToDisplay.meals[0][key]);
      }
    }
  }
  // set attributes for our image, and append it to the display div
  mealImg.attr('src', mealToDisplay.meals[0].strMealThumb);
  mealImg.addClass('float-right, meal-img');
  mealDisplay.append(mealImg);
  
  // loop through the ingredients and measurements arrays, and display this data in a table
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
  // append the measurements/ingredients table to the div
  mealDisplay.append(mealTable);
  mealDisplay.append(mealToDisplay.meals[0].strInstructions);
  // include a clearfix div to make the display look nice 
  mealDisplay.append("<div style='clear: both;'></div>");
  mealDisplay.show();
}

function displaySingleDrink(response) {
  // setting some local variables to assist in the display of the drink. 
  var ingredients = [];
  var measurements = [];
  var drinkDisplay = $(".display-single");
  var drinkImg = $("<img>");
  var drinkTable = $("<table>");

  // start building the display of the meal. 
  drinkDisplay.html("<h3>" + response.drinks[0].strDrink + "</h3>");
 
  // This code that checks each key in the JSON to see if it is one of the ingredient keys.
  //  if it is, and it does not contain an empty string or a null value, that data is pushed 
  //  into our ingredients display. 
  for (key in response.drinks[0]) {
    if (key.includes("strIngredient")) {
      if (response.drinks[0][key] !== null && response.drinks[0][key] != "") {
          ingredients.push(response.drinks[0][key]);
      }
    }
  }
  // this code does the same as the above code, except for measurements. 
  for (key in response.drinks[0]) {
    if (key.includes("strMeasure")) {
      if (response.drinks[0][key] !== null && response.drinks[0][key] != "" && response.drinks[0][key] != " ") {
          measurements.push(response.drinks[0][key]);
      }
    }
  }
  // set attributes for our image, and append it to the display div
  drinkImg.attr('src', response.drinks[0].strDrinkThumb);
  drinkImg.addClass('float-right, meal-img');
  drinkDisplay.append(drinkImg);
  
  // loop through the ingredients and measurements arrays, and display this data in a table
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
  // append the measurements/ingredients table to the div
  drinkDisplay.append(drinkTable);
  drinkDisplay.append(response.drinks[0].strInstructions);
  // include a clearfix div to make the display look nice 
  drinkDisplay.append("<div style='clear: both;'></div>");
  drinkDisplay.show();
}

//--------------------------------------------------
//
// Multiple response display functions
//
//--------------------------------------------------

function displayMultipleMeals (mealArray) {
  // since we are using the slick carousel to display multiple responses, we flag the state variable
  state.slickUsed = true;
  var carouselDiv = $(".display-slick");

  // loop through the meal array passed in the argument, adding a div for each item to be 
  //  loaded into the carousel. 
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
   
  // this code sets up our carousel. 
  //  for more information you can check out https://kenwheeler.github.io/slick/
  carouselDiv.slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3
  });
  // show our super-cool carousel!!!
  carouselDiv.show();
}

function displayMultipleDrinks(drinkArray) {
  // since we are using the slick carousel to display multiple responses, we flag the state variable
  state.slickUsed = true;
  var carouselDiv = $(".display-slick");

  // loop through the drink array passed in the argument, adding a div for each item to be 
  //  loaded into the carousel. 
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
  // this code sets up our carousel. 
  //  for more information you can check out https://kenwheeler.github.io/slick/
  carouselDiv.slick({
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 4
  });
  // show our super-cool carousel!!!
  carouselDiv.show();
}

//--------------------------------------------------
//
// Modal alert display function
//
//--------------------------------------------------

function showAlert(alertText) {
  // This function shows a modal alert div, and places the alertText into the display div. 

  // define the variables that center the div on the page based on the height and width of the page,
  //  and the height and width of the alert div. 
  var alertTop = Math.floor((($(window).height())/2) - 60);       // Div is 120px wide
  var alertLeft = Math.floor((($(window).width())/2) - 190);    // Div is 380px wide. 

  // set the alert text
  $(".alert-text").text(alertText);

  // set the left and top attributes of the div to re-center the div in the wondow
  $(".my-alert").css('top', alertTop);
  $(".my-alert").css('left', alertLeft);

  //show the div as a modal alert
  $(".my-alert").show();
}