const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');
const replaceTemplate = require('./modules/replaceTemplate');

const tempHome = fs.readFileSync(
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

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // Home page
  if (pathname === '/' || pathname === '/home') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj.recipes
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempHome.replace('{%RECIPE_CARDS%}', cardsHtml);

    res.end(output);

    // Recipe page
  } else if (pathname === '/recipe') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const recipe = dataObj.recipe[query.id];
    const userServings = query.userServings || recipe.servingSize;

    const adjustedRecipe = {
      ...recipe,
      servingSize: userServings,
      // ingredients: recipe.ingredients.map(ingredient => adjustIngredient(ingredient, recipe.servingSize, userServings)),
      calories: recipe.calories * userServings,
      protein: recipe.protein !== 'N/A' ? recipe.protein * userServings : 'N/A',
    };

    const output = replaceTemplate(tempRecipe, adjustedRecipe);
    res.end(output);

    // Add a recipe to meal
  } else if (pathname === '/add-to-meal') {
    const recipe = dataObj.recipes.find((el) => el.id == query.id);
    if (recipe && !dataObj.meal.some((fav) => fav.id == query.id)) {
      dataObj.meal.push(recipe);
      fs.writeFileSync(
        `${__dirname}/dev-data/data.json`,
        JSON.stringify(dataObj)
      );
    }
    res.writeHead(302, { Location: '/meal' });
    res.end();

    // View meal page
  } else if (pathname === '/meal') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const mealHtml = dataObj.meal
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempHome.replace('{%RECIPE_CARDS%}', mealHtml);

    res.end(output);

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
