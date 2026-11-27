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
    card.style.animationDelay = i * 0.1 + "s";

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

// Mobile navigation menu
var navToggle = document.getElementById("navToggle");
var navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", function () {
  var isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

// Close the menu after choosing a link
navLinks.addEventListener("click", function () {
  navLinks.classList.remove("open");
  navToggle.setAttribute("aria-expanded", false);
});

// Smart clock: shows the visitor's local time, date and timezone
var clockTime = document.getElementById("clockTime");
var clockDate = document.getElementById("clockDate");
var clockIcon = document.getElementById("clockIcon");
var greeting = document.getElementById("greeting");

function updateClock() {
  var now = new Date();

  clockTime.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  var dateText = now.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  var zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  clockDate.textContent = dateText + " · " + zone.replace("_", " ");

  // Greeting and icon change with the time of day
  var hour = now.getHours();
  var text = "Good evening";
  var icon = "🌙";

  if (hour >= 5 && hour < 12) {
    text = "Good morning";
    icon = "🌅";
  } else if (hour >= 12 && hour < 17) {
    text = "Good afternoon";
    icon = "☀️";
  } else if (hour >= 17 && hour < 21) {
    text = "Good evening";
    icon = "🌇";
  }

  clockIcon.textContent = icon;
  greeting.textContent = text + "! What are you craving?";
}

updateClock();
setInterval(updateClock, 1000);

// Navbar shadow/shrink when scrolling
var navbar = document.querySelector(".navbar");

window.addEventListener("scroll", function () {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

// Reveal sections as they scroll into view
var revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
} else {
  revealItems.forEach(function (item) {
    item.classList.add("visible");
  });
}

// Popular search chips in the banner
var chips = document.querySelectorAll(".chip");

chips.forEach(function (chip) {
  chip.addEventListener("click", function () {
    searchInput.value = chip.getAttribute("data-query");
    searchMeals();
    document.getElementById("results-section").scrollIntoView({ behavior: "smooth" });
  });
});

// Custom mouse cursor: a dot that follows instantly and a ring that trails behind
var cursorDot = document.getElementById("cursorDot");
var cursorRing = document.getElementById("cursorRing");
var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canHover && !reduceMotion) {
  document.body.classList.add("custom-cursor");

  var mouseX = 0;
  var mouseY = 0;
  var ringX = 0;
  var ringY = 0;

  document.addEventListener("mousemove", function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorDot.style.transform = "translate(" + mouseX + "px, " + mouseY + "px)";
    document.body.classList.add("cursor-active");
  });

  // Ring eases toward the mouse position every frame
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.transform = "translate(" + ringX + "px, " + ringY + "px)";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Grow the ring over clickable things
  document.addEventListener("mouseover", function (event) {
    var clickable = event.target.closest("a, button, .card");
    cursorRing.classList.toggle("hovering", clickable !== null);
  });

  document.addEventListener("mousedown", function () {
    cursorRing.classList.add("clicking");
  });

  document.addEventListener("mouseup", function () {
    cursorRing.classList.remove("clicking");
  });

  // Hide when the mouse leaves the window
  document.addEventListener("mouseleave", function () {
    document.body.classList.remove("cursor-active");
  });
}

// Button click
searchBtn.addEventListener("click", searchMeals);

// Press Enter in the input box
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchMeals();
  }
});
