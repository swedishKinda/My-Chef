// var zomato_api = "6033cf9c9a435982e202cd2eb5e7716c";
$(document).ready(function() {
//     $('.multiple-items').slick({
//         dots: true,
//         centerMode: true,
//         infinite: true,
//         slidesToShow: 3,
//         slidesToScroll: 1
//       });


// other DOM manipulation functions will go inside document.ready function here...










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
            return response;
    });
    
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

function singleMeal(mealID) {
    var queryHTML = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealID;
    var ingredients = [];
    var measurements = [];
  
    $.ajax ({
      url: queryHTML,
      method: "GET",
  
      // 
      }).then(function(response) {
          // do something with the response
          console.log(response)
          $(".display-single").html("<h3>" + response.meals[0].strMeal + "</h3>");
          for (key in response.meals[0]) {
            if (key.includes("strIngredient")) {
              if (response.meals[0][key] !== null && response.meals[0][key] !== "") {
                ingredients.push(response.meals[0][key]);
              }
            }
          }
          for (key in response.meals[0]) {
            if (key.includes("strMeasure")) {
              if (response.meals[0][key] !== null && response.meals[0][key] !== "") {
                measurements.push(response.meals[0][key]);
              }
            }
          }
          var mealImg = $("<img>");
          mealImg.attr('src', response.meals[0].strMealThumb);
          mealImg.addClass('float-right, meal-img');
          $(".display-single").append(mealImg);
          var mealTable = $("<table>");
          for (var i=0; i < ingredients.length; i++) {
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
          $(".display-single").append(mealTable);
          $(".display-single").append(response.meals[0].strInstructions);
      });
  
    
  }