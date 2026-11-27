// Get elements from the page
var searchInput = document.getElementById("searchInput");
var searchBtn = document.getElementById("searchBtn");
var results = document.getElementById("results");
var message = document.getElementById("message");

// Search meals by name using TheMealDB API
function searchMeals() {
  var name = searchInput.value.trim();

  if (name === "") {
    message.textContent = "Please type something to search.";
    results.innerHTML = "";
    return;
  }

  message.textContent = "Loading...";
  results.innerHTML = "";

  var url = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + name;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      showMeals(data.meals);
    })
    .catch(function (error) {
      message.textContent = "Something went wrong. Try again.";
      console.log(error);
    });
}

// Show only the first 5 meals
function showMeals(meals) {
  results.innerHTML = "";

  // API returns null when nothing is found
  if (meals === null) {
    message.textContent = "No meals found.";
    return;
  }

  message.textContent = "";

  var firstFive = meals.slice(0, 5);

  for (var i = 0; i < firstFive.length; i++) {
    var meal = firstFive[i];

    var card = document.createElement("div");
    card.className = "card";

    card.innerHTML =
      '<img src="' + meal.strMealThumb + '" alt="' + meal.strMeal + '">' +
      '<div class="card-body">' +
      "<h3>" + meal.strMeal + "</h3>" +
      "<p>" + meal.strCategory + " • " + meal.strArea + "</p>" +
      '<a href="' + meal.strSource + '" target="_blank">View recipe</a>' +
      "</div>";

    results.appendChild(card);
  }
}

// Button click
searchBtn.addEventListener("click", searchMeals);

// Press Enter in the input box
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchMeals();
  }
});
