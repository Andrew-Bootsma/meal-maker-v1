const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');
const replaceTemplate = require('./modules/replaceTemplate');
const replaceIngredientTemplate = require('./modules/replaceIngredientTemplate');

let tempHome = fs.readFileSync(
  `${__dirname}/templates/template-home.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempRecipe = fs.readFileSync(
  `${__dirname}/templates/template-recipe.html`,
  'utf-8'
);
const tempIngredient = fs.readFileSync(
  `${__dirname}/templates/template-ingredient.html`,
  'utf-8'
);
const tempResetMeal = fs.readFileSync(
  `${__dirname}/templates/template-reset-meal.html`,
  'utf-8'
);

const recipeData = fs.readFileSync(
  `${__dirname}/dev-data/recipe-data.json`,
  'utf-8'
);
const recipeDataObj = JSON.parse(recipeData);

const mealData = fs.readFileSync(
  `${__dirname}/dev-data/meal-data.json`,
  'utf-8'
);
const mealDataObj = JSON.parse(mealData);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // Home page
  if (pathname === '/' || pathname === '/home') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const highProteinCardsHtml = recipeDataObj
      .filter((el) => el.highProtein === true)
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const lowProteinCardsHtml = recipeDataObj
      .filter((el) => el.highProtein === false)
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const mealHtml = mealDataObj.recipes
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const getOutput = () => {
      if (mealDataObj.recipes.length === 0) {
        let proteinPage = tempHome;
        proteinPage = proteinPage.replace(
          '{%RECIPE_CARDS%}',
          highProteinCardsHtml
        );
        proteinPage = proteinPage.replace('{%HIDE_RESETMEAL%}', 'hidden');
        return proteinPage.replace('{%RECIPE_CARDS%}', highProteinCardsHtml);
      }

      if (mealDataObj.recipes.length === 1) {
        let sideDishPage = tempHome;
        sideDishPage = sideDishPage.replace('{%HIDE_RESETMEAL%}', 'hidden');
        return sideDishPage.replace('{%RECIPE_CARDS%}', lowProteinCardsHtml);
      }

      let mealPage = tempHome;
      mealPage = mealPage.replace('{%RECIPE_CARDS%}', mealHtml);
      mealPage = mealPage.replace('{%RESET_MEAL%}', tempResetMeal);
      mealPage = mealPage.replaceAll('{%HIDE_BORDER%}', 'hideBorder');
      return mealPage.replaceAll('{%DISPLAY_NONE%}', 'hidden');
    };

    res.end(getOutput());

    // Recipe page
  } else if (pathname === '/recipe') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const recipe = recipeDataObj[query.id];
    const userServings = query.userServings || recipe.servingSize;

    const ingredients = Object.entries(recipe.ingredients).map(([key, value]) =>
      replaceIngredientTemplate(tempIngredient, value, key)
    );

    const adjustedRecipe = {
      ...recipe,
      servingSize: userServings,
      // ingredients: recipe.ingredients.map(ingredient => adjustIngredient(ingredient, recipe.servingSize, userServings)),
      calories: recipe.calories * userServings,
      protein: recipe.protein !== 'N/A' ? recipe.protein * userServings : 'N/A',
    };

    let output = replaceTemplate(tempRecipe, adjustedRecipe);
    output = output.replace('{%INGREDIENTS%}', ingredients.join(''));

    console.log(mealDataObj.recipes.length > 1);

    if (mealDataObj.recipes.length > 1) {
      output = output.replace('{%HIDE_ADD_TO_MEAL%}', 'hidden');
      output = output.replace('{%RESET_MEAL%}', tempResetMeal);
    } else {
      output = output.replace('{%RESET_MEAL%}', '');
    }

    res.end(output);

    // Add a recipe to meal
  } else if (pathname === '/add-to-meal') {
    const recipe = recipeDataObj.find((el) => el.id == query.id);
    if (recipe && !mealDataObj.recipes.some((fav) => fav.id == query.id)) {
      mealDataObj.recipes.push(recipe);
      fs.writeFileSync(
        `${__dirname}/dev-data/meal-data.json`,
        JSON.stringify(mealDataObj)
      );
    }
    res.writeHead(302, { Location: '/' });
    res.end();

    // Reset meal
  } else if (pathname === '/reset-meal') {
    mealDataObj.recipes = [];
    mealDataObj.protein = 0;
    mealDataObj.calories = 0;
    fs.writeFileSync(
      `${__dirname}/dev-data/meal-data.json`,
      JSON.stringify(mealDataObj)
    );
    res.writeHead(302, { Location: '/' });
    res.end();

    // Serve images
  } else if (pathname.startsWith('/images/')) {
    const filePath = path.join(__dirname, pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>Image not found!</h1>');
      } else {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(data);
      }
    });

    // Serve static files
  } else if (pathname.startsWith('/static/')) {
    const filePath = path.join(__dirname, pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>File not found!</h1>');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
      }
    });

    // Not found
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

if (require.main === module) {
  server.listen(8000, '127.0.0.1', () => {});
}

module.exports = server;
