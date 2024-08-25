const fs = require('fs');
const http = require('http');
const url = require('url');
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

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempHome.replace('{%RECIPE_CARDS%}', cardsHtml);

    res.end(output);

    // Recipe page
  } else if (pathname === '/recipe') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const recipe = dataObj[query.id];
    const output = replaceTemplate(tempRecipe, recipe);
    res.end(output);

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
