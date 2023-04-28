const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const express = require("express");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Middleware to deliver static files in this case CSS and JavaScript
app.use(express.static("public"));

//Middleware to read form data
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/recommend", function (req, res) {
  res.render("recommend");
});

app.get("/restaurants", function (req, res) {
  const storedRestaurants = getStoredRestaurants();

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
});

app.get("/restaurants/:id", function (req, res) {
  // restaurants/{uniqueId}
  const restaurantId = req.params.id;
  const storedRestaurants = getStoredRestaurants();

  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      return res.render("restaurant-details", { restaurant: restaurant });
    }
  }

  res.status(404).render("404");
});

app.post("/recommend", function (req, res) {
  const restaurant = req.body;
  restaurant.id = uuid.v4(); // Add unique id to the restaurant
  const storedRestaurants = getStoredRestaurants();

  storedRestaurants.push(restaurant);

  storeRestaurants(storedRestaurants);

  res.redirect("/confirm");
});

app.get("/confirm", function (req, res) {
  res.render("confirm");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.use(function (req, res) {
  res.status(404).render("404");
});

app.use(function (error, req, res, next) {
  res.status(500).render("500");
});

app.listen(3000);
